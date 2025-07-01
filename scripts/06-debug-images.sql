-- Ver las imágenes que están en la base de datos
SELECT 
  i.id,
  i.url,
  i.entity_type,
  i.entity_id,
  i.is_primary,
  d.name as dish_name
FROM images i
LEFT JOIN dishes d ON i.entity_id = d.id AND i.entity_type = 'dish'
ORDER BY i.created_at DESC;

-- Verificar si hay imágenes asociadas a los platos
SELECT 
  d.name,
  COUNT(i.id) as image_count
FROM dishes d
LEFT JOIN images i ON d.id = i.entity_id AND i.entity_type = 'dish'
GROUP BY d.id, d.name
ORDER BY image_count DESC;
