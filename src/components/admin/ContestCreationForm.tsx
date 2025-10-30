import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Trophy,
  Calendar,
  Users,
  FileText,
  Award,
  X,
  Info,
  DollarSign,
  Hash,
  Target
} from 'lucide-react'
import { ContestsService, CreateContestData } from '../../services/admin/contests.service'

// Zod validation schema
const contestSchema = z.object({
  // Step 1: Basic Info
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title too long'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(2000, 'Description too long'),
  contest_type: z.enum(['open', 'invite_only']),

  // Step 2: Brand & Dates
  brand_name: z.string().optional(),
  brand_email: z.string().email('Invalid email').optional().or(z.literal('')),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),

  // Step 3: Prizes
  first_prize: z.string().min(1, 'First prize is required'),
  second_prize: z.string().optional(),
  third_prize: z.string().optional(),
  participation_reward: z.number().min(0, 'Must be 0 or greater').default(0),

  // Step 4: Rules & Requirements
  hashtag: z.string().min(1, 'Hashtag is required').regex(/^[a-zA-Z0-9_]+$/, 'Hashtag can only contain letters, numbers, and underscores'),
  min_followers: z.number().min(0, 'Must be 0 or greater').default(0),
  max_participants: z.number().min(0, 'Must be 0 or greater').optional(),
  additional_rules: z.string().optional(),
  content_guidelines: z.string().optional(),
  featured: z.boolean().default(false),
}).refine((data) => {
  // Validate that end date is after start date
  const start = new Date(data.start_date)
  const end = new Date(data.end_date)
  return end > start
}, {
  message: 'End date must be after start date',
  path: ['end_date']
})

type ContestFormData = z.infer<typeof contestSchema>

interface ContestCreationFormProps {
  onClose: () => void
  onSuccess: () => void
}

export function ContestCreationForm({ onClose, onSuccess }: ContestCreationFormProps) {
  const { t, i18n } = useTranslation()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    trigger
  } = useForm<ContestFormData>({
    resolver: zodResolver(contestSchema),
    defaultValues: {
      contest_type: 'open',
      participation_reward: 10,
      min_followers: 0,
      featured: false
    }
  })

  const contestType = watch('contest_type')
  const totalSteps = 5

  const steps = [
    { number: 1, title: t('contest.create.step1', 'Basic Information'), icon: FileText },
    { number: 2, title: t('contest.create.step2', 'Brand & Dates'), icon: Calendar },
    { number: 3, title: t('contest.create.step3', 'Prizes'), icon: Trophy },
    { number: 4, title: t('contest.create.step4', 'Rules & Requirements'), icon: Target },
    { number: 5, title: t('contest.create.step5', 'Review'), icon: Check }
  ]

  const handleNext = async () => {
    let fieldsToValidate: (keyof ContestFormData)[] = []

    switch (currentStep) {
      case 1:
        fieldsToValidate = ['title', 'description', 'contest_type']
        break
      case 2:
        fieldsToValidate = ['brand_name', 'brand_email', 'start_date', 'end_date']
        break
      case 3:
        fieldsToValidate = ['first_prize', 'second_prize', 'third_prize', 'participation_reward']
        break
      case 4:
        fieldsToValidate = ['hashtag', 'min_followers', 'max_participants', 'additional_rules', 'content_guidelines']
        break
    }

    const isValid = await trigger(fieldsToValidate)
    if (isValid) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    setCurrentStep(currentStep - 1)
  }

  const onSubmit = async (data: ContestFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Prepare data for submission
      const contestData: CreateContestData = {
        title: data.title,
        description: data.description,
        brand_name: data.brand_name || undefined,
        brand_email: data.brand_email || undefined,
        hashtag: data.hashtag,
        first_prize: data.first_prize,
        second_prize: data.second_prize || undefined,
        third_prize: data.third_prize || undefined,
        participation_reward: data.participation_reward || 0,
        start_date: data.start_date,
        end_date: data.end_date,
        min_followers: data.min_followers || 0,
        max_participants: data.max_participants || undefined,
        additional_rules: data.additional_rules || undefined,
        featured: data.featured || false,
        submission_deadline: data.end_date, // Use end_date as submission deadline
      }

      await ContestsService.createContest(contestData)

      // Success - close form and refresh
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Failed to create contest:', error)
      setSubmitError(error instanceof Error ? error.message : 'Failed to create contest')
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                {t('contest.create.title', 'Contest Title')} <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                {...register('title')}
                placeholder={t('contest.create.titlePlaceholder', 'e.g., Summer Dance Challenge 2025')}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                {t('contest.create.description', 'Description')} <span className="text-red-400">*</span>
              </label>
              <textarea
                {...register('description')}
                rows={5}
                placeholder={t('contest.create.descriptionPlaceholder', 'Describe your contest, what you\'re looking for, and what makes it exciting...')}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary resize-none"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-400">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-3">
                {t('contest.create.contestType', 'Contest Type')} <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  contestType === 'open'
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-surface/30 hover:border-primary/50'
                }`}>
                  <input
                    type="radio"
                    value="open"
                    {...register('contest_type')}
                    className="sr-only"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Users className="w-5 h-5 text-primary" />
                      <span className="font-medium text-white">{t('contest.create.openContest', 'Open Contest')}</span>
                    </div>
                    <p className="text-sm text-text-muted">
                      {t('contest.create.openContestDesc', 'Anyone can participate')}
                    </p>
                  </div>
                  {contestType === 'open' && (
                    <Check className="w-5 h-5 text-primary absolute top-2 right-2" />
                  )}
                </label>

                <label className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  contestType === 'invite_only'
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-surface/30 hover:border-primary/50'
                }`}>
                  <input
                    type="radio"
                    value="invite_only"
                    {...register('contest_type')}
                    className="sr-only"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Award className="w-5 h-5 text-primary" />
                      <span className="font-medium text-white">{t('contest.create.inviteOnlyContest', 'Invite-Only')}</span>
                    </div>
                    <p className="text-sm text-text-muted">
                      {t('contest.create.inviteOnlyContestDesc', 'Requires approval to join')}
                    </p>
                  </div>
                  {contestType === 'invite_only' && (
                    <Check className="w-5 h-5 text-primary absolute top-2 right-2" />
                  )}
                </label>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-surface/30 border border-border rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-white">
                    {t('contest.create.brandInfo', 'Brand information is optional. Leave blank if this is a SeeUTrending contest.')}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                {t('contest.create.brandName', 'Brand/Sponsor Name')}
              </label>
              <input
                type="text"
                {...register('brand_name')}
                placeholder={t('contest.create.brandNamePlaceholder', 'e.g., Nike, Coca-Cola, etc.')}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary"
              />
              {errors.brand_name && (
                <p className="mt-1 text-sm text-red-400">{errors.brand_name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                {t('contest.create.brandEmail', 'Brand Contact Email')}
              </label>
              <input
                type="email"
                {...register('brand_email')}
                placeholder={t('contest.create.brandEmailPlaceholder', 'contact@brand.com')}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary"
              />
              {errors.brand_email && (
                <p className="mt-1 text-sm text-red-400">{errors.brand_email.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  {t('contest.create.startDate', 'Start Date')} <span className="text-red-400">*</span>
                </label>
                <input
                  type="datetime-local"
                  {...register('start_date')}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white focus:outline-none focus:border-primary"
                />
                {errors.start_date && (
                  <p className="mt-1 text-sm text-red-400">{errors.start_date.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  {t('contest.create.endDate', 'End Date')} <span className="text-red-400">*</span>
                </label>
                <input
                  type="datetime-local"
                  {...register('end_date')}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white focus:outline-none focus:border-primary"
                />
                {errors.end_date && (
                  <p className="mt-1 text-sm text-red-400">{errors.end_date.message}</p>
                )}
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-surface/30 border border-border rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-3">
                <DollarSign className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-white">
                    {t('contest.create.prizeInfo', 'Enter prize descriptions (e.g., "10,000 PLN", "iPhone 15 Pro", "Brand Partnership")')}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                {t('contest.create.firstPrize', '1st Place Prize')} <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                {...register('first_prize')}
                placeholder={t('contest.create.firstPrizePlaceholder', 'e.g., 10,000 PLN')}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary"
              />
              {errors.first_prize && (
                <p className="mt-1 text-sm text-red-400">{errors.first_prize.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                {t('contest.create.secondPrize', '2nd Place Prize')}
              </label>
              <input
                type="text"
                {...register('second_prize')}
                placeholder={t('contest.create.secondPrizePlaceholder', 'e.g., 5,000 PLN')}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                {t('contest.create.thirdPrize', '3rd Place Prize')}
              </label>
              <input
                type="text"
                {...register('third_prize')}
                placeholder={t('contest.create.thirdPrizePlaceholder', 'e.g., 3,000 PLN')}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                {t('contest.create.participationReward', 'Participation Reward (XP)')}
              </label>
              <input
                type="number"
                {...register('participation_reward', { valueAsNumber: true })}
                placeholder="10"
                min="0"
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary"
              />
              <p className="mt-1 text-sm text-text-muted">
                {t('contest.create.participationRewardDesc', 'XP points awarded just for participating')}
              </p>
              {errors.participation_reward && (
                <p className="mt-1 text-sm text-red-400">{errors.participation_reward.message}</p>
              )}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                {t('contest.create.hashtag', 'Main Hashtag')} <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="text"
                  {...register('hashtag')}
                  placeholder={t('contest.create.hashtagPlaceholder', 'SummerDance2025')}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary"
                />
              </div>
              <p className="mt-1 text-sm text-text-muted">
                {t('contest.create.hashtagDesc', 'Without the # symbol. Only letters, numbers, and underscores.')}
              </p>
              {errors.hashtag && (
                <p className="mt-1 text-sm text-red-400">{errors.hashtag.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  {t('contest.create.minFollowers', 'Minimum Followers')}
                </label>
                <input
                  type="number"
                  {...register('min_followers', { valueAsNumber: true })}
                  placeholder="0"
                  min="0"
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary"
                />
                {errors.min_followers && (
                  <p className="mt-1 text-sm text-red-400">{errors.min_followers.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  {t('contest.create.maxParticipants', 'Max Participants')}
                </label>
                <input
                  type="number"
                  {...register('max_participants', { valueAsNumber: true })}
                  placeholder={t('contest.create.maxParticipantsPlaceholder', 'Unlimited')}
                  min="0"
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                {t('contest.create.contentGuidelines', 'Content Guidelines')}
              </label>
              <textarea
                {...register('content_guidelines')}
                rows={4}
                placeholder={t('contest.create.contentGuidelinesPlaceholder', 'e.g., Videos must be original, minimum 15 seconds, family-friendly content...')}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                {t('contest.create.additionalRules', 'Additional Rules')}
              </label>
              <textarea
                {...register('additional_rules')}
                rows={4}
                placeholder={t('contest.create.additionalRulesPlaceholder', 'Any other rules or requirements...')}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary resize-none"
              />
            </div>

            <div className="flex items-center space-x-3 p-4 bg-surface/30 border border-border rounded-lg">
              <input
                type="checkbox"
                id="featured"
                {...register('featured')}
                className="w-5 h-5 rounded border-border bg-background text-primary focus:ring-primary"
              />
              <label htmlFor="featured" className="text-white cursor-pointer flex-1">
                {t('contest.create.featured', 'Feature this contest on the homepage')}
              </label>
            </div>
          </div>
        )

      case 5:
        const formData = watch()
        return (
          <div className="space-y-6">
            <div className="bg-surface/30 border border-border rounded-lg p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  {t('contest.create.reviewTitle', 'Review Contest Details')}
                </h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <FileText className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-text-muted">{t('contest.create.title', 'Title')}</p>
                    <p className="text-white font-medium">{formData.title}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-text-muted">{t('contest.create.contestType', 'Type')}</p>
                    <p className="text-white font-medium capitalize">{formData.contest_type.replace('_', ' ')}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-text-muted">{t('contest.create.dates', 'Dates')}</p>
                    <p className="text-white font-medium">
                      {new Date(formData.start_date).toLocaleDateString()} - {new Date(formData.end_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Trophy className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-text-muted">{t('contest.create.prizes', 'Prizes')}</p>
                    <div className="space-y-1">
                      <p className="text-white font-medium">1st: {formData.first_prize}</p>
                      {formData.second_prize && <p className="text-white font-medium">2nd: {formData.second_prize}</p>}
                      {formData.third_prize && <p className="text-white font-medium">3rd: {formData.third_prize}</p>}
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Hash className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-text-muted">{t('contest.create.hashtag', 'Hashtag')}</p>
                    <p className="text-white font-medium">#{formData.hashtag}</p>
                  </div>
                </div>

                {formData.brand_name && (
                  <div className="flex items-start space-x-3">
                    <Award className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-text-muted">{t('contest.create.brandName', 'Brand')}</p>
                      <p className="text-white font-medium">{formData.brand_name}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {submitError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <p className="text-red-400 text-sm">{submitError}</p>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {t('contest.create.formTitle', 'Create New Contest')}
            </h2>
            <p className="text-text-muted text-sm mt-1">
              {t('contest.create.formSubtitle', 'Step')} {currentStep} {t('contest.create.of', 'of')} {totalSteps}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-light rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-text-muted" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-6">
          <div className="flex items-center justify-between mb-6">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.number
              const isCompleted = currentStep > step.number

              return (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center transition-all
                      ${isActive ? 'bg-primary text-white' : ''}
                      ${isCompleted ? 'bg-primary/20 text-primary' : ''}
                      ${!isActive && !isCompleted ? 'bg-surface-light text-text-muted' : ''}
                    `}>
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <p className={`text-xs mt-2 text-center hidden md:block ${
                      isActive ? 'text-white font-medium' : 'text-text-muted'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-2 ${
                      isCompleted ? 'bg-primary' : 'bg-surface-light'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            {renderStepContent()}
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center space-x-2 px-6 py-3 text-text-muted hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t('contest.create.back', 'Back')}</span>
          </button>

          <div className="flex items-center space-x-3">
            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center space-x-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors"
              >
                <span>{t('contest.create.next', 'Next')}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{t('contest.create.creating', 'Creating...')}</span>
                  </>
                ) : (
                  <>
                    <Trophy className="w-5 h-5" />
                    <span>{t('contest.create.createContest', 'Create Contest')}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
