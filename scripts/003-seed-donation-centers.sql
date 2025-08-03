-- Insert sample donation centers
INSERT INTO donation_centers (
  name, address, city, state, zip_code, latitude, longitude, 
  phone, email, website, hours_of_operation, accepted_items, 
  organization_type, description, special_instructions, is_active
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
  ARRAY['Non-perishable food', 'Canned goods', 'Fresh produce', 'Baby formula'],
  'Food Bank',
  'Serving the San Francisco community with fresh food and groceries for families in need.',
  'Please bring donations during operating hours. Large donations require advance notice.',
  true
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
  ARRAY['Clothing', 'Shoes', 'Household items', 'Electronics', 'Books', 'Furniture'],
  'Thrift Store',
  'Accepting gently used clothing, household items, and electronics to support job training programs.',
  'Items must be clean and in good condition. No broken electronics or stained clothing.',
  true
),
(
  'St. Marys Homeless Shelter',
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
  ARRAY['Blankets', 'Warm clothing', 'Personal hygiene items', 'Non-perishable food', 'Socks', 'Underwear'],
  'Homeless Shelter',
  'Providing shelter, meals, and support services for individuals experiencing homelessness.',
  'New items preferred for hygiene products. Donations accepted at front desk.',
  true
),
(
  'Bay Area Animal Rescue',
  '321 Elm Street',
  'Oakland',
  'CA',
  '94601',
  37.8044,
  -122.2711,
  '(510) 555-0321',
  'info@bayarearescue.org',
  'https://bayarearescue.org',
  '{"monday": "10:00 AM - 6:00 PM", "tuesday": "10:00 AM - 6:00 PM", "wednesday": "10:00 AM - 6:00 PM", "thursday": "10:00 AM - 6:00 PM", "friday": "10:00 AM - 6:00 PM", "saturday": "9:00 AM - 5:00 PM", "sunday": "12:00 PM - 4:00 PM"}',
  ARRAY['Pet food', 'Pet toys', 'Blankets', 'Pet carriers', 'Leashes', 'Pet beds'],
  'Animal Shelter',
  'Rescuing and caring for abandoned animals while finding them loving homes.',
  'Please check expiration dates on pet food. Call ahead for large donations.',
  true
),
(
  'Books for All Library',
  '654 Cedar Lane',
  'Berkeley',
  'CA',
  '94702',
  37.8715,
  -122.2730,
  '(510) 555-0654',
  'donations@booksforall.org',
  'https://booksforall.org',
  '{"monday": "9:00 AM - 7:00 PM", "tuesday": "9:00 AM - 7:00 PM", "wednesday": "9:00 AM - 7:00 PM", "thursday": "9:00 AM - 7:00 PM", "friday": "9:00 AM - 7:00 PM", "saturday": "10:00 AM - 5:00 PM", "sunday": "1:00 PM - 5:00 PM"}',
  ARRAY['Books', 'Magazines', 'Educational materials', 'DVDs', 'Audio books'],
  'Library',
  'Collecting books and educational materials to support literacy programs in underserved communities.',
  'Books should be in good condition. Textbooks from the last 5 years preferred.',
  true
),
(
  'Community Medical Clinic',
  '987 Health Way',
  'San Francisco',
  'CA',
  '94105',
  37.7849,
  -122.4094,
  '(415) 555-0987',
  'supplies@communitymedical.org',
  'https://communitymedical.org',
  '{"monday": "8:00 AM - 6:00 PM", "tuesday": "8:00 AM - 6:00 PM", "wednesday": "8:00 AM - 6:00 PM", "thursday": "8:00 AM - 6:00 PM", "friday": "8:00 AM - 6:00 PM", "saturday": "9:00 AM - 1:00 PM", "sunday": "Closed"}',
  ARRAY['First aid supplies', 'Bandages', 'Over-the-counter medications', 'Medical equipment', 'Wheelchairs'],
  'Medical Clinic',
  'Providing free medical care and accepting medical supply donations for underserved populations.',
  'All medical supplies must be unopened and unexpired. Call to verify needed items.',
  true
),
(
  'Happy Kids Toy Drive',
  '456 Playground Ave',
  'San Francisco',
  'CA',
  '94107',
  37.7649,
  -122.4094,
  '(415) 555-0456',
  'toys@happykids.org',
  'https://happykids.org',
  '{"monday": "10:00 AM - 4:00 PM", "tuesday": "10:00 AM - 4:00 PM", "wednesday": "10:00 AM - 4:00 PM", "thursday": "10:00 AM - 4:00 PM", "friday": "10:00 AM - 4:00 PM", "saturday": "9:00 AM - 3:00 PM", "sunday": "Closed"}',
  ARRAY['New toys', 'Board games', 'Educational toys', 'Art supplies', 'Sports equipment'],
  'Non-profit',
  'Collecting new toys and games to distribute to children in need during holidays and throughout the year.',
  'Only new, unwrapped toys accepted. No stuffed animals or toys with small parts for safety.',
  true
),
(
  'Tech Recycle Center',
  '789 Innovation Blvd',
  'San Jose',
  'CA',
  '95110',
  37.3382,
  -121.8863,
  '(408) 555-0789',
  'recycle@techcenter.org',
  'https://techrecycle.org',
  '{"monday": "9:00 AM - 5:00 PM", "tuesday": "9:00 AM - 5:00 PM", "wednesday": "9:00 AM - 5:00 PM", "thursday": "9:00 AM - 5:00 PM", "friday": "9:00 AM - 5:00 PM", "saturday": "10:00 AM - 2:00 PM", "sunday": "Closed"}',
  ARRAY['Computers', 'Phones', 'Tablets', 'Cables', 'Printers', 'Monitors'],
  'Recycling Center',
  'Responsibly recycling electronic devices and refurbishing computers for low-income families.',
  'Please remove all personal data before donation. We provide data wiping services.',
  true
)
ON CONFLICT (name) DO NOTHING;

-- Link centers to categories
INSERT INTO center_categories (center_id, category_id)
SELECT dc.id, c.id
FROM donation_centers dc, categories c
WHERE (dc.name = 'Central Food Bank' AND c.name = 'Food Banks')
   OR (dc.name = 'Goodwill Donation Center' AND c.name IN ('Clothing Donations', 'Electronics Recycling'))
   OR (dc.name = 'St. Marys Homeless Shelter' AND c.name IN ('Homeless Shelters', 'Clothing Donations'))
   OR (dc.name = 'Bay Area Animal Rescue' AND c.name = 'Animal Shelters')
   OR (dc.name = 'Books for All Library' AND c.name = 'Book Donations')
   OR (dc.name = 'Community Medical Clinic' AND c.name = 'Medical Supplies')
   OR (dc.name = 'Happy Kids Toy Drive' AND c.name = 'Toy Donations')
   OR (dc.name = 'Tech Recycle Center' AND c.name = 'Electronics Recycling')
ON CONFLICT DO NOTHING;
