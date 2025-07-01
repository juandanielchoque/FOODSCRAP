-- Datos de ejemplo peruanos para testing

-- Usuarios consumidores
DELETE FROM users WHERE user_type = 'consumer';
INSERT INTO users (id, email, password_hash, user_type, name, phone) VALUES
(UUID(), 'carlos@email.com', '$2b$10$example_hash_consumer1', 'consumer', 'Carlos Mendoza', '+51-999-123-456'),
(UUID(), 'maria@email.com', '$2b$10$example_hash_consumer2', 'consumer', 'María García', '+51-999-234-567'),
(UUID(), 'jose@email.com', '$2b$10$example_hash_consumer3', 'consumer', 'José Rodríguez', '+51-999-345-678');

-- Usuarios establecimientos
DELETE FROM users WHERE user_type = 'establishment';
INSERT INTO users (id, email, password_hash, user_type, name, phone) VALUES
(UUID(), 'central@email.com', '$2b$10$example_hash_establishment1', 'establishment', 'Central Restaurante', '+51-1-242-8515'),
(UUID(), 'maido@email.com', '$2b$10$example_hash_establishment2', 'establishment', 'Maido', '+51-1-446-2512'),
(UUID(), 'anticucheria@email.com', '$2b$10$example_hash_establishment3', 'establishment', 'La Anticuchería', '+51-999-567-890');

-- Limpiar establecimientos existentes
DELETE FROM establishments;

-- Establecimientos peruanos
INSERT INTO establishments (id, user_id, business_name, description, address, city, country, cuisine_type, price_range, opening_hours) VALUES
(UUID(), 
 (SELECT id FROM users WHERE email = 'central@email.com'), 
 'Central Restaurante', 
 'Restaurante de alta cocina peruana que celebra la biodiversidad del Perú con ingredientes autóctonos', 
 'Av. Pedro de Osma 301, Barranco', 
 'Lima', 
 'Perú', 
 'Peruana Contemporánea', 
 '$$$$',
 '{"lunes": "19:00-23:00", "martes": "19:00-23:00", "miercoles": "19:00-23:00", "jueves": "19:00-23:00", "viernes": "19:00-23:00", "sabado": "19:00-23:00", "domingo": "cerrado"}'),

(UUID(), 
 (SELECT id FROM users WHERE email = 'maido@email.com'), 
 'Maido', 
 'Restaurante Nikkei que fusiona la tradición culinaria japonesa con ingredientes peruanos', 
 'Calle San Martín 399, Miraflores', 
 'Lima', 
 'Perú', 
 'Nikkei', 
 '$$$$',
 '{"lunes": "19:00-23:00", "martes": "19:00-23:00", "miercoles": "19:00-23:00", "jueves": "19:00-23:00", "viernes": "19:00-23:00", "sabado": "19:00-23:00", "domingo": "cerrado"}'),

(UUID(), 
 (SELECT id FROM users WHERE email = 'anticucheria@email.com'), 
 'La Anticuchería', 
 'El mejor sabor de los anticuchos peruanos, tradición familiar de más de 40 años', 
 'Av. Grau 456, Barranco', 
 'Lima', 
 'Perú', 
 'Criolla', 
 '$',
 '{"lunes": "18:00-1:00", "martes": "18:00-1:00", "miercoles": "18:00-1:00", "jueves": "18:00-1:00", "viernes": "18:00-2:00", "sabado": "18:00-2:00", "domingo": "18:00-24:00"}');

-- Limpiar platos existentes
DELETE FROM dishes;

-- Platos peruanos de ejemplo
INSERT INTO dishes (id, establishment_id, category_id, name, description, price, ingredients, is_vegetarian, is_vegan, calories, prep_time_minutes, average_rating, total_reviews) VALUES
(UUID(),
 (SELECT id FROM establishments WHERE business_name = 'Central Restaurante'),
 (SELECT id FROM dish_categories WHERE name = 'Platos de Fondo'),
 'Amazonia',
 'Plato que representa la selva peruana con ingredientes como palmito, corazón de chonta y pescado de río',
 280.00,
 '["palmito", "corazón de chonta", "pescado de río", "yuca", "plátano verde"]',
 false, false, 450, 35, 4.8, 127),

(UUID(),
 (SELECT id FROM establishments WHERE business_name = 'Central Restaurante'),
 (SELECT id FROM dish_categories WHERE name = 'Entradas'),
 'Tubérculos Andinos',
 'Selección de papas nativas del Perú con diferentes preparaciones y salsas tradicionales',
 95.00,
 '["papa púrpura", "papa amarilla", "oca", "olluco", "ají amarillo", "huacatay"]',
 true, true, 320, 25, 4.7, 89),

(UUID(),
 (SELECT id FROM establishments WHERE business_name = 'Maido'),
 (SELECT id FROM dish_categories WHERE name = 'Comida Nikkei'),
 'Tiradito Nikkei',
 'Tiradito de pescado con leche de tigre nikkei, ají amarillo y toques japoneses',
 85.00,
 '["pescado fresco", "ají amarillo", "leche de tigre", "cebolla roja", "ajonjolí", "alga nori"]',
 false, false, 280, 15, 4.9, 203),

(UUID(),
 (SELECT id FROM establishments WHERE business_name = 'Maido'),
 (SELECT id FROM dish_categories WHERE name = 'Arroces'),
 'Arroz Nikkei',
 'Arroz al estilo japonés con mariscos peruanos y salsa de ají amarillo',
 120.00,
 '["arroz", "langostinos", "pulpo", "ají amarillo", "salsa de soya", "jengibre", "cebollín"]',
 false, false, 520, 25, 4.6, 156),

(UUID(),
 (SELECT id FROM establishments WHERE business_name = 'La Anticuchería'),
 (SELECT id FROM dish_categories WHERE name = 'Anticuchos'),
 'Anticuchos de Corazón',
 'Tradicionales anticuchos de corazón de res marinados en ají panca, acompañados de papa sancochada',
 25.00,
 '["corazón de res", "ají panca", "comino", "ajo", "vinagre", "papa amarilla"]',
 false, false, 380, 20, 4.5, 342),

(UUID(),
 (SELECT id FROM establishments WHERE business_name = 'La Anticuchería'),
 (SELECT id FROM dish_categories WHERE name = 'Piqueos'),
 'Choritos a la Chalaca',
 'Choritos frescos con salsa chalaca de cebolla, tomate, ají limo y limón',
 18.00,
 '["choritos", "cebolla roja", "tomate", "ají limo", "limón", "cilantro", "choclo"]',
 false, false, 220, 15, 4.4, 198);

-- Reseñas de ejemplo
DELETE FROM reviews;
INSERT INTO reviews (id, user_id, establishment_id, dish_id, rating, title, comment, food_rating, service_rating, ambiance_rating, value_rating, visit_date) VALUES
(UUID(),
 (SELECT id FROM users WHERE email = 'carlos@email.com'),
 (SELECT id FROM establishments WHERE business_name = 'Central Restaurante'),
 (SELECT id FROM dishes WHERE name = 'Amazonia'),
 5, 'Experiencia gastronómica única',
 'Una explosión de sabores amazónicos. Cada ingrediente cuenta una historia del Perú profundo. Simplemente espectacular.',
 5, 5, 5, 4, '2024-01-15'),

(UUID(),
 (SELECT id FROM users WHERE email = 'maria@email.com'),
 (SELECT id FROM establishments WHERE business_name = 'Maido'),
 (SELECT id FROM dishes WHERE name = 'Tiradito Nikkei'),
 5, 'Fusión perfecta',
 'La combinación de técnicas japonesas con sabores peruanos es magistral. El tiradito estaba fresco y lleno de sabor.',
 5, 4, 4, 4, '2024-01-20'),

(UUID(),
 (SELECT id FROM users WHERE email = 'jose@email.com'),
 (SELECT id FROM establishments WHERE business_name = 'La Anticuchería'),
 (SELECT id FROM dishes WHERE name = 'Anticuchos de Corazón'),
 4, 'Sabor tradicional auténtico',
 'Los mejores anticuchos que he probado. El sabor es exactamente como los hacía mi abuela. Muy recomendado.',
 5, 4, 3, 5, '2024-01-25');
