-- Agregar imágenes de ejemplo para los platos existentes
-- Primero, vamos a usar URLs de placeholder que funcionan

-- Limpiar imágenes existentes
DELETE FROM images WHERE entity_type = 'dish';

-- Agregar imágenes placeholder para cada plato
INSERT INTO images (id, url, alt_text, uploaded_by, entity_type, entity_id, is_primary, created_at) 
SELECT 
  UUID() as id,
  CONCAT('/placeholder.svg?height=400&width=600&text=', REPLACE(d.name, ' ', '+')) as url,
  CONCAT('Imagen de ', d.name) as alt_text,
  e.user_id as uploaded_by,
  'dish' as entity_type,
  d.id as entity_id,
  TRUE as is_primary,
  NOW() as created_at
FROM dishes d
JOIN establishments e ON d.establishment_id = e.id;

-- Verificar que se agregaron las imágenes
SELECT 
  d.name as dish_name,
  i.url,
  i.is_primary
FROM dishes d
LEFT JOIN images i ON d.id = i.entity_id AND i.entity_type = 'dish'
ORDER BY d.name;
