-- Create the main donation centers table
CREATE TABLE IF NOT EXISTS donation_centers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(50) NOT NULL,
  zip_code VARCHAR(10) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  website VARCHAR(255),
  hours_of_operation JSONB,
  accepted_items TEXT[],
  organization_type VARCHAR(100),
  description TEXT,
  special_instructions TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  icon VARCHAR(50),
  color VARCHAR(7)
);

-- Create junction table for center categories
CREATE TABLE IF NOT EXISTS center_categories (
  center_id INTEGER REFERENCES donation_centers(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (center_id, category_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_donation_centers_location ON donation_centers(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_donation_centers_city ON donation_centers(city);
CREATE INDEX IF NOT EXISTS idx_donation_centers_state ON donation_centers(state);
CREATE INDEX IF NOT EXISTS idx_donation_centers_active ON donation_centers(is_active);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_donation_centers_updated_at 
    BEFORE UPDATE ON donation_centers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
