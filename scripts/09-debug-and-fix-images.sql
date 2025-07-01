-- Primero, veamos qué está pasando con las relaciones
SELECT 'PLATOS EN LA BASE DE DATOS:' as info;
SELECT id, name FROM dishes LIMIT 5;

SELECT 'IMÁGENES EN LA BASE DE DATOS:' as info;
SELECT id, entity_id, entity_type, url, is_primary FROM images WHERE entity_type = 'dish' LIMIT 5;

-- Verificar si los entity_id coinciden con los dish IDs
SELECT 'VERIFICACIÓN DE RELACIONES:' as info;
SELECT 
  d.id as dish_id,
  d.name as dish_name,
  i.entity_id as image_entity_id,
  i.url as image_url,
  CASE 
    WHEN d.id = i.entity_id THEN 'COINCIDE' 
    ELSE 'NO COINCIDE' 
  END as relacion
FROM dishes d
LEFT JOIN images i ON d.id = i.entity_id AND i.entity_type = 'dish'
LIMIT 10;

-- Si los IDs no coinciden, vamos a ver qué platos existen y qué imágenes tenemos
SELECT 'PLATOS SIN IMÁGENES:' as info;
SELECT d.id, d.name
FROM dishes d
LEFT JOIN images i ON d.id = i.entity_id AND i.entity_type = 'dish'
WHERE i.id IS NULL;

SELECT 'IMÁGENES SIN PLATOS ASOCIADOS:' as info;
SELECT i.id, i.entity_id, i.url
FROM images i
LEFT JOIN dishes d ON i.entity_id = d.id
WHERE i.entity_type = 'dish' AND d.id IS NULL;
