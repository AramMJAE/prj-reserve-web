-- 예약 가용성 체크 함수 (RLS 우회, 유저 정보 노출 없음)
CREATE OR REPLACE FUNCTION check_availability(p_stay_id UUID, p_check_in DATE, p_check_out DATE)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM reservations
    WHERE stay_id = p_stay_id
    AND status IN ('confirmed', 'pending')
    AND check_in < p_check_out
    AND check_out > p_check_in
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 숙소별 예약된 날짜 조회 함수 (캘린더 비활성화용)
CREATE OR REPLACE FUNCTION get_booked_dates(p_stay_id UUID)
RETURNS TABLE(check_in DATE, check_out DATE) AS $$
BEGIN
  RETURN QUERY
    SELECT r.check_in, r.check_out FROM reservations r
    WHERE r.stay_id = p_stay_id
    AND r.status IN ('confirmed', 'pending');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
