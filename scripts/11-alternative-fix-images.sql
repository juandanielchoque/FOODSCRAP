-- Alternativa: Si el script anterior no funciona, 
-- vamos a hacer una asociación manual más directa

-- Limpiar asociaciones incorrectas
UPDATE images SET entity_id = NULL WHERE entity_type = 'dish';

-- Obtener los IDs reales de los platos y las imágenes
-- y asociarlos uno por uno

-- Para el primer plato
UPDATE images 
SET entity_id = (
  SELECT id FROM dishes ORDER BY created_at LIMIT 1
), is_primary = TRUE
WHERE entity_type = 'dish' 
AND id = (
  SELECT id FROM images WHERE entity_type = 'dish' ORDER BY created_at LIMIT 1
);

-- Para el segundo plato
UPDATE images 
SET entity_id = (
  SELECT id FROM dishes ORDER BY created_at LIMIT 1 OFFSET 1
), is_primary = TRUE
WHERE entity_type = 'dish' 
AND id = (
  SELECT id FROM images WHERE entity_type = 'dish' ORDER BY created_at LIMIT 1 OFFSET 1
);

-- Para el tercer plato
UPDATE images 
SET entity_id = (
  SELECT id FROM dishes ORDER BY created_at LIMIT 1 OFFSET 2
), is_primary = TRUE
WHERE entity_type = 'dish' 
AND id = (
  SELECT id FROM images WHERE entity_type = 'dish' ORDER BY created_at LIMIT 1 OFFSET 2
);

-- Verificar el resultado
SELECT 
  d.name as plato,
  i.url as imagen,
  i.is_primary as principal
FROM dishes d
JOIN images i ON d.id = i.entity_id AND i.entity_type = 'dish'
ORDER BY d.created_at;
