-- KindKart Database Schema
-- Run this SQL script in your Supabase SQL editor

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    icon VARCHAR(10) NOT NULL,
    color VARCHAR(7) NOT NULL
);

-- Create donation_centers table
CREATE TABLE IF NOT EXISTS donation_centers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(2) NOT NULL,
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create center_categories junction table
CREATE TABLE IF NOT EXISTS center_categories (
    center_id INTEGER REFERENCES donation_centers(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (center_id, category_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_donation_centers_location ON donation_centers(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_donation_centers_city ON donation_centers(city);
CREATE INDEX IF NOT EXISTS idx_donation_centers_state ON donation_centers(state);

-- Insert categories
INSERT INTO categories (name, icon, color) VALUES
    ('Food Banks', '🍞', '#FF6B6B'),
    ('Clothing Donations', '👕', '#4ECDC4'),
    ('Homeless Shelters', '🏠', '#45B7D1'),
    ('Medical Supplies', '🏥', '#96CEB4'),
    ('Electronics Recycling', '💻', '#FFEAA7'),
    ('Book Donations', '📚', '#DDA0DD'),
    ('Toy Donations', '🧸', '#FFB6C1'),
    ('Animal Shelters', '🐕', '#98D8C8')
ON CONFLICT (name) DO NOTHING;

-- Insert sample donation centers
INSERT INTO donation_centers (
    name, address, city, state, zip_code, latitude, longitude, 
    phone, email, website, hours_of_operation, accepted_items, 
    organization_type, description
) VALUES
    (
        'Central Food Bank',
        '123 Main Street',
        'San Francisco',
        'CA',
        '94102',
        37.7749,
        -122.4194,
        '(415) 555-0123',
        'info@centralfoodbank.org',
        'https://centralfoodbank.org',
        '{"monday": "9:00 AM - 5:00 PM", "tuesday": "9:00 AM - 5:00 PM", "wednesday": "9:00 AM - 5:00 PM", "thursday": "9:00 AM - 5:00 PM", "friday": "9:00 AM - 5:00 PM", "saturday": "10:00 AM - 2:00 PM", "sunday": "Closed"}',
        ARRAY['Non-perishable food', 'Canned goods', 'Fresh produce'],
        'Food Bank',
        'Serving the San Francisco community with fresh food and groceries for families in need.'
    ),
    (
        'Goodwill Donation Center',
        '456 Oak Avenue',
        'San Francisco',
        'CA',
        '94103',
        37.7849,
        -122.4094,
        '(415) 555-0456',
        'donations@goodwillsf.org',
        'https://goodwillsf.org',
        '{"monday": "8:00 AM - 8:00 PM", "tuesday": "8:00 AM - 8:00 PM", "wednesday": "8:00 AM - 8:00 PM", "thursday": "8:00 AM - 8:00 PM", "friday": "8:00 AM - 8:00 PM", "saturday": "8:00 AM - 6:00 PM", "sunday": "10:00 AM - 6:00 PM"}',
        ARRAY['Clothing', 'Shoes', 'Household items', 'Electronics'],
        'Thrift Store',
        'Accepting gently used clothing, household items, and electronics to support job training programs.'
    ),
    (
        'St. Mary''s Homeless Shelter',
        '789 Pine Street',
        'San Francisco',
        'CA',
        '94104',
        37.7949,
        -122.3994,
        '(415) 555-0789',
        'help@stmarysshelter.org',
        'https://stmarysshelter.org',
        '{"monday": "24 hours", "tuesday": "24 hours", "wednesday": "24 hours", "thursday": "24 hours", "friday": "24 hours", "saturday": "24 hours", "sunday": "24 hours"}',
        ARRAY['Blankets', 'Warm clothing', 'Personal hygiene items', 'Non-perishable food'],
        'Homeless Shelter',
        'Providing shelter, meals, and support services for individuals experiencing homelessness.'
    ),
    (
        'Bay Area Medical Supply Donations',
        '321 Health Street',
        'Oakland',
        'CA',
        '94601',
        37.8044,
        -122.2711,
        '(510) 555-0321',
        'donations@bayareamedical.org',
        'https://bayareamedical.org',
        '{"monday": "9:00 AM - 4:00 PM", "tuesday": "9:00 AM - 4:00 PM", "wednesday": "9:00 AM - 4:00 PM", "thursday": "9:00 AM - 4:00 PM", "friday": "9:00 AM - 4:00 PM", "saturday": "Closed", "sunday": "Closed"}',
        ARRAY['Medical equipment', 'Wheelchairs', 'Crutches', 'First aid supplies'],
        'Medical Supply Center',
        'Collecting and redistributing medical supplies and equipment to those in need.'
    ),
    (
        'Berkeley Electronics Recycling',
        '654 Tech Avenue',
        'Berkeley',
        'CA',
        '94702',
        37.8715,
        -122.273,
        '(510) 555-0654',
        'recycle@berkeleytech.org',
        'https://berkeleytech.org',
        '{"monday": "10:00 AM - 6:00 PM", "tuesday": "10:00 AM - 6:00 PM", "wednesday": "10:00 AM - 6:00 PM", "thursday": "10:00 AM - 6:00 PM", "friday": "10:00 AM - 6:00 PM", "saturday": "10:00 AM - 4:00 PM", "sunday": "Closed"}',
        ARRAY['Computers', 'Phones', 'Tablets', 'Cables', 'Batteries'],
        'Recycling Center',
        'Responsibly recycling electronics and refurbishing devices for community use.'
    ),
    (
        'San Jose Book Exchange',
        '987 Library Lane',
        'San Jose',
        'CA',
        '95110',
        37.3382,
        -121.8863,
        '(408) 555-0987',
        'books@sjbookexchange.org',
        'https://sjbookexchange.org',
        '{"monday": "11:00 AM - 7:00 PM", "tuesday": "11:00 AM - 7:00 PM", "wednesday": "11:00 AM - 7:00 PM", "thursday": "11:00 AM - 7:00 PM", "friday": "11:00 AM - 7:00 PM", "saturday": "10:00 AM - 5:00 PM", "sunday": "12:00 PM - 5:00 PM"}',
        ARRAY['Books', 'Magazines', 'Educational materials', 'DVDs'],
        'Book Exchange',
        'Collecting books and educational materials to support literacy programs in the community.'
    )
ON CONFLICT (name) DO NOTHING;

-- Link centers to categories
INSERT INTO center_categories (center_id, category_id)
SELECT dc.id, c.id
FROM donation_centers dc, categories c
WHERE 
    (dc.name = 'Central Food Bank' AND c.name = 'Food Banks') OR
    (dc.name = 'Goodwill Donation Center' AND c.name = 'Clothing Donations') OR
    (dc.name = 'St. Mary''s Homeless Shelter' AND c.name = 'Homeless Shelters') OR
    (dc.name = 'Bay Area Medical Supply Donations' AND c.name = 'Medical Supplies') OR
    (dc.name = 'Berkeley Electronics Recycling' AND c.name = 'Electronics Recycling') OR
    (dc.name = 'San Jose Book Exchange' AND c.name = 'Book Donations')
ON CONFLICT (center_id, category_id) DO NOTHING;

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_donation_centers_updated_at ON donation_centers;
CREATE TRIGGER update_donation_centers_updated_at
    BEFORE UPDATE ON donation_centers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Verify the setup
SELECT 'Categories created:' as status, COUNT(*) as count FROM categories
UNION ALL
SELECT 'Donation centers created:' as status, COUNT(*) as count FROM donation_centers
UNION ALL
SELECT 'Category associations created:' as status, COUNT(*) as count FROM center_categories;