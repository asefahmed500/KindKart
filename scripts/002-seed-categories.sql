-- Insert donation categories
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
