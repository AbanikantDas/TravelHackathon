# Traveloop API Endpoints

## Auth Routes
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login and receive JWT

## Trip Routes
- `GET /api/trips` - Get all trips for logged-in user
- `POST /api/trips` - Create a new trip
- `GET /api/trips/:id` - Get trip details
- `PUT /api/trips/:id` - Update a trip
- `DELETE /api/trips/:id` - Delete a trip

## Stop Routes
- `POST /api/trips/:tripId/stops` - Add a stop
- `PUT /api/trips/:tripId/stops/:stopId` - Update a stop
- `DELETE /api/trips/:tripId/stops/:stopId` - Delete a stop

## City & Activity Routes
- `GET /api/cities` - Get all cities
- `GET /api/activities` - Get activities for a city

## Budget Routes
- `GET /api/trips/:tripId/budget` - Get budget details
- `PUT /api/trips/:tripId/budget` - Update budget

## Packing Routes
- `GET /api/trips/:tripId/packing` - Get packing list
- `POST /api/trips/:tripId/packing` - Add packing item
- `PUT /api/trips/:tripId/packing/:itemId` - Update packing item
- `DELETE /api/trips/:tripId/packing/:itemId` - Delete packing item

## Note Routes
- `GET /api/trips/:tripId/notes` - Get trip notes
- `POST /api/trips/:tripId/notes` - Add a note
- `PUT /api/trips/:tripId/notes/:noteId` - Update a note
- `DELETE /api/trips/:tripId/notes/:noteId` - Delete a note

## Admin Routes
- `GET /api/admin/stats` - Get system statistics
- `GET /api/admin/users` - Get all users
