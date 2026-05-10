// ==========================================
// FILE: src/utils/helpers.js
// Date/currency/duration formatting utilities
// ==========================================

import { format, differenceInDays, parseISO, isValid } from 'date-fns'

export const formatDate = (dateStr, fmt = 'MMM d, yyyy') => {
  if (!dateStr) return '—'
  try {
    const d = parseISO(dateStr)
    return isValid(d) ? format(d, fmt) : dateStr
  } catch { return dateStr }
}

export const formatShortDate = (dateStr) => formatDate(dateStr, 'MMM d')

export const getDuration = (start, end) => {
  if (!start || !end) return 0
  try {
    return Math.max(0, differenceInDays(parseISO(end), parseISO(start)))
  } catch { return 0 }
}

export const formatCurrency = (amount, currency = '₹') => {
  if (amount === undefined || amount === null) return `${currency}0`
  const n = Number(amount)
  if (isNaN(n)) return `${currency}0`
  return `${currency}${n.toLocaleString('en-IN')}`
}

export const getTripTotalCost = (trip) => {
  if (!trip?.stops) return 0
  return trip.stops.reduce((sum, stop) =>
    sum + (stop.activities || []).reduce((s, a) => s + (Number(a.cost) || 0), 0), 0)
}

export const getActivityTypeColor = (type) => {
  const map = {
    Sightseeing: { bg: '#d0e8ee', text: '#1B4D5C' },
    Food:        { bg: '#faf3e0', text: '#c4a030' },
    Adventure:   { bg: '#f0d5c0', text: '#9e5a2f' },
    Culture:     { bg: '#ede9fe', text: '#5b21b6' },
    Other:       { bg: '#f3f4f6', text: '#6b7280' },
  }
  return map[type] || map.Other
}

export const CITIES_DB = [
  { id: 'c1',  name: 'Paris',        country: 'France',      emoji: '🇫🇷', region: 'Europe',   costIndex: '$$',  popularity: 5, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80' },
  { id: 'c2',  name: 'Rome',         country: 'Italy',       emoji: '🇮🇹', region: 'Europe',   costIndex: '$$',  popularity: 5, image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&q=80' },
  { id: 'c3',  name: 'Barcelona',    country: 'Spain',       emoji: '🇪🇸', region: 'Europe',   costIndex: '$$',  popularity: 4, image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400&q=80' },
  { id: 'c4',  name: 'Tokyo',        country: 'Japan',       emoji: '🇯🇵', region: 'Asia',     costIndex: '$$$', popularity: 5, image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80' },
  { id: 'c5',  name: 'Bangkok',      country: 'Thailand',    emoji: '🇹🇭', region: 'Asia',     costIndex: '$',   popularity: 4, image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400&q=80' },
  { id: 'c6',  name: 'Bali',         country: 'Indonesia',   emoji: '🇮🇩', region: 'Asia',     costIndex: '$',   popularity: 5, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80' },
  { id: 'c7',  name: 'New York',     country: 'USA',         emoji: '🇺🇸', region: 'Americas', costIndex: '$$$', popularity: 5, image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400&q=80' },
  { id: 'c8',  name: 'London',       country: 'UK',          emoji: '🇬🇧', region: 'Europe',   costIndex: '$$$', popularity: 5, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&q=80' },
  { id: 'c9',  name: 'Dubai',        country: 'UAE',         emoji: '🇦🇪', region: 'Middle East', costIndex: '$$$', popularity: 4, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80' },
  { id: 'c10', name: 'Sydney',       country: 'Australia',   emoji: '🇦🇺', region: 'Oceania',  costIndex: '$$$', popularity: 4, image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&q=80' },
  { id: 'c11', name: 'Santorini',    country: 'Greece',      emoji: '🇬🇷', region: 'Europe',   costIndex: '$$$', popularity: 5, image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400&q=80' },
  { id: 'c12', name: 'Singapore',    country: 'Singapore',   emoji: '🇸🇬', region: 'Asia',     costIndex: '$$$', popularity: 4, image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&q=80' },
  { id: 'c13', name: 'Istanbul',     country: 'Turkey',      emoji: '🇹🇷', region: 'Europe',   costIndex: '$$',  popularity: 4, image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&q=80' },
  { id: 'c14', name: 'Prague',       country: 'Czech Republic', emoji: '🇨🇿', region: 'Europe', costIndex: '$',  popularity: 4, image: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=400&q=80' },
  { id: 'c15', name: 'Maldives',     country: 'Maldives',    emoji: '🇲🇻', region: 'Asia',     costIndex: '$$$', popularity: 5, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80' },
  { id: 'c16', name: 'Amsterdam',    country: 'Netherlands', emoji: '🇳🇱', region: 'Europe',   costIndex: '$$$', popularity: 4, image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5702?w=400&q=80' },
  { id: 'c17', name: 'Kyoto',        country: 'Japan',       emoji: '🇯🇵', region: 'Asia',     costIndex: '$$',  popularity: 5, image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&q=80' },
  { id: 'c18', name: 'Rio de Janeiro', country: 'Brazil',   emoji: '🇧🇷', region: 'Americas', costIndex: '$$',  popularity: 4, image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400&q=80' },
  { id: 'c19', name: 'Marrakech',    country: 'Morocco',     emoji: '🇲🇦', region: 'Africa',   costIndex: '$',   popularity: 4, image: 'https://images.unsplash.com/photo-1489493512598-d08130f49bea?w=400&q=80' },
  { id: 'c20', name: 'Vienna',       country: 'Austria',     emoji: '🇦🇹', region: 'Europe',   costIndex: '$$$', popularity: 4, image: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=400&q=80' },
]

export const ACTIVITIES_BY_CITY = {
  Paris: [
    { id: 'pa1', name: 'Eiffel Tower', type: 'Sightseeing', cost: 2800, duration: '3 hrs' },
    { id: 'pa2', name: 'Louvre Museum', type: 'Culture', cost: 2200, duration: '4 hrs' },
    { id: 'pa3', name: 'Seine Cruise', type: 'Sightseeing', cost: 1800, duration: '1.5 hrs' },
    { id: 'pa4', name: 'Montmartre Walk', type: 'Sightseeing', cost: 0, duration: '2 hrs' },
    { id: 'pa5', name: 'French Cooking Class', type: 'Food', cost: 6500, duration: '4 hrs' },
  ],
  Tokyo: [
    { id: 'ta1', name: 'Senso-ji Temple', type: 'Culture', cost: 0, duration: '2 hrs' },
    { id: 'ta2', name: 'Shibuya Crossing', type: 'Sightseeing', cost: 0, duration: '1 hr' },
    { id: 'ta3', name: 'Tsukiji Market', type: 'Food', cost: 2000, duration: '3 hrs' },
    { id: 'ta4', name: 'teamLab Borderless', type: 'Culture', cost: 3200, duration: '3 hrs' },
    { id: 'ta5', name: 'Mt Fuji Day Trip', type: 'Adventure', cost: 5000, duration: '10 hrs' },
  ],
  Bali: [
    { id: 'ba1', name: 'Ubud Rice Terraces', type: 'Sightseeing', cost: 500, duration: '2 hrs' },
    { id: 'ba2', name: 'Surfing Lessons', type: 'Adventure', cost: 1500, duration: '3 hrs' },
    { id: 'ba3', name: 'Tanah Lot Sunset', type: 'Sightseeing', cost: 600, duration: '2 hrs' },
    { id: 'ba4', name: 'Balinese Cooking', type: 'Food', cost: 2000, duration: '4 hrs' },
    { id: 'ba5', name: 'Mount Batur Sunrise Hike', type: 'Adventure', cost: 3000, duration: '8 hrs' },
  ],
}
