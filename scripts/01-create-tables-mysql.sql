-- Base de datos FoodScrap para MySQL
-- Tabla de usuarios (consumidores y establecimientos)
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type ENUM('consumer', 'establishment') NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    profile_image_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_type (user_type)
);

-- Tabla de establecimientos (restaurantes)
CREATE TABLE establishments (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    phone VARCHAR(20),
    website_url TEXT,
    opening_hours JSON, -- {"monday": "9:00-22:00", "tuesday": "9:00-22:00", etc}
    cuisine_type VARCHAR(100),
    price_range ENUM('$', '$$', '$$$', '$$$$'),
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_establishments_city (city),
    INDEX idx_establishments_cuisine (cuisine_type),
    INDEX idx_establishments_rating (average_rating),
    INDEX idx_establishments_user (user_id)
);

-- Tabla de categorías de platos
CREATE TABLE dish_categories (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_categories_name (name)
);

-- Tabla de platos
CREATE TABLE dishes (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    establishment_id VARCHAR(36) NOT NULL,
    category_id VARCHAR(36),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    ingredients JSON, -- ["ingredient1", "ingredient2"]
    allergens JSON, -- ["gluten", "nuts"]
    is_vegetarian BOOLEAN DEFAULT FALSE,
    is_vegan BOOLEAN DEFAULT FALSE,
    is_gluten_free BOOLEAN DEFAULT FALSE,
    calories INT,
    prep_time_minutes INT,
    spice_level TINYINT CHECK (spice_level BETWEEN 0 AND 5),
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (establishment_id) REFERENCES establishments(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES dish_categories(id) ON DELETE SET NULL,
    INDEX idx_dishes_establishment (establishment_id),
    INDEX idx_dishes_category (category_id),
    INDEX idx_dishes_price (price),
    INDEX idx_dishes_rating (average_rating),
    INDEX idx_dishes_name (name)
);

-- Tabla de imágenes
CREATE TABLE images (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    url TEXT NOT NULL,
    alt_text VARCHAR(255),
    uploaded_by VARCHAR(36),
    entity_type ENUM('dish', 'establishment', 'review') NOT NULL,
    entity_id VARCHAR(36) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    file_size INT, -- en bytes
    width INT,
    height INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_images_entity (entity_type, entity_id),
    INDEX idx_images_uploader (uploaded_by)
);

-- Tabla de reseñas/críticas
CREATE TABLE reviews (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    establishment_id VARCHAR(36) NOT NULL,
    dish_id VARCHAR(36),
    rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title VARCHAR(255),
    comment TEXT,
    food_rating TINYINT CHECK (food_rating BETWEEN 1 AND 5),
    service_rating TINYINT CHECK (service_rating BETWEEN 1 AND 5),
    ambiance_rating TINYINT CHECK (ambiance_rating BETWEEN 1 AND 5),
    value_rating TINYINT CHECK (value_rating BETWEEN 1 AND 5),
    visit_date DATE,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (establishment_id) REFERENCES establishments(id) ON DELETE CASCADE,
    FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE CASCADE,
    INDEX idx_reviews_user (user_id),
    INDEX idx_reviews_establishment (establishment_id),
    INDEX idx_reviews_dish (dish_id),
    INDEX idx_reviews_rating (rating),
    INDEX idx_reviews_date (created_at)
);

-- Tabla de respuestas de establecimientos a reseñas
CREATE TABLE review_responses (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    review_id VARCHAR(36) NOT NULL,
    establishment_id VARCHAR(36) NOT NULL,
    response_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
    FOREIGN KEY (establishment_id) REFERENCES establishments(id) ON DELETE CASCADE,
    INDEX idx_responses_review (review_id)
);

-- Tabla de comparaciones guardadas por usuarios
CREATE TABLE comparisons (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    dish_ids JSON NOT NULL, -- ["dish_id1", "dish_id2"]
    comparison_criteria JSON, -- {"price": true, "rating": true, "distance": false}
    notes TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_comparisons_user (user_id)
);

-- Tabla de favoritos
CREATE TABLE favorites (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    entity_type ENUM('dish', 'establishment') NOT NULL,
    entity_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_favorite (user_id, entity_type, entity_id),
    INDEX idx_favorites_user (user_id)
);

-- Tabla de votos útiles en reseñas
CREATE TABLE review_votes (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    review_id VARCHAR(36) NOT NULL,
    is_helpful BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
    UNIQUE KEY unique_vote (user_id, review_id)
);

-- Tabla de seguimiento entre usuarios
CREATE TABLE user_follows (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    follower_id VARCHAR(36) NOT NULL,
    following_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_follow (follower_id, following_id),
    INDEX idx_follows_follower (follower_id),
    INDEX idx_follows_following (following_id)
);

-- Tabla de notificaciones
CREATE TABLE notifications (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    type ENUM('new_review', 'review_response', 'new_follower', 'dish_update') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    entity_type ENUM('review', 'dish', 'establishment', 'user'),
    entity_id VARCHAR(36),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_notifications_user (user_id),
    INDEX idx_notifications_read (is_read)
);

-- Tabla de estadísticas de establecimientos
CREATE TABLE establishment_stats (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    establishment_id VARCHAR(36) NOT NULL,
    date DATE NOT NULL,
    views_count INT DEFAULT 0,
    reviews_count INT DEFAULT 0,
    favorites_count INT DEFAULT 0,
    dishes_viewed JSON, -- {"dish_id": view_count}
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (establishment_id) REFERENCES establishments(id) ON DELETE CASCADE,
    UNIQUE KEY unique_daily_stats (establishment_id, date),
    INDEX idx_stats_establishment (establishment_id),
    INDEX idx_stats_date (date)
);
