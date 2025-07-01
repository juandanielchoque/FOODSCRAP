-- Asegurar que los tipos de datos sean correctos
UPDATE dishes SET 
  average_rating = COALESCE(average_rating, 0.0),
  total_reviews = COALESCE(total_reviews, 0),
  is_available = COALESCE(is_available, 1),
  is_vegetarian = COALESCE(is_vegetarian, 0),
  is_vegan = COALESCE(is_vegan, 0),
  is_gluten_free = COALESCE(is_gluten_free, 0);

UPDATE establishments SET 
  average_rating = COALESCE(average_rating, 0.0),
  total_reviews = COALESCE(total_reviews, 0),
  is_active = COALESCE(is_active, 1);

-- Asegurar que los campos JSON no sean NULL
UPDATE dishes SET 
  ingredients = COALESCE(ingredients, '[]'),
  allergens = COALESCE(allergens, '[]')
WHERE ingredients IS NULL OR allergens IS NULL;
