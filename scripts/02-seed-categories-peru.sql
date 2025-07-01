-- Insertar categorías de platos peruanos
DELETE FROM dish_categories;

INSERT INTO dish_categories (id, name, description) VALUES
(UUID(), 'Entradas', 'Aperitivos y platos para comenzar'),
(UUID(), 'Platos de Fondo', 'Platos principales de la cocina peruana'),
(UUID(), 'Postres', 'Dulces y postres tradicionales'),
(UUID(), 'Bebidas', 'Bebidas tradicionales y refrescos'),
(UUID(), 'Ensaladas', 'Ensaladas frescas y saludables'),
(UUID(), 'Sopas', 'Sopas y caldos peruanos'),
(UUID(), 'Ceviches', 'Ceviches y tiraditos'),
(UUID(), 'Anticuchos', 'Anticuchos y parrillas'),
(UUID(), 'Mariscos', 'Platos de pescado y mariscos'),
(UUID(), 'Carnes', 'Platos de carne roja y blanca'),
(UUID(), 'Arroces', 'Arroces y guisos'),
(UUID(), 'Comida Criolla', 'Platos de la cocina criolla peruana'),
(UUID(), 'Comida Nikkei', 'Fusión peruano-japonesa'),
(UUID(), 'Desayunos', 'Desayunos peruanos tradicionales'),
(UUID(), 'Piqueos', 'Bocadillos y aperitivos'),
(UUID(), 'Comida Chifa', 'Cocina chino-peruana'),
(UUID(), 'Comida Saludable', 'Opciones nutritivas y ligeras'),
(UUID(), 'Comida Vegetariana', 'Platos vegetarianos'),
(UUID(), 'Dulces Tradicionales', 'Postres y dulces peruanos');
