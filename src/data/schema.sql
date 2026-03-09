-- STAYLOG Database Schema for Supabase

-- 숙소
CREATE TABLE stays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  category VARCHAR(20) NOT NULL CHECK (category IN ('펜션', '한옥', '호텔', '게스트하우스')),
  region VARCHAR(20) NOT NULL CHECK (region IN ('제주', '강원', '경상', '전라', '서울', '경기')),
  address VARCHAR(200),
  latitude DECIMAL(10,7),
  longitude DECIMAL(10,7),
  price INTEGER NOT NULL,
  max_guests INTEGER DEFAULT 2,
  images TEXT[] DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  host_name VARCHAR(50),
  host_image TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 예약
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stay_id UUID REFERENCES stays(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER DEFAULT 1,
  total_price INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 리뷰
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stay_id UUID REFERENCES stays(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 찜
CREATE TABLE wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stay_id UUID REFERENCES stays(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(stay_id, user_id)
);

-- RLS (Row Level Security) 설정
ALTER TABLE stays ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- 숙소: 누구나 읽기 가능
CREATE POLICY "stays_read" ON stays FOR SELECT USING (true);

-- 예약: 본인 것만 접근
CREATE POLICY "reservations_read" ON reservations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "reservations_insert" ON reservations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reservations_update" ON reservations FOR UPDATE USING (auth.uid() = user_id);

-- 리뷰: 읽기는 전체, 작성/수정은 본인
CREATE POLICY "reviews_read" ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_update" ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "reviews_delete" ON reviews FOR DELETE USING (auth.uid() = user_id);

-- 찜: 본인 것만 접근
CREATE POLICY "wishlists_read" ON wishlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "wishlists_insert" ON wishlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "wishlists_delete" ON wishlists FOR DELETE USING (auth.uid() = user_id);

-- 인덱스
CREATE INDEX idx_stays_category ON stays(category);
CREATE INDEX idx_stays_region ON stays(region);
CREATE INDEX idx_stays_price ON stays(price);
CREATE INDEX idx_reservations_user ON reservations(user_id);
CREATE INDEX idx_reservations_stay ON reservations(stay_id);
CREATE INDEX idx_reviews_stay ON reviews(stay_id);
CREATE INDEX idx_wishlists_user ON wishlists(user_id);
