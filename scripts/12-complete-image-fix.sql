-- Vamos a crear imágenes placeholder para los platos que no tienen imagen
INSERT INTO images (id, url, alt_text, uploaded_by, entity_type, entity_id, is_primary, created_at)
SELECT 
  UUID() as id,
  CONCAT('/placeholder.svg?height=400&width=600&text=', REPLACE(d.name, ' ', '+')) as url,
  CONCAT('Imagen de ', d.name) as alt_text,
  (SELECT id FROM users WHERE user_type = 'establishment' LIMIT 1) as uploaded_by,
  'dish' as entity_type,
  d.id as entity_id,
  TRUE as is_primary,
  NOW() as created_at
FROM dishes d
LEFT JOIN images i ON d.id = i.entity_id AND i.entity_type = 'dish'
WHERE i.id IS NULL;

-- Verificar que todos los platos ahora tienen imagen
SELECT 
  d.name as plato,
  CASE 
    WHEN i.url IS NOT NULL THEN 'CON IMAGEN' 
    ELSE 'SIN IMAGEN' 
  END as estado,
  i.url as imagen_url
FROM dishes d
LEFT JOIN images i ON d.id = i.entity_id AND i.entity_type = 'dish' AND i.is_primary = 1
ORDER BY d.created_at;
