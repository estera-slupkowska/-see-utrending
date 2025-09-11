import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Upload, Check, AlertTriangle, ExternalLink, Play, Eye, Heart, MessageCircle } from 'lucide-react'
import { videoMetricsService } from '../../services/tiktok/video.service'
import { tikTokApi } from '../../services/tiktok/api.service'
import { useAuth } from '../../lib/auth/context'
import { useGamificationStore } from '../../stores/gamification.store'

const submissionSchema = z.object({
  tiktok_url: z
    .string()
    .min(1, 'TikTok URL is required')
    .refine(
      (url) => tikTokApi.isValidTikTokUrl(url),
      'Please enter a valid TikTok video URL'
    ),
})

type SubmissionFormData = z.infer<typeof submissionSchema>

interface Contest {
  id: string
  title: string
  description: string
  hashtag: string
  start_date: string
  end_date: string
  status: 'draft' | 'active' | 'completed' | 'cancelled'
  first_prize?: string
  second_prize?: string
  third_prize?: string
  participation_reward: number
  min_followers: number
  max_participants?: number
  total_submissions: number
}

interface SubmissionFormProps {
  contest: Contest
  onSubmissionSuccess?: (submission: any) => void
  onClose?: () => void
}

interface VideoPreview {
  id: string
  title?: string
  description?: string
  views: number
  likes: number
  comments: number
  shares: number
  thumbnail?: string
  duration: number
}

export function SubmissionForm({ contest, onSubmissionSuccess, onClose }: SubmissionFormProps) {
  const { user } = useAuth()
  const { awardXP } = useGamificationStore()
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [videoPreview, setVideoPreview] = useState<VideoPreview | null>(null)
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    reset
  } = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionSchema),
    mode: 'onChange'
  })

  const watchedUrl = watch('tiktok_url')

  React.useEffect(() => {
    const loadPreview = async () => {
      if (!watchedUrl || !tikTokApi.isValidTikTokUrl(watchedUrl)) {
        setVideoPreview(null)
        return
      }

      setIsLoadingPreview(true)
      setVideoPreview(null)

      try {
        // In a real implementation, this would fetch from TikTok API
        // For now, we'll simulate the preview data
        const videoId = tikTokApi.extractVideoId(watchedUrl)
        
        if (videoId) {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          setVideoPreview({
            id: videoId,
            title: 'Sample TikTok Video',
            description: `Sample video description with ${contest.hashtag}`,
            views: Math.floor(Math.random() * 100000),
            likes: Math.floor(Math.random() * 10000),
            comments: Math.floor(Math.random() * 1000),
            shares: Math.floor(Math.random() * 500),
            duration: 30,
          })
        }
      } catch (error) {
        console.error('Failed to load video preview:', error)
      } finally {
        setIsLoadingPreview(false)
      }
    }

    const debounceTimer = setTimeout(loadPreview, 500)
    return () => clearTimeout(debounceTimer)
  }, [watchedUrl, contest.hashtag])

  const onSubmit = async (data: SubmissionFormData) => {
    if (!user) return

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const submission = await videoMetricsService.submitVideoToContest(
        contest.id,
        user.id,
        data.tiktok_url
      )

      // Award participation XP
      await awardXP(user.id, contest.participation_reward, 'Contest participation')

      setSubmitSuccess(true)
      onSubmissionSuccess?.(submission)
      
      // Reset form after success
      setTimeout(() => {
        reset()
        setVideoPreview(null)
        setSubmitSuccess(false)
      }, 2000)
      
    } catch (error: any) {
      setSubmitError(error.message || 'Failed to submit video')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isContestActive = contest.status === 'active'
  const contestHasEnded = new Date(contest.end_date) < new Date()
  const canSubmit = isContestActive && !contestHasEnded && user

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Submit Your Video</h3>
            <p className="text-gray-400">
              Contest: {contest.title}
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Contest Info */}
        <div className="bg-gray-800/30 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="text-gray-400">
                Hashtag: <span className="text-primary font-medium">{contest.hashtag}</span>
              </div>
              <div className="text-gray-400">
                Reward: <span className="text-green-400 font-medium">+{contest.participation_reward} XP</span>
              </div>
            </div>
            <div className="text-gray-400">
              Submissions: <span className="text-white">{contest.total_submissions}</span>
            </div>
          </div>
        </div>

        {/* Eligibility Check */}
        {!canSubmit && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">
                {!user && 'Please log in to submit'}
                {user && !isContestActive && 'Contest is not active'}
                {user && contestHasEnded && 'Contest has ended'}
              </span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* URL Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              TikTok Video URL
            </label>
            <div className="relative">
              <input
                {...register('tiktok_url')}
                type="url"
                placeholder="https://www.tiktok.com/@username/video/..."
                disabled={!canSubmit || isSubmitting || submitSuccess}
                className="
                  w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg
                  text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              />
              {isLoadingPreview && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <motion.div
                    className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              )}
            </div>
            {errors.tiktok_url && (
              <p className="text-red-400 text-sm mt-1">{errors.tiktok_url.message}</p>
            )}
          </div>

          {/* Video Preview */}
          <AnimatePresence>
            {videoPreview && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gray-800/30 rounded-lg p-4 border border-gray-600"
              >
                <div className="flex items-center space-x-2 mb-3">
                  <Play className="w-5 h-5 text-primary" />
                  <span className="font-medium text-white">Video Preview</span>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-white font-medium">{videoPreview.title}</p>
                    <p className="text-gray-400 text-sm">{videoPreview.description}</p>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-1 text-gray-300">
                      <Eye className="w-4 h-4" />
                      <span>{videoPreview.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-red-400">
                      <Heart className="w-4 h-4" />
                      <span>{videoPreview.likes.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-blue-400">
                      <MessageCircle className="w-4 h-4" />
                      <span>{videoPreview.comments.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Duration: {videoPreview.duration}s</span>
                    <a
                      href={watchedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-primary hover:text-primary/80"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>View on TikTok</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Display */}
          <AnimatePresence>
            {submitError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-500/10 border border-red-500/30 rounded-lg p-4"
              >
                <div className="flex items-center space-x-2 text-red-400">
                  <AlertTriangle className="w-5 h-5" />
                  <span>{submitError}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Display */}
          <AnimatePresence>
            {submitSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-green-500/10 border border-green-500/30 rounded-lg p-4"
              >
                <div className="flex items-center space-x-2 text-green-400">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">Video submitted successfully!</span>
                </div>
                <p className="text-green-300 text-sm mt-2">
                  Your video is now being reviewed and will appear on the leaderboard once approved.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={!canSubmit || !isValid || isSubmitting || submitSuccess}
            className="
              w-full flex items-center justify-center space-x-2 py-3 px-6
              bg-gradient-to-r from-primary to-accent text-white font-medium rounded-lg
              hover:shadow-lg hover:shadow-primary/25 transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none
            "
            whileHover={canSubmit && isValid && !isSubmitting ? { scale: 1.02 } : undefined}
            whileTap={canSubmit && isValid && !isSubmitting ? { scale: 0.98 } : undefined}
          >
            {isSubmitting ? (
              <>
                <motion.div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span>Submitting...</span>
              </>
            ) : submitSuccess ? (
              <>
                <Check className="w-5 h-5" />
                <span>Submitted!</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                <span>Submit Video</span>
              </>
            )}
          </motion.button>
        </form>

        {/* Contest Rules */}
        <div className="mt-6 pt-6 border-t border-gray-700">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Submission Rules:</h4>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• Video must include the hashtag {contest.hashtag}</li>
            <li>• Only one submission per contest allowed</li>
            <li>• Video must be your original content</li>
            {contest.min_followers > 0 && (
              <li>• Minimum {contest.min_followers.toLocaleString()} followers required</li>
            )}
            <li>• Submissions are reviewed before appearing on leaderboard</li>
            <li>• Winners announced after contest ends</li>
          </ul>
        </div>
      </div>
    </motion.div>
  )
}