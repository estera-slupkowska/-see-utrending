import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date()
  const targetDate = typeof date === 'string' ? new Date(date) : date
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000)

  if (diffInSeconds < 60) return `${diffInSeconds}s temu`
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}min temu`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h temu`
  return `${Math.floor(diffInSeconds / 86400)} dni temu`
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(null, args), wait)
  }
}

export function isValidTikTokUrl(url: string): boolean {
  const patterns = [
    /^https?:\/\/(www\.)?tiktok\.com\/@[\w.-]+\/video\/\d+/,
    /^https?:\/\/(vm|vt)\.tiktok\.com\/[\w-]+/,
    /^https?:\/\/m\.tiktok\.com\/v\/\d+/,
  ]
  return patterns.some(pattern => pattern.test(url))
}

export function extractTikTokVideoId(url: string): string | null {
  const patterns = [
    /tiktok\.com\/@[\w.-]+\/video\/(\d+)/,
    /tiktok\.com\/.*\/video\/(\d+)/,
    /vm\.tiktok\.com\/([\w-]+)/,
    /vt\.tiktok\.com\/([\w-]+)/,
    /m\.tiktok\.com\/v\/(\d+)/,
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  
  return null
}