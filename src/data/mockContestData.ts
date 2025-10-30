/**
 * Mock Contest Data for Preview/Demo
 * Realistic Polish creator names with video submissions and stats
 */

export interface MockVideo {
  id: string
  thumbnail: string
  tiktok_url: string
  views: number
  organic_views: number
  likes: number
  comments: number
  shares: number
  submitted_at: string
}

export interface MockCreator {
  id: string
  name: string
  tiktok_handle: string
  tiktok_url: string
  avatar_url: string
  total_views: number
  total_organic_views: number
  total_likes: number
  videos: MockVideo[]
}

// Generate realistic Polish creator names
const polishNames = [
  'Paweł Kowalski', 'Anna Nowak', 'Michał Wiśniewski', 'Katarzyna Zielińska',
  'Jakub Lewandowski', 'Magdalena Kamińska', 'Piotr Dąbrowski', 'Ewa Szymańska',
  'Tomasz Woźniak', 'Agnieszka Kozłowska', 'Mateusz Jankowski', 'Natalia Wojciechowska',
  'Krzysztof Kwiatkowski', 'Julia Krawczyk', 'Bartosz Piotrowski', 'Aleksandra Grabowska',
  'Adam Nowakowski', 'Weronika Pawłowska', 'Kamil Zając', 'Oliwia Michalska',
  'Łukasz Król', 'Martyna Wieczorek', 'Sebastian Jabłoński', 'Karolina Majewska',
  'Filip Nowicki', 'Dominika Olszewska', 'Maciej Stępień', 'Paulina Dudek',
  'Dawid Górski', 'Zuzanna Witkowska', 'Grzegorz Walczak', 'Emilia Rutkowska',
  'Szymon Sikora', 'Wiktoria Baran', 'Rafał Kowalczyk', 'Nikola Szewczyk',
  'Marcin Tomaszewski', 'Amelia Duda', 'Daniel Marciniak', 'Lena Włodarczyk',
  'Kacper Pawlak', 'Klaudia Adamczyk', 'Robert Jasinski', 'Kornelia Sobczak',
  'Wojciech Zawadzki', 'Maja Kaczmarek', 'Adrian Borkowski', 'Natalia Sadowska',
  'Igor Chmielewski', 'Gabriela Lis', 'Hubert Maciejewski', 'Sara Czerwińska',
  'Oskar Kalinowski', 'Zofia Mazur', 'Patryk Urban', 'Liliana Wrona',
  'Denis Kubiak', 'Helena Szczepańska', 'Norbert Błaszczyk', 'Alicja Górecka',
  'Marcel Pietrzak', 'Milena Kucharska', 'Eryk Sobczyk', 'Antonina Zakrzewska'
]

// Helper function to generate random number in range
const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min

// Helper function to generate date in the past 7 days
const randomRecentDate = () => {
  const now = new Date()
  const daysAgo = randomInt(0, 7)
  const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
  return date.toISOString()
}

// Generate mock video for a creator
const generateMockVideo = (creatorHandle: string, videoIndex: number): MockVideo => {
  const views = randomInt(5000, 500000)
  const organicPercentage = randomInt(60, 90) / 100
  const organic_views = Math.floor(views * organicPercentage)
  const likesPercentage = randomInt(3, 8) / 100
  const likes = Math.floor(views * likesPercentage)

  return {
    id: `video-${creatorHandle}-${videoIndex}`,
    thumbnail: `https://via.placeholder.com/300x400/8B5CF6/FFFFFF?text=${creatorHandle.slice(1)}+V${videoIndex}`,
    tiktok_url: `https://www.tiktok.com/${creatorHandle}/video/${randomInt(7000000000000000000, 7999999999999999999)}`,
    views,
    organic_views,
    likes,
    comments: Math.floor(likes * randomInt(5, 15) / 100),
    shares: Math.floor(likes * randomInt(2, 8) / 100),
    submitted_at: randomRecentDate()
  }
}

// Generate mock creator with videos
const generateMockCreator = (name: string, index: number): MockCreator => {
  const handle = `@${name.split(' ')[0].toLowerCase()}${randomInt(100, 999)}`
  const videoCount = randomInt(2, 5)
  const videos: MockVideo[] = []

  // Generate videos
  for (let i = 0; i < videoCount; i++) {
    videos.push(generateMockVideo(handle, i + 1))
  }

  // Calculate totals
  const total_views = videos.reduce((sum, v) => sum + v.views, 0)
  const total_organic_views = videos.reduce((sum, v) => sum + v.organic_views, 0)
  const total_likes = videos.reduce((sum, v) => sum + v.likes, 0)

  return {
    id: `creator-${index}`,
    name,
    tiktok_handle: handle,
    tiktok_url: `https://www.tiktok.com/${handle}`,
    avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=8B5CF6&color=fff&size=200`,
    total_views,
    total_organic_views,
    total_likes,
    videos
  }
}

// Generate all mock creators (50+ users)
export const mockCreators: MockCreator[] = polishNames.map((name, index) =>
  generateMockCreator(name, index)
)

// Sort creators by total organic views (descending) for default ranking
export const rankedCreators = [...mockCreators].sort((a, b) =>
  b.total_organic_views - a.total_organic_views
)

// Get all videos from all creators, sorted by organic views
export const allVideos = mockCreators
  .flatMap(creator =>
    creator.videos.map(video => ({
      ...video,
      creator_name: creator.name,
      creator_handle: creator.tiktok_handle,
      creator_url: creator.tiktok_url,
      creator_avatar: creator.avatar_url
    }))
  )
  .sort((a, b) => b.organic_views - a.organic_views)

// Contest details
export const mockContestDetails = {
  id: 'demo-contest-1',
  title: 'PawełkixSeeUTrending',
  brand_name: 'Pawełkix',
  brand_logo: 'https://via.placeholder.com/200x200/8B5CF6/FFFFFF?text=Pawełkix',
  description: 'Konkurs video na TikToku dla wszystkich twórców! Pokaż swoją kreatywność i wygraj niesamowite nagrody!',
  descriptionEn: 'TikTok video contest for all creators! Show your creativity and win amazing prizes!',

  // Requirements
  requirements: {
    pl: [
      'Video musi być opublikowane na TikToku w okresie trwania konkursu',
      'Użyj hashtagu #PawełkixSeeUTrending w opisie',
      'Video musi być oryginalne i stworzone przez Ciebie',
      'Minimalna długość video: 15 sekund',
      'Treść musi być zgodna z regulaminem platformy TikTok',
      'Jedno konto może zgłosić maksymalnie 5 filmików'
    ],
    en: [
      'Video must be published on TikTok during the contest period',
      'Use hashtag #PawełkixSeeUTrending in the description',
      'Video must be original and created by you',
      'Minimum video length: 15 seconds',
      'Content must comply with TikTok platform rules',
      'One account can submit a maximum of 5 videos'
    ]
  },

  // Winner selection
  winnerSelection: {
    pl: 'Zwycięzca zostanie wybrany na podstawie łącznej liczby wyświetleń (organicznych) oraz polubień ze wszystkich filmików z jego konta TikTok przesłanych w okresie konkursu, które spełniają wymagania.',
    en: 'The winner will be selected based on the total number of views (organic) and likes from all videos from their TikTok account uploaded during the competition period that meet the requirements.'
  },

  // Prizes
  prizes: [
    { place: 1, amount: 10000, currency: 'PLN' },
    { place: 2, amount: 5000, currency: 'PLN' },
    { place: 3, amount: 3000, currency: 'PLN' }
  ],

  // Monthly XP party bonus
  monthlyBonus: {
    pl: 'Użytkownicy, którzy zdobędą najwięcej punktów XP w tym miesiącu, zostaną zaproszeni na wielką imprezę!',
    en: 'Users who get the most XP points this month will be invited to a big party!'
  },

  // Contest dates
  start_date: '2025-11-01T00:00:00Z',
  end_date: '2025-11-30T23:59:59Z',

  // Status
  status: 'active',

  // Hashtags
  hashtags: ['#PawełkixSeeUTrending', '#SeeUTrending', '#PawełkixContest'],

  // Stats
  total_participants: mockCreators.length,
  total_submissions: allVideos.length,
  total_views: mockCreators.reduce((sum, c) => sum + c.total_views, 0),
  total_organic_views: mockCreators.reduce((sum, c) => sum + c.total_organic_views, 0),
  total_likes: mockCreators.reduce((sum, c) => sum + c.total_likes, 0)
}

// Helper function to get top N creators
export const getTopCreators = (n: number) => rankedCreators.slice(0, n)

// Helper function to get top N videos
export const getTopVideos = (n: number) => allVideos.slice(0, n)

// Helper function to get creator rank
export const getCreatorRank = (creatorId: string): number => {
  return rankedCreators.findIndex(c => c.id === creatorId) + 1
}

// Helper function to get video rank
export const getVideoRank = (videoId: string): number => {
  return allVideos.findIndex(v => v.id === videoId) + 1
}

// Export total counts
export const mockDataStats = {
  totalCreators: mockCreators.length,
  totalVideos: allVideos.length,
  avgVideosPerCreator: (allVideos.length / mockCreators.length).toFixed(1),
  avgViewsPerVideo: Math.floor(allVideos.reduce((sum, v) => sum + v.views, 0) / allVideos.length),
  avgLikesPerVideo: Math.floor(allVideos.reduce((sum, v) => sum + v.likes, 0) / allVideos.length)
}
