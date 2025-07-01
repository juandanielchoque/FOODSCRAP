-- Vistas útiles para consultas frecuentes

-- Vista de platos con información del establecimiento
CREATE VIEW dish_details AS
SELECT 
    d.id,
    d.name as dish_name,
    d.description,
    d.price,
    d.currency,
    d.average_rating,
    d.total_reviews,
    d.is_vegetarian,
    d.is_vegan,
    d.is_gluten_free,
    d.calories,
    e.business_name,
    e.city,
    e.cuisine_type,
    e.price_range,
    dc.name as category_name
FROM dishes d
JOIN establishments e ON d.establishment_id = e.id
LEFT JOIN dish_categories dc ON d.category_id = dc.id
WHERE d.is_available = TRUE AND e.is_active = TRUE;

-- Vista de estadísticas de establecimientos
CREATE VIEW establishment_summary AS
SELECT 
    e.id,
    e.business_name,
    e.city,
    e.cuisine_type,
    e.average_rating,
    e.total_reviews,
    COUNT(d.id) as total_dishes,
    MIN(d.price) as min_price,
    MAX(d.price) as max_price,
    AVG(d.price) as avg_price
FROM establishments e
LEFT JOIN dishes d ON e.id = d.establishment_id AND d.is_available = TRUE
WHERE e.is_active = TRUE
GROUP BY e.id, e.business_name, e.city, e.cuisine_type, e.average_rating, e.total_reviews;

-- Vista de reseñas con información del usuario y establecimiento
CREATE VIEW review_details AS
SELECT 
    r.id,
    r.rating,
    r.title,
    r.comment,
    r.visit_date,
    r.created_at,
    u.name as reviewer_name,
    e.business_name,
    d.name as dish_name
FROM reviews r
JOIN users u ON r.user_id = u.id
JOIN establishments e ON r.establishment_id = e.id
LEFT JOIN dishes d ON r.dish_id = d.id;
