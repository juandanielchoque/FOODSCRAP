-- Si las imágenes existen pero no están asociadas correctamente,
-- vamos a asociarlas a los platos existentes

-- Primero, obtener los IDs de los primeros platos
SET @dish1 = (SELECT id FROM dishes ORDER BY created_at LIMIT 1);
SET @dish2 = (SELECT id FROM dishes ORDER BY created_at LIMIT 1 OFFSET 1);
SET @dish3 = (SELECT id FROM dishes ORDER BY created_at LIMIT 1 OFFSET 2);
SET @dish4 = (SELECT id FROM dishes ORDER BY created_at LIMIT 1 OFFSET 3);
SET @dish5 = (SELECT id FROM dishes ORDER BY created_at LIMIT 1 OFFSET 4);

-- Actualizar las primeras 5 imágenes para asociarlas con los primeros 5 platos
UPDATE images 
SET entity_id = @dish1, is_primary = TRUE
WHERE entity_type = 'dish' 
ORDER BY created_at 
LIMIT 1;

UPDATE images 
SET entity_id = @dish2, is_primary = TRUE
WHERE entity_type = 'dish' 
AND entity_id != @dish1
ORDER BY created_at 
LIMIT 1;

UPDATE images 
SET entity_id = @dish3, is_primary = TRUE
WHERE entity_type = 'dish' 
AND entity_id NOT IN (@dish1, @dish2)
ORDER BY created_at 
LIMIT 1;

UPDATE images 
SET entity_id = @dish4, is_primary = TRUE
WHERE entity_type = 'dish' 
AND entity_id NOT IN (@dish1, @dish2, @dish3)
ORDER BY created_at 
LIMIT 1;

UPDATE images 
SET entity_id = @dish5, is_primary = TRUE
WHERE entity_type = 'dish' 
AND entity_id NOT IN (@dish1, @dish2, @dish3, @dish4)
ORDER BY created_at 
LIMIT 1;

-- Verificar que se actualizaron correctamente
SELECT 'VERIFICACIÓN DESPUÉS DE LA ACTUALIZACIÓN:' as info;
SELECT 
  d.id as dish_id,
  d.name as dish_name,
  i.entity_id,
  i.url as image_url,
  i.is_primary
FROM dishes d
LEFT JOIN images i ON d.id = i.entity_id AND i.entity_type = 'dish'
ORDER BY d.created_at;
