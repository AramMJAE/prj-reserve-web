-- reviews 테이블에 user_name 컬럼 추가
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS user_name VARCHAR(50);

-- reservations 테이블에 user_name 컬럼 추가
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS user_name VARCHAR(50);

-- wishlists는 이름 불필요하므로 생략
