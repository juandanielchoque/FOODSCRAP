-- Datos de ejemplo para testing

-- Usuario consumidor
INSERT INTO users (email, password_hash, user_type, name, phone) VALUES
('juan@email.com', '$2b$10$example_hash', 'consumer', 'Juan Pérez', '+1234567890'),
('maria@email.com', '$2b$10$example_hash', 'consumer', 'María García', '+1234567891');

-- Usuario establecimiento
INSERT INTO users (email, password_hash, user_type, name, phone) VALUES
('restaurante@email.com', '$2b$10$example_hash', 'establishment', 'Restaurante El Buen Sabor', '+1234567892'),
('pizzeria@email.com', '$2b$10$example_hash', 'establishment', 'Pizzería Italiana', '+1234567893');

-- Establecimientos
INSERT INTO establishments (user_id, business_name, description, address, city, country, cuisine_type, price_range) VALUES
((SELECT id FROM users WHERE email = 'restaurante@email.com'), 
 'El Buen Sabor', 
 'Restaurante de comida tradicional con los mejores sabores caseros', 
 'Calle Principal 123', 
 'Ciudad de México', 
 'México', 
 'Mexicana', 
 '$$'),
((SELECT id FROM users WHERE email = 'pizzeria@email.com'), 
 'Pizzería Bella Italia', 
 'Auténtica pizza italiana con ingredientes importados', 
 'Avenida Roma 456', 
 'Ciudad de México', 
 'México', 
 'Italiana', 
 '$$$');

-- Platos de ejemplo
INSERT INTO dishes (establishment_id, category_id, name, description, price, ingredients, is_vegetarian) VALUES
((SELECT id FROM establishments WHERE business_name = 'El Buen Sabor'),
 (SELECT id FROM dish_categories WHERE name = 'Platos Principales'),
 'Tacos al Pastor',
 'Deliciosos tacos con carne al pastor, piña y cebolla',
 12.50,
 ARRAY['tortilla', 'carne de cerdo', 'piña', 'cebolla', 'cilantro'],
 false),
((SELECT id FROM establishments WHERE business_name = 'Pizzería Bella Italia'),
 (SELECT id FROM dish_categories WHERE name = 'Pizzas'),
 'Pizza Margherita',
 'Pizza clásica con tomate, mozzarella y albahaca fresca',
 18.00,
 ARRAY['masa de pizza', 'salsa de tomate', 'mozzarella', 'albahaca'],
 true);
