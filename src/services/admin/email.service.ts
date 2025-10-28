import { supabase } from '../../lib/supabase/client'
import { Resend } from 'resend'

// Initialize Resend (will need API key in environment variables)
const resend = import.meta.env.VITE_RESEND_API_KEY
  ? new Resend(import.meta.env.VITE_RESEND_API_KEY)
  : null

// Development mode flag
const DEV_MODE = !import.meta.env.VITE_RESEND_API_KEY

export type EmailCampaignStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed'

export interface EmailCampaign {
  id: string
  subject: string
  preview_text?: string
  html_content: string
  plain_text_content?: string

  from_name: string
  from_email: string
  reply_to?: string

  target_audience: {
    all?: boolean
    roles?: string[]
    filters?: Record<string, any>
  }

  status: EmailCampaignStatus
  scheduled_at?: string
  sent_at?: string

  total_recipients: number
  total_sent: number
  total_delivered: number
  total_opened: number
  total_clicked: number
  total_bounced: number
  total_complained: number

  created_by?: string
  created_at: string
  updated_at: string
}

export interface CreateEmailCampaignData {
  subject: string
  preview_text?: string
  html_content: string
  plain_text_content?: string
  from_name?: string
  from_email?: string
  reply_to?: string
  target_audience?: {
    all?: boolean
    roles?: string[]
    filters?: Record<string, any>
  }
  scheduled_at?: string
}

export interface EmailRecipient {
  id: string
  campaign_id: string
  user_id: string
  email: string
  tracking_token: string

  sent_at?: string
  delivered_at?: string
  opened_at?: string
  clicked_at?: string
  bounced_at?: string
  complained_at?: string

  error_message?: string

  created_at: string
  updated_at: string
}

export interface CampaignStats {
  total_recipients: number
  total_sent: number
  total_delivered: number
  total_opened: number
  total_clicked: number
  total_bounced: number
  total_complained: number
  open_rate: number
  click_rate: number
}

export class EmailService {
  // ==================== Campaign Management ====================

  // Get all campaigns
  static async getCampaigns(options?: {
    status?: EmailCampaignStatus
    limit?: number
    offset?: number
  }) {
    let query = supabase
      .from('email_campaigns')
      .select('*')
      .order('created_at', { ascending: false })

    if (options?.status) {
      query = query.eq('status', options.status)
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to fetch campaigns: ${error.message}`)
    }

    return data as EmailCampaign[]
  }

  // Get campaign by ID
  static async getCampaignById(id: string) {
    const { data, error } = await supabase
      .from('email_campaigns')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw new Error(`Failed to fetch campaign: ${error.message}`)
    }

    return data as EmailCampaign
  }

  // Create new campaign
  static async createCampaign(campaignData: CreateEmailCampaignData) {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Not authenticated')
    }

    const { data, error } = await supabase
      .from('email_campaigns')
      .insert([{
        ...campaignData,
        from_name: campaignData.from_name || 'SeeUTrending',
        from_email: campaignData.from_email || 'noreply@seeutrending.com',
        target_audience: campaignData.target_audience || { all: true },
        status: campaignData.scheduled_at ? 'scheduled' : 'draft',
        created_by: user.id
      }])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create campaign: ${error.message}`)
    }

    return data as EmailCampaign
  }

  // Update campaign
  static async updateCampaign(id: string, updates: Partial<CreateEmailCampaignData>) {
    const { data, error } = await supabase
      .from('email_campaigns')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update campaign: ${error.message}`)
    }

    return data as EmailCampaign
  }

  // Delete campaign
  static async deleteCampaign(id: string) {
    const { error } = await supabase
      .from('email_campaigns')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to delete campaign: ${error.message}`)
    }

    return true
  }

  // ==================== Sending Emails ====================

  // Get recipients for a campaign based on targeting
  static async getTargetedRecipients(targetAudience: EmailCampaign['target_audience']) {
    let query = supabase
      .from('profiles')
      .select('id, email, name, role')

    // Filter by roles if specified
    if (targetAudience.roles && targetAudience.roles.length > 0) {
      query = query.in('role', targetAudience.roles)
    }

    // Add custom filters if specified
    if (targetAudience.filters) {
      Object.entries(targetAudience.filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to fetch recipients: ${error.message}`)
    }

    return data
  }

  // Send campaign to all recipients
  static async sendCampaign(campaignId: string) {
    // Get campaign
    const campaign = await this.getCampaignById(campaignId)

    if (campaign.status === 'sent') {
      throw new Error('Campaign already sent')
    }

    // Update status to sending
    await supabase
      .from('email_campaigns')
      .update({ status: 'sending' })
      .eq('id', campaignId)

    try {
      // Get target recipients
      const users = await this.getTargetedRecipients(campaign.target_audience)

      // Create recipient records
      const recipients = users.map(user => ({
        campaign_id: campaignId,
        user_id: user.id,
        email: user.email
      }))

      const { data: recipientRecords, error: recipientError } = await supabase
        .from('email_recipients')
        .insert(recipients)
        .select()

      if (recipientError) {
        throw new Error(`Failed to create recipients: ${recipientError.message}`)
      }

      // Update campaign with total recipients
      await supabase
        .from('email_campaigns')
        .update({ total_recipients: recipients.length })
        .eq('id', campaignId)

      // Send emails via Resend (in chunks to avoid rate limits)
      const chunkSize = 10
      let totalSent = 0

      for (let i = 0; i < recipientRecords.length; i += chunkSize) {
        const chunk = recipientRecords.slice(i, i + chunkSize)

        await Promise.all(chunk.map(async (recipient) => {
          try {
            if (DEV_MODE) {
              // Development mode - simulate email sending without Resend
              console.log(`[DEV MODE] Would send email to ${recipient.email}`)
              console.log(`Subject: ${campaign.subject}`)

              // Simulate delay
              await new Promise(resolve => setTimeout(resolve, 100))
            } else {
              // Production mode - actually send via Resend
              const html = this.injectTracking(campaign.html_content, recipient.tracking_token, campaignId)

              await resend!.emails.send({
                from: `${campaign.from_name} <${campaign.from_email}>`,
                to: recipient.email,
                subject: campaign.subject,
                html: html,
                text: campaign.plain_text_content,
                replyTo: campaign.reply_to
              })
            }

            // Mark as sent
            await supabase
              .from('email_recipients')
              .update({
                sent_at: new Date().toISOString(),
                delivered_at: new Date().toISOString() // Simulate delivery in dev mode
              })
              .eq('id', recipient.id)

            totalSent++
          } catch (error) {
            console.error(`Failed to send to ${recipient.email}:`, error)

            // Log error
            await supabase
              .from('email_recipients')
              .update({
                error_message: error instanceof Error ? error.message : 'Unknown error'
              })
              .eq('id', recipient.id)
          }
        }))

        // Small delay between chunks
        if (i + chunkSize < recipientRecords.length) {
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      }

      // Update campaign status
      await supabase
        .from('email_campaigns')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString(),
          total_sent: totalSent
        })
        .eq('id', campaignId)

      return { sent: totalSent, total: recipients.length }

    } catch (error) {
      // Mark campaign as failed
      await supabase
        .from('email_campaigns')
        .update({ status: 'failed' })
        .eq('id', campaignId)

      throw error
    }
  }

  // Inject tracking pixel and wrap links
  private static injectTracking(html: string, trackingToken: string, campaignId: string) {
    // Add tracking pixel
    const trackingPixel = `<img src="${import.meta.env.VITE_APP_URL}/api/track/open/${trackingToken}" width="1" height="1" style="display:none" />`

    // Wrap all links with tracking
    const wrappedHtml = html.replace(
      /<a\s+([^>]*href=["']([^"']+)["'][^>]*)>/gi,
      (match, attrs, url) => {
        const trackUrl = `${import.meta.env.VITE_APP_URL}/api/track/click/${trackingToken}?url=${encodeURIComponent(url)}`
        return `<a ${attrs.replace(/href=["'][^"']+["']/, `href="${trackUrl}"`)}>`
      }
    )

    return `${wrappedHtml}${trackingPixel}`
  }

  // ==================== Tracking ====================

  // Track email open
  static async trackOpen(trackingToken: string) {
    const { error } = await supabase
      .from('email_recipients')
      .update({ opened_at: new Date().toISOString() })
      .eq('tracking_token', trackingToken)
      .is('opened_at', null) // Only update if not already opened

    if (error) {
      console.error('Failed to track open:', error)
    }
  }

  // Track email click
  static async trackClick(trackingToken: string, url: string, userAgent?: string, ipAddress?: string) {
    // Get recipient
    const { data: recipient } = await supabase
      .from('email_recipients')
      .select('id')
      .eq('tracking_token', trackingToken)
      .single()

    if (!recipient) {
      console.error('Recipient not found for tracking token')
      return
    }

    // Mark as clicked if not already
    await supabase
      .from('email_recipients')
      .update({ clicked_at: new Date().toISOString() })
      .eq('tracking_token', trackingToken)
      .is('clicked_at', null)

    // Log click
    await supabase
      .from('email_clicks')
      .insert([{
        recipient_id: recipient.id,
        url,
        user_agent: userAgent,
        ip_address: ipAddress
      }])
  }

  // ==================== Statistics ====================

  // Get campaign stats
  static async getCampaignStats(campaignId: string): Promise<CampaignStats> {
    const { data, error } = await supabase
      .rpc('get_campaign_stats', { campaign_uuid: campaignId })
      .single()

    if (error) {
      throw new Error(`Failed to get campaign stats: ${error.message}`)
    }

    return data
  }

  // Get overall email stats
  static async getOverallStats() {
    const { data: campaigns } = await supabase
      .from('email_campaigns')
      .select('total_recipients, total_sent, total_delivered, total_opened, total_clicked')

    if (!campaigns) {
      return {
        totalCampaigns: 0,
        totalRecipients: 0,
        totalSent: 0,
        totalOpened: 0,
        totalClicked: 0,
        averageOpenRate: 0,
        averageClickRate: 0
      }
    }

    const totals = campaigns.reduce(
      (acc, campaign) => ({
        recipients: acc.recipients + (campaign.total_recipients || 0),
        sent: acc.sent + (campaign.total_sent || 0),
        delivered: acc.delivered + (campaign.total_delivered || 0),
        opened: acc.opened + (campaign.total_opened || 0),
        clicked: acc.clicked + (campaign.total_clicked || 0)
      }),
      { recipients: 0, sent: 0, delivered: 0, opened: 0, clicked: 0 }
    )

    return {
      totalCampaigns: campaigns.length,
      totalRecipients: totals.recipients,
      totalSent: totals.sent,
      totalOpened: totals.opened,
      totalClicked: totals.clicked,
      averageOpenRate: totals.delivered > 0 ? (totals.opened / totals.delivered) * 100 : 0,
      averageClickRate: totals.opened > 0 ? (totals.clicked / totals.opened) * 100 : 0
    }
  }

  // ==================== Test Email ====================

  // Send test email
  static async sendTestEmail(campaignId: string, testEmail: string) {
    const campaign = await this.getCampaignById(campaignId)

    try {
      if (DEV_MODE) {
        // Development mode - simulate test email
        console.log(`[DEV MODE] Would send test email to ${testEmail}`)
        console.log(`Subject: [TEST] ${campaign.subject}`)
        console.log(`From: ${campaign.from_name} <${campaign.from_email}>`)
        console.log(`HTML Content Length: ${campaign.html_content.length} characters`)

        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 500))

        return { success: true, message: 'Test email simulated in dev mode (check console)' }
      } else {
        // Production mode - actually send via Resend
        await resend!.emails.send({
          from: `${campaign.from_name} <${campaign.from_email}>`,
          to: testEmail,
          subject: `[TEST] ${campaign.subject}`,
          html: `<div style="background: #fff3cd; padding: 10px; margin-bottom: 20px; border: 1px solid #ffc107;">
            <strong>⚠️ This is a test email</strong>
          </div>${campaign.html_content}`,
          text: campaign.plain_text_content
        })

        return { success: true }
      }
    } catch (error) {
      throw new Error(`Failed to send test email: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}
