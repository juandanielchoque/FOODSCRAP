-- Datos de ejemplo para testing

-- Usuarios consumidores
INSERT INTO users (id, email, password_hash, user_type, name, phone) VALUES
(UUID(), 'juan@email.com', '$2b$10$example_hash_consumer1', 'consumer', 'Juan Pérez', '+52-555-0001'),
(UUID(), 'maria@email.com', '$2b$10$example_hash_consumer2', 'consumer', 'María García', '+52-555-0002'),
(UUID(), 'carlos@email.com', '$2b$10$example_hash_consumer3', 'consumer', 'Carlos López', '+52-555-0003');

-- Usuarios establecimientos
INSERT INTO users (id, email, password_hash, user_type, name, phone) VALUES
(UUID(), 'restaurante@email.com', '$2b$10$example_hash_establishment1', 'establishment', 'Restaurante El Buen Sabor', '+52-555-1001'),
(UUID(), 'pizzeria@email.com', '$2b$10$example_hash_establishment2', 'establishment', 'Pizzería Italiana', '+52-555-1002'),
(UUID(), 'tacos@email.com', '$2b$10$example_hash_establishment3', 'establishment', 'Tacos El Patrón', '+52-555-1003');

-- Establecimientos
INSERT INTO establishments (id, user_id, business_name, description, address, city, country, cuisine_type, price_range, opening_hours) VALUES
(UUID(), 
 (SELECT id FROM users WHERE email = 'restaurante@email.com'), 
 'El Buen Sabor', 
 'Restaurante de comida tradicional mexicana con los mejores sabores caseros y ambiente familiar', 
 'Calle Principal 123, Col. Centro', 
 'Ciudad de México', 
 'México', 
 'Mexicana', 
 '$$',
 '{"lunes": "8:00-22:00", "martes": "8:00-22:00", "miercoles": "8:00-22:00", "jueves": "8:00-22:00", "viernes": "8:00-23:00", "sabado": "9:00-23:00", "domingo": "9:00-21:00"}'),

(UUID(), 
 (SELECT id FROM users WHERE email = 'pizzeria@email.com'), 
 'Pizzería Bella Italia', 
 'Auténtica pizza italiana con ingredientes importados directamente de Italia', 
 'Avenida Roma 456, Col. Condesa', 
 'Ciudad de México', 
 'México', 
 'Italiana', 
 '$$$',
 '{"lunes": "12:00-23:00", "martes": "12:00-23:00", "miercoles": "12:00-23:00", "jueves": "12:00-23:00", "viernes": "12:00-24:00", "sabado": "12:00-24:00", "domingo": "12:00-22:00"}'),

(UUID(), 
 (SELECT id FROM users WHERE email = 'tacos@email.com'), 
 'Tacos El Patrón', 
 'Los mejores tacos al pastor de la ciudad, receta familiar de más de 30 años', 
 'Calle Insurgentes 789, Col. Roma Norte', 
 'Ciudad de México', 
 'México', 
 'Mexicana', 
 '$',
 '{"lunes": "18:00-2:00", "martes": "18:00-2:00", "miercoles": "18:00-2:00", "jueves": "18:00-2:00", "viernes": "18:00-3:00", "sabado": "18:00-3:00", "domingo": "18:00-1:00"}');

-- Platos de ejemplo
INSERT INTO dishes (id, establishment_id, category_id, name, description, price, ingredients, is_vegetarian, is_vegan, calories, prep_time_minutes) VALUES
(UUID(),
 (SELECT id FROM establishments WHERE business_name = 'El Buen Sabor'),
 (SELECT id FROM dish_categories WHERE name = 'Platos Principales'),
 'Mole Poblano',
 'Tradicional mole poblano con pollo, servido con arroz mexicano y tortillas hechas a mano',
 185.00,
 '["pollo", "chiles", "chocolate", "especias", "arroz", "tortillas"]',
 false, false, 650, 45),

(UUID(),
 (SELECT id FROM establishments WHERE business_name = 'El Buen Sabor'),
 (SELECT id FROM dish_categories WHERE name = 'Entradas'),
 'Guacamole Tradicional',
 'Guacamole preparado al momento con aguacates frescos, servido con totopos artesanales',
 95.00,
 '["aguacate", "tomate", "cebolla", "chile serrano", "cilantro", "limón", "totopos"]',
 true, true, 320, 10),

(UUID(),
 (SELECT id FROM establishments WHERE business_name = 'Pizzería Bella Italia'),
 (SELECT id FROM dish_categories WHERE name = 'Pizzas'),
 'Pizza Margherita',
 'Pizza clásica con salsa de tomate San Marzano, mozzarella di bufala y albahaca fresca',
 220.00,
 '["masa de pizza", "tomate San Marzano", "mozzarella di bufala", "albahaca", "aceite de oliva"]',
 true, false, 580, 15),

(UUID(),
 (SELECT id FROM establishments WHERE business_name = 'Pizzería Bella Italia'),
 (SELECT id FROM dish_categories WHERE name = 'Pizzas'),
 'Pizza Quattro Stagioni',
 'Pizza dividida en cuatro secciones: champiñones, jamón, alcachofas y aceitunas',
 280.00,
 '["masa de pizza", "tomate", "mozzarella", "champiñones", "jamón", "alcachofas", "aceitunas"]',
 false, false, 720, 18),

(UUID(),
 (SELECT id FROM establishments WHERE business_name = 'Tacos El Patrón'),
 (SELECT id FROM dish_categories WHERE name = 'Comida Mexicana'),
 'Tacos al Pastor',
 'Orden de 4 tacos al pastor con piña, cebolla, cilantro y salsa verde',
 65.00,
 '["tortilla de maíz", "carne al pastor", "piña", "cebolla", "cilantro", "salsa verde"]',
 false, false, 480, 8),

(UUID(),
 (SELECT id FROM establishments WHERE business_name = 'Tacos El Patrón'),
 (SELECT id FROM dish_categories WHERE name = 'Comida Mexicana'),
 'Quesadillas de Flor de Calabaza',
 'Quesadillas hechas a mano con flor de calabaza, queso Oaxaca y epazote',
 85.00,
 '["tortilla de maíz", "flor de calabaza", "queso Oaxaca", "epazote"]',
 true, false, 420, 12);

-- Reseñas de ejemplo
INSERT INTO reviews (id, user_id, establishment_id, dish_id, rating, title, comment, food_rating, service_rating, ambiance_rating, value_rating, visit_date) VALUES
(UUID(),
 (SELECT id FROM users WHERE email = 'juan@email.com'),
 (SELECT id FROM establishments WHERE business_name = 'El Buen Sabor'),
 (SELECT id FROM dishes WHERE name = 'Mole Poblano'),
 5, 'Excelente mole tradicional',
 'El mejor mole que he probado en la ciudad. La sazón es increíble y el servicio muy atento. Definitivamente regresaré.',
 5, 5, 4, 5, '2024-01-15'),

(UUID(),
 (SELECT id FROM users WHERE email = 'maria@email.com'),
 (SELECT id FROM establishments WHERE business_name = 'Pizzería Bella Italia'),
 (SELECT id FROM dishes WHERE name = 'Pizza Margherita'),
 4, 'Muy buena pizza italiana',
 'Pizza auténtica con ingredientes de calidad. El ambiente es acogedor aunque un poco ruidoso.',
 5, 4, 3, 4, '2024-01-20');
