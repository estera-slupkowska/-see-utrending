import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Shield, Eye, Database, Lock, Cookie, Mail, UserCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-primary/20 rounded-lg">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
              <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-8 space-y-8"
        >
          {/* Introduction */}
          <section>
            <div className="flex items-center space-x-2 mb-4">
              <Eye className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-white">Introduction</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              SeeUTrending ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you use our platform for TikTok creator contests and gamification.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <div className="flex items-center space-x-2 mb-4">
              <Database className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-white">1. Information We Collect</h3>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-white font-medium mb-2">Account Information</h4>
                <ul className="text-gray-300 space-y-1 leading-relaxed ml-4">
                  <li>• Email address and name for account creation</li>
                  <li>• Profile information you provide (bio, avatar, preferences)</li>
                  <li>• Account preferences and settings</li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-medium mb-2">TikTok Integration Data</h4>
                <ul className="text-gray-300 space-y-1 leading-relaxed ml-4">
                  <li>• TikTok username, display name, and profile information</li>
                  <li>• Follower count and basic account statistics</li>
                  <li>• Video URLs and metadata for contest submissions</li>
                  <li>• Video performance metrics (views, likes, comments, shares)</li>
                  <li>• OAuth tokens (encrypted and securely stored)</li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-medium mb-2">Platform Activity</h4>
                <ul className="text-gray-300 space-y-1 leading-relaxed ml-4">
                  <li>• Contest submissions and participation history</li>
                  <li>• XP points, badges, and achievement progress</li>
                  <li>• Leaderboard rankings and scores</li>
                  <li>• Platform usage and interaction data</li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-medium mb-2">Technical Information</h4>
                <ul className="text-gray-300 space-y-1 leading-relaxed ml-4">
                  <li>• IP address and browser information</li>
                  <li>• Device type and operating system</li>
                  <li>• Platform usage analytics and performance data</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-3">2. How We Use Your Information</h3>
            <p className="text-gray-300 leading-relaxed mb-4">We use the collected information to:</p>
            <ul className="text-gray-300 space-y-2 leading-relaxed">
              <li>• Provide and maintain our contest platform services</li>
              <li>• Authenticate your account and enable TikTok integration</li>
              <li>• Track contest submissions and calculate rankings</li>
              <li>• Award XP points, badges, and other gamification rewards</li>
              <li>• Send notifications about contests, achievements, and platform updates</li>
              <li>• Generate analytics and insights for creators and brands</li>
              <li>• Improve our platform functionality and user experience</li>
              <li>• Prevent fraud and ensure fair contest participation</li>
              <li>• Comply with legal obligations and enforce our Terms of Service</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-3">3. Information Sharing and Disclosure</h3>
            <p className="text-gray-300 leading-relaxed mb-4">We may share your information in the following circumstances:</p>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-white font-medium mb-2">Public Information</h4>
                <ul className="text-gray-300 space-y-1 leading-relaxed ml-4">
                  <li>• Leaderboard rankings and contest performance (with username/handle)</li>
                  <li>• Badge achievements and XP levels (if you choose to display them)</li>
                  <li>• Contest submission metadata (video title, performance stats)</li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-medium mb-2">Brand Partners</h4>
                <ul className="text-gray-300 space-y-1 leading-relaxed ml-4">
                  <li>• Aggregated, anonymous contest performance data</li>
                  <li>• Creator performance metrics for sponsored contests (with consent)</li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-medium mb-2">Service Providers</h4>
                <ul className="text-gray-300 space-y-1 leading-relaxed ml-4">
                  <li>• Analytics and hosting service providers</li>
                  <li>• Email and notification service providers</li>
                  <li>• Authentication and security service providers</li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-medium mb-2">Legal Requirements</h4>
                <ul className="text-gray-300 space-y-1 leading-relaxed ml-4">
                  <li>• When required by law or legal process</li>
                  <li>• To protect our rights, property, or safety</li>
                  <li>• To prevent fraud or abuse of our platform</li>
                </ul>
              </div>
            </div>
          </section>

          {/* TikTok Integration Privacy */}
          <section>
            <div className="flex items-center space-x-2 mb-3">
              <UserCheck className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-white">4. TikTok Integration Privacy</h3>
            </div>
            <ul className="text-gray-300 space-y-2 leading-relaxed">
              <li>• We only access TikTok data you explicitly authorize through OAuth</li>
              <li>• TikTok access tokens are encrypted and securely stored</li>
              <li>• You can disconnect your TikTok account at any time</li>
              <li>• We comply with TikTok's privacy policies and data protection requirements</li>
              <li>• We do not store or access your TikTok password</li>
              <li>• Video content remains on TikTok - we only store metadata and performance metrics</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <div className="flex items-center space-x-2 mb-3">
              <Lock className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-white">5. Data Security</h3>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">We implement appropriate security measures to protect your information:</p>
            <ul className="text-gray-300 space-y-2 leading-relaxed">
              <li>• End-to-end encryption for sensitive data transmission</li>
              <li>• Encrypted storage of TikTok OAuth tokens</li>
              <li>• Regular security audits and vulnerability assessments</li>
              <li>• Access controls and authentication for our systems</li>
              <li>• Secure database hosting with backup and recovery procedures</li>
            </ul>
          </section>

          {/* Data Retention */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-3">6. Data Retention</h3>
            <ul className="text-gray-300 space-y-2 leading-relaxed">
              <li>• Account data is retained while your account is active</li>
              <li>• Contest and gamification data is retained for historical tracking</li>
              <li>• TikTok integration data is deleted when you disconnect your account</li>
              <li>• Analytics data may be retained in aggregated, anonymized form</li>
              <li>• You can request data deletion by contacting us</li>
            </ul>
          </section>

          {/* Your Rights (GDPR Compliance) */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-3">7. Your Privacy Rights</h3>
            <p className="text-gray-300 leading-relaxed mb-4">Under applicable privacy laws, you have the right to:</p>
            <ul className="text-gray-300 space-y-2 leading-relaxed">
              <li>• <strong>Access:</strong> Request a copy of your personal data</li>
              <li>• <strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
              <li>• <strong>Erasure:</strong> Request deletion of your personal data</li>
              <li>• <strong>Portability:</strong> Receive your data in a portable format</li>
              <li>• <strong>Restriction:</strong> Limit how we process your data</li>
              <li>• <strong>Objection:</strong> Object to certain processing activities</li>
              <li>• <strong>Withdraw Consent:</strong> Revoke consent for data processing</li>
            </ul>
          </section>

          {/* Cookies */}
          <section>
            <div className="flex items-center space-x-2 mb-3">
              <Cookie className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-white">8. Cookies and Tracking</h3>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">We use cookies and similar technologies to:</p>
            <ul className="text-gray-300 space-y-2 leading-relaxed">
              <li>• Maintain your login session and preferences</li>
              <li>• Analyze platform usage and improve functionality</li>
              <li>• Provide personalized content and recommendations</li>
              <li>• Enable social media integrations and sharing</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              You can control cookie settings through your browser preferences.
            </p>
          </section>

          {/* International Transfers */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-3">9. International Data Transfers</h3>
            <p className="text-gray-300 leading-relaxed">
              Your information may be processed and stored in countries other than Poland. We ensure appropriate safeguards 
              are in place to protect your data during international transfers, including using Standard Contractual Clauses 
              and working with service providers that comply with EU data protection standards.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-3">10. Children's Privacy</h3>
            <p className="text-gray-300 leading-relaxed">
              Our service is intended for users aged 13 and older. We do not knowingly collect personal information from children 
              under 13. If we become aware that we have collected data from a child under 13, we will take steps to delete such information.
            </p>
          </section>

          {/* Changes to Privacy Policy */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-3">11. Changes to This Privacy Policy</h3>
            <p className="text-gray-300 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy 
              on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          {/* Contact */}
          <section className="border-t border-gray-600 pt-6">
            <div className="flex items-center space-x-2 mb-3">
              <Mail className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-white">Contact Information</h3>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy or your personal data, please contact us:
            </p>
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <p className="text-white font-medium">SeeUTrending Data Protection Officer</p>
              <p className="text-gray-300">Email: privacy@seeutrending.com</p>
              <p className="text-gray-300">Website: seeutrending.com</p>
              <p className="text-gray-300 mt-2 text-sm">
                For EU residents: You also have the right to lodge a complaint with your local data protection authority.
              </p>
            </div>
          </section>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-8"
        >
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} SeeUTrending. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  )
}