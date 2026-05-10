CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  profile_photo TEXT,
  language_pref VARCHAR(20) DEFAULT 'English',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE trips (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  cover_photo TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stops (
  id SERIAL PRIMARY KEY,
  trip_id INT REFERENCES trips(id) ON DELETE CASCADE,
  city_id INT,
  arrival_date DATE,
  departure_date DATE,
  order_index INT
);

CREATE TABLE cities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  country VARCHAR(100),
  region VARCHAR(100),
  cost_index VARCHAR(10),
  popularity_score INT,
  image_url TEXT
);

CREATE TABLE activities (
  id SERIAL PRIMARY KEY,
  city_id INT REFERENCES cities(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50),
  cost DECIMAL(10, 2),
  duration_hours DECIMAL(4, 2),
  image_url TEXT
);

CREATE TABLE stop_activities (
  id SERIAL PRIMARY KEY,
  stop_id INT REFERENCES stops(id) ON DELETE CASCADE,
  activity_id INT REFERENCES activities(id) ON DELETE CASCADE,
  scheduled_time TIME,
  notes TEXT
);

CREATE TABLE budgets (
  id SERIAL PRIMARY KEY,
  trip_id INT REFERENCES trips(id) ON DELETE CASCADE,
  transport_cost DECIMAL(10, 2) DEFAULT 0,
  stay_cost DECIMAL(10, 2) DEFAULT 0,
  activity_cost DECIMAL(10, 2) DEFAULT 0,
  meal_cost DECIMAL(10, 2) DEFAULT 0,
  total_budget DECIMAL(12, 2) DEFAULT 0
);

CREATE TABLE packing_items (
  id SERIAL PRIMARY KEY,
  trip_id INT REFERENCES trips(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50),
  is_packed BOOLEAN DEFAULT false
);

CREATE TABLE trip_notes (
  id SERIAL PRIMARY KEY,
  trip_id INT REFERENCES trips(id) ON DELETE CASCADE,
  stop_id INT REFERENCES stops(id) ON DELETE SET NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL
);
