-- Insert Sample Cities
INSERT INTO cities (name, country, region, cost_index, popularity_score, image_url) VALUES 
('Paris', 'France', 'Europe', '$$', 5, 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34'),
('Tokyo', 'Japan', 'Asia', '$$$', 5, 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf'),
('Bali', 'Indonesia', 'Asia', '$', 5, 'https://images.unsplash.com/photo-1537996194471-e657df975ab4');

-- Insert Sample Activities
INSERT INTO activities (city_id, name, type, cost, duration_hours) VALUES 
(1, 'Eiffel Tower Visit', 'Sightseeing', 2800, 3),
(1, 'Louvre Museum', 'Culture', 2200, 4),
(2, 'Senso-ji Temple', 'Culture', 0, 2),
(2, 'Tsukiji Market', 'Food', 2000, 3),
(3, 'Ubud Rice Terraces', 'Sightseeing', 500, 2),
(3, 'Surfing Lessons', 'Adventure', 1500, 3);
