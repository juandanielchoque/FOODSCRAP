-- Ver todas las imágenes en la base de datos
SELECT 
  i.id,
  i.url,
  i.entity_type,
  i.entity_id,
  i.is_primary,
  i.uploaded_by,
  i.created_at,
  d.name as dish_name
FROM images i
LEFT JOIN dishes d ON i.entity_id = d.id AND i.entity_type = 'dish'
ORDER BY i.created_at DESC;

-- Contar imágenes por entidad
SELECT 
  entity_type,
  entity_id,
  COUNT(*) as image_count
FROM images
GROUP BY entity_type, entity_id
ORDER BY image_count DESC;
