-- Actualizar datos para Perú
UPDATE dishes SET currency = 'PEN' WHERE currency = 'USD' OR currency IS NULL;

-- Actualizar números de teléfono a formato peruano
UPDATE users SET phone = CONCAT('+51-', SUBSTRING(phone, -9)) WHERE phone NOT LIKE '+51%' AND phone IS NOT NULL;
UPDATE establishments SET phone = CONCAT('+51-', SUBSTRING(phone, -9)) WHERE phone NOT LIKE '+51%' AND phone IS NOT NULL;

-- Actualizar ciudades a ciudades peruanas
UPDATE establishments SET 
  city = 'Lima',
  country = 'Perú'
WHERE country != 'Perú';

-- Actualizar precios a soles peruanos (convertir de pesos mexicanos a soles)
-- 1 peso mexicano ≈ 0.20 soles peruanos (aproximadamente)
UPDATE dishes SET price = ROUND(price * 0.20, 2) WHERE currency = 'PEN';
