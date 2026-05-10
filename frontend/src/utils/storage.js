// ==========================================
// FILE: src/utils/storage.js
// localStorage helpers + demo data seeder
// ==========================================

export const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

// ── Trip CRUD ──────────────────────────────
export const getTrips = () => {
  try { return JSON.parse(localStorage.getItem('traveloop_trips') || '[]') } catch { return [] }
}

export const saveTrips = (trips) => {
  localStorage.setItem('traveloop_trips', JSON.stringify(trips))
}

export const getTripById = (id) => getTrips().find(t => t.id === id) || null

export const createTrip = (data) => {
  const trips = getTrips()
  const trip = {
    id: generateId(),
    name: data.name || 'Unnamed Trip',
    description: data.description || '',
    startDate: data.startDate || '',
    endDate: data.endDate || '',
    coverPhoto: data.coverPhoto || '',
    budget: data.budget || 0,
    stops: [],
    createdAt: new Date().toISOString(),
  }
  trips.push(trip)
  saveTrips(trips)
  return trip
}

export const updateTrip = (id, updates) => {
  const trips = getTrips().map(t => t.id === id ? { ...t, ...updates } : t)
  saveTrips(trips)
  return trips.find(t => t.id === id)
}

export const deleteTrip = (id) => {
  saveTrips(getTrips().filter(t => t.id !== id))
}

// ── Stop CRUD ──────────────────────────────
export const addStop = (tripId, stopData) => {
  const trips = getTrips()
  const idx = trips.findIndex(t => t.id === tripId)
  if (idx === -1) return null
  const stop = {
    id: generateId(),
    city: stopData.city || '',
    country: stopData.country || '',
    emoji: stopData.emoji || '📍',
    arrivalDate: stopData.arrivalDate || '',
    departureDate: stopData.departureDate || '',
    activities: [],
  }
  trips[idx].stops = [...(trips[idx].stops || []), stop]
  saveTrips(trips)
  return stop
}

export const updateStop = (tripId, stopId, updates) => {
  const trips = getTrips()
  const tIdx = trips.findIndex(t => t.id === tripId)
  if (tIdx === -1) return
  trips[tIdx].stops = trips[tIdx].stops.map(s => s.id === stopId ? { ...s, ...updates } : s)
  saveTrips(trips)
}

export const deleteStop = (tripId, stopId) => {
  const trips = getTrips()
  const tIdx = trips.findIndex(t => t.id === tripId)
  if (tIdx === -1) return
  trips[tIdx].stops = trips[tIdx].stops.filter(s => s.id !== stopId)
  saveTrips(trips)
}

// ── Activity CRUD ──────────────────────────
export const addActivity = (tripId, stopId, actData) => {
  const trips = getTrips()
  const tIdx = trips.findIndex(t => t.id === tripId)
  if (tIdx === -1) return null
  const sIdx = trips[tIdx].stops.findIndex(s => s.id === stopId)
  if (sIdx === -1) return null
  const activity = {
    id: generateId(),
    name: actData.name || '',
    type: actData.type || 'Other',
    cost: actData.cost || 0,
    duration: actData.duration || '',
    notes: actData.notes || '',
    time: actData.time || '',
  }
  trips[tIdx].stops[sIdx].activities = [...(trips[tIdx].stops[sIdx].activities || []), activity]
  saveTrips(trips)
  return activity
}

export const deleteActivity = (tripId, stopId, actId) => {
  const trips = getTrips()
  const tIdx = trips.findIndex(t => t.id === tripId)
  if (tIdx === -1) return
  const sIdx = trips[tIdx].stops.findIndex(s => s.id === stopId)
  if (sIdx === -1) return
  trips[tIdx].stops[sIdx].activities = trips[tIdx].stops[sIdx].activities.filter(a => a.id !== actId)
  saveTrips(trips)
}

// ── Packing CRUD ──────────────────────────
export const getPackingItems = (tripId) => {
  try { return JSON.parse(localStorage.getItem(`traveloop_packing_${tripId}`) || '[]') } catch { return [] }
}
export const savePackingItems = (tripId, items) => {
  localStorage.setItem(`traveloop_packing_${tripId}`, JSON.stringify(items))
}

// ── Notes CRUD ────────────────────────────
export const getNotes = (tripId) => {
  try { return JSON.parse(localStorage.getItem(`traveloop_notes_${tripId}`) || '[]') } catch { return [] }
}
export const saveNotes = (tripId, notes) => {
  localStorage.setItem(`traveloop_notes_${tripId}`, JSON.stringify(notes))
}

// ── Auth helpers ─────────────────────────
export const getUser = () => {
  try { return JSON.parse(localStorage.getItem('traveloop_user') || 'null') } catch { return null }
}
export const saveUser = (user) => localStorage.setItem('traveloop_user', JSON.stringify(user))
export const clearUser = () => localStorage.removeItem('traveloop_user')

// ── Seed demo data ────────────────────────
export const seedDemoData = () => {
  if (localStorage.getItem('traveloop_seeded')) return
  localStorage.setItem('traveloop_seeded', '1')

  const user = {
    id: 'user1',
    name: 'Abanikant Das',
    email: 'abanikant@traveloop.app',
  }
  saveUser(user)

  const trips = [
    {
      id: 'demo1',
      name: 'Europe Grand Tour',
      description: '21 magical days across the most iconic European capitals',
      startDate: '2025-07-01',
      endDate: '2025-07-21',
      coverPhoto: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80',
      budget: 250000,
      createdAt: new Date().toISOString(),
      stops: [
        {
          id: 's1',
          city: 'Paris',
          country: 'France',
          emoji: '🇫🇷',
          arrivalDate: '2025-07-01',
          departureDate: '2025-07-06',
          activities: [
            { id: 'a1', name: 'Eiffel Tower Visit', type: 'Sightseeing', cost: 2800, duration: '3 hrs', time: '10:00', notes: 'Book tickets in advance' },
            { id: 'a2', name: 'Louvre Museum', type: 'Culture', cost: 2200, duration: '4 hrs', time: '14:00', notes: 'Audio guide recommended' },
            { id: 'a3', name: 'Seine River Cruise', type: 'Sightseeing', cost: 1800, duration: '1.5 hrs', time: '19:30', notes: 'Beautiful at sunset' },
            { id: 'a4', name: 'Café de Flore Brunch', type: 'Food', cost: 3500, duration: '2 hrs', time: '09:00', notes: 'Famous literary café' },
          ],
        },
        {
          id: 's2',
          city: 'Rome',
          country: 'Italy',
          emoji: '🇮🇹',
          arrivalDate: '2025-07-07',
          departureDate: '2025-07-12',
          activities: [
            { id: 'a5', name: 'Colosseum & Forum', type: 'Culture', cost: 3000, duration: '3.5 hrs', time: '09:00', notes: 'Pre-book skip-the-line' },
            { id: 'a6', name: 'Vatican Museums', type: 'Culture', cost: 3500, duration: '4 hrs', time: '13:00', notes: 'Sistine Chapel highlight' },
            { id: 'a7', name: 'Pasta Making Class', type: 'Food', cost: 5500, duration: '3 hrs', time: '18:00', notes: 'Hands-on cooking' },
          ],
        },
        {
          id: 's3',
          city: 'Barcelona',
          country: 'Spain',
          emoji: '🇪🇸',
          arrivalDate: '2025-07-13',
          departureDate: '2025-07-21',
          activities: [
            { id: 'a8', name: 'Sagrada Família', type: 'Sightseeing', cost: 3800, duration: '2 hrs', time: '10:00', notes: 'Gaudí masterpiece' },
            { id: 'a9', name: 'Park Güell', type: 'Sightseeing', cost: 1500, duration: '2 hrs', time: '08:00', notes: 'Book timed entry' },
            { id: 'a10', name: 'La Boqueria Market', type: 'Food', cost: 2000, duration: '1.5 hrs', time: '11:30', notes: 'Try fresh tapas' },
            { id: 'a11', name: 'Flamenco Show', type: 'Culture', cost: 4500, duration: '2 hrs', time: '21:00', notes: 'Tablao Cordobes' },
          ],
        },
      ],
    },
    {
      id: 'demo2',
      name: 'Southeast Asia Backpack',
      description: 'Island hopping and street food adventures across SEA',
      startDate: '2025-09-10',
      endDate: '2025-09-28',
      coverPhoto: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80',
      budget: 80000,
      createdAt: new Date().toISOString(),
      stops: [
        {
          id: 's4',
          city: 'Bangkok',
          country: 'Thailand',
          emoji: '🇹🇭',
          arrivalDate: '2025-09-10',
          departureDate: '2025-09-15',
          activities: [
            { id: 'a12', name: 'Grand Palace Tour', type: 'Culture', cost: 1200, duration: '3 hrs', time: '09:00', notes: 'Dress modestly' },
            { id: 'a13', name: 'Chatuchak Market', type: 'Food', cost: 800, duration: '4 hrs', time: '10:00', notes: 'Largest weekend market' },
            { id: 'a14', name: 'Muay Thai Fight Night', type: 'Adventure', cost: 2500, duration: '3 hrs', time: '20:00', notes: 'Lumpinee Stadium' },
          ],
        },
        {
          id: 's5',
          city: 'Bali',
          country: 'Indonesia',
          emoji: '🇮🇩',
          arrivalDate: '2025-09-16',
          departureDate: '2025-09-28',
          activities: [
            { id: 'a15', name: 'Ubud Rice Terraces', type: 'Sightseeing', cost: 500, duration: '2 hrs', time: '07:00', notes: 'Best at sunrise' },
            { id: 'a16', name: 'Tanah Lot Temple', type: 'Culture', cost: 600, duration: '2 hrs', time: '17:00', notes: 'Amazing sunset views' },
            { id: 'a17', name: 'Surfing at Kuta', type: 'Adventure', cost: 1500, duration: '3 hrs', time: '08:00', notes: 'Lessons for beginners' },
          ],
        },
      ],
    },
    {
      id: 'demo3',
      name: 'Japan Cherry Blossom',
      description: 'Sakura season across Tokyo, Kyoto and Osaka',
      startDate: '2026-03-25',
      endDate: '2026-04-08',
      coverPhoto: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
      budget: 180000,
      createdAt: new Date().toISOString(),
      stops: [
        {
          id: 's6',
          city: 'Tokyo',
          country: 'Japan',
          emoji: '🇯🇵',
          arrivalDate: '2026-03-25',
          departureDate: '2026-03-30',
          activities: [
            { id: 'a18', name: 'Ueno Park Hanami', type: 'Sightseeing', cost: 0, duration: '3 hrs', time: '11:00', notes: 'Free entry, bring a picnic' },
            { id: 'a19', name: 'Shibuya Crossing', type: 'Sightseeing', cost: 0, duration: '1 hr', time: '19:00', notes: 'Most famous intersection' },
            { id: 'a20', name: 'Sushi Omakase', type: 'Food', cost: 8000, duration: '2 hrs', time: '20:00', notes: 'Reserve well in advance' },
          ],
        },
      ],
    },
  ]

  saveTrips(trips)

  // Packing items for demo1
  savePackingItems('demo1', [
    { id: 'p1', name: 'Passport', category: 'Documents', isPacked: true },
    { id: 'p2', name: 'Travel Insurance', category: 'Documents', isPacked: true },
    { id: 'p3', name: 'EU Adapter', category: 'Electronics', isPacked: false },
    { id: 'p4', name: 'Comfortable Walking Shoes', category: 'Clothing', isPacked: false },
    { id: 'p5', name: 'Sunscreen SPF50', category: 'Toiletries', isPacked: false },
    { id: 'p6', name: 'Camera', category: 'Electronics', isPacked: true },
    { id: 'p7', name: 'Light Jacket', category: 'Clothing', isPacked: false },
    { id: 'p8', name: 'Portable Charger', category: 'Electronics', isPacked: false },
  ])

  // Notes for demo1
  saveNotes('demo1', [
    { id: 'n1', stopId: 's1', title: 'Paris tips', content: 'Pick up a Navigo Découverte card for unlimited metro rides. The Paris Museum Pass saves a lot on entry fees!', createdAt: new Date().toISOString() },
    { id: 'n2', stopId: 's2', title: 'Rome food spots', content: 'Don\'t miss Tonnarello in Trastevere for cacio e pepe. Avoid tourist traps near the Colosseum.', createdAt: new Date().toISOString() },
  ])
}
