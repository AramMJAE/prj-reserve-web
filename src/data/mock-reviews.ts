import type { Review } from "@/types";

export const mockReviews: Review[] = [
  // 북촌 고요한 아침 (stay-001)
  { id: "rev-001", stay_id: "stay-001", user_id: "user-01", rating: 5, content: "서울 한복판에서 이렇게 고즈넉한 경험을 할 수 있다니. 온돌방이 정말 따뜻하고 아침에 준비해주신 다과가 정갈했습니다.", created_at: "2025-12-20T00:00:00Z", user_name: "여행자A", user_image: "" },
  { id: "rev-002", stay_id: "stay-001", user_id: "user-02", rating: 5, content: "대청마루에서 바라본 기와지붕 뷰가 정말 예뻤어요. 사진으로는 다 담을 수 없는 분위기입니다.", created_at: "2025-11-15T00:00:00Z", user_name: "하늘빛", user_image: "" },
  { id: "rev-003", stay_id: "stay-001", user_id: "user-03", rating: 4, content: "숙소 자체는 완벽했는데 주차 공간이 좀 좁았어요. 그래도 북촌 산책하기에 최고의 위치!", created_at: "2025-10-30T00:00:00Z", user_name: "도심여행가", user_image: "" },

  // 전주 소담재 (stay-002)
  { id: "rev-004", stay_id: "stay-002", user_id: "user-04", rating: 5, content: "호스트분이 직접 해주신 전주식 아침밥이 정말 맛있었어요. 한옥마을 걸어서 5분 거리라 너무 편했습니다.", created_at: "2025-12-10T00:00:00Z", user_name: "맛집탐험가", user_image: "" },
  { id: "rev-005", stay_id: "stay-002", user_id: "user-05", rating: 5, content: "마당의 감나무가 너무 운치 있고, 한지 창호로 들어오는 빛이 정말 아름다웠어요.", created_at: "2025-11-28T00:00:00Z", user_name: "감성여행", user_image: "" },
  { id: "rev-006", stay_id: "stay-002", user_id: "user-06", rating: 4, content: "한복체험까지 할 수 있어서 알찬 여행이었어요. 다만 겨울에는 온돌만으로는 좀 추울 수 있습니다.", created_at: "2025-10-15T00:00:00Z", user_name: "전주사랑", user_image: "" },

  // 월정리 파도소리 (stay-008)
  { id: "rev-007", stay_id: "stay-008", user_id: "user-07", rating: 5, content: "침대에 누워서 바다가 보여요. 아침에 눈 뜨면 에메랄드빛 바다가 펼쳐지는 게 꿈같았습니다.", created_at: "2025-12-05T00:00:00Z", user_name: "바다사랑", user_image: "" },
  { id: "rev-008", stay_id: "stay-008", user_id: "user-08", rating: 5, content: "테라스에서 바베큐 하면서 보는 석양이 정말 장관이에요. 재방문 확정!", created_at: "2025-11-20T00:00:00Z", user_name: "제주러버", user_image: "" },
  { id: "rev-009", stay_id: "stay-008", user_id: "user-09", rating: 4, content: "위치가 정말 최고입니다. 월정리 카페거리도 걸어갈 수 있어요. 다만 성수기에는 미리 예약 필수!", created_at: "2025-10-10T00:00:00Z", user_name: "여행메이트", user_image: "" },

  // 제주 소길댁 (stay-011)
  { id: "rev-010", stay_id: "stay-011", user_id: "user-10", rating: 5, content: "진짜 제주를 느낄 수 있는 곳이에요. 감귤밭 사이 돌담길을 걸으면 시간이 멈춘 것 같아요.", created_at: "2025-12-01T00:00:00Z", user_name: "힐링여행", user_image: "" },
  { id: "rev-011", stay_id: "stay-011", user_id: "user-01", rating: 5, content: "독채라서 프라이빗하고, 밤에 별이 쏟아져요. 도시에서는 절대 볼 수 없는 풍경입니다.", created_at: "2025-11-25T00:00:00Z", user_name: "여행자A", user_image: "" },
  { id: "rev-012", stay_id: "stay-011", user_id: "user-02", rating: 5, content: "호스트분이 준비해주신 감귤과 한라봉이 너무 맛있었어요. 가을에 가면 감귤 따기 체험도 가능!", created_at: "2025-10-20T00:00:00Z", user_name: "하늘빛", user_image: "" },

  // 제주 애월 클리프 호텔 (stay-015)
  { id: "rev-013", stay_id: "stay-015", user_id: "user-03", rating: 5, content: "인피니티 풀에서 보는 선셋은 인생 최고의 장면이었어요. 가격이 좀 있지만 충분히 가치가 있습니다.", created_at: "2025-12-15T00:00:00Z", user_name: "도심여행가", user_image: "" },
  { id: "rev-014", stay_id: "stay-015", user_id: "user-04", rating: 5, content: "모든 것이 완벽했어요. 조식도 훌륭하고, 직원분들 서비스도 최상급. 기념일 여행으로 강추!", created_at: "2025-11-30T00:00:00Z", user_name: "맛집탐험가", user_image: "" },
  { id: "rev-015", stay_id: "stay-015", user_id: "user-05", rating: 5, content: "스파 시설이 정말 좋아요. 제주 바다를 보면서 받는 마사지는 천국이 따로 없네요.", created_at: "2025-11-10T00:00:00Z", user_name: "감성여행", user_image: "" },
  { id: "rev-016", stay_id: "stay-015", user_id: "user-06", rating: 4, content: "시설은 최고인데 주변에 식당이 좀 멀어요. 하지만 호텔 내 레스토랑도 충분히 맛있습니다.", created_at: "2025-10-25T00:00:00Z", user_name: "전주사랑", user_image: "" },

  // 속초 설악 뷰하우스 (stay-009)
  { id: "rev-017", stay_id: "stay-009", user_id: "user-07", rating: 5, content: "통유리 너머 설악산 뷰가 압도적이에요. 아침 안개 낀 설악산 풍경이 한 폭의 수묵화 같았습니다.", created_at: "2025-12-08T00:00:00Z", user_name: "바다사랑", user_image: "" },
  { id: "rev-018", stay_id: "stay-009", user_id: "user-08", rating: 4, content: "깔끔하고 뷰가 좋습니다. 속초 중앙시장까지 차로 10분이라 먹거리 해결도 편해요.", created_at: "2025-11-18T00:00:00Z", user_name: "제주러버", user_image: "" },

  // 양양 서피비치 하우스 (stay-010)
  { id: "rev-019", stay_id: "stay-010", user_id: "user-09", rating: 5, content: "서핑하고 돌아와서 바로 쉴 수 있는 위치가 최고! 서퍼라면 무조건 여기!", created_at: "2025-12-03T00:00:00Z", user_name: "여행메이트", user_image: "" },
  { id: "rev-020", stay_id: "stay-010", user_id: "user-10", rating: 4, content: "서핑 안 해도 해변 산책만으로 힐링됩니다. 테라스에서 보는 석양이 너무 예뻐요.", created_at: "2025-11-22T00:00:00Z", user_name: "힐링여행", user_image: "" },

  // 가평 숲속의 아침 (stay-012)
  { id: "rev-021", stay_id: "stay-012", user_id: "user-01", rating: 5, content: "새소리에 잠이 깼어요. 도시에서는 상상도 못할 아침이었습니다. 벽난로 앞에서 책 읽는 시간이 최고.", created_at: "2025-12-12T00:00:00Z", user_name: "여행자A", user_image: "" },
  { id: "rev-022", stay_id: "stay-012", user_id: "user-02", rating: 4, content: "잣나무 숲 산책로가 정말 좋아요. 가족 여행으로 왔는데 아이들도 너무 좋아했습니다.", created_at: "2025-11-28T00:00:00Z", user_name: "하늘빛", user_image: "" },

  // 여수 밤바다 하우스 (stay-013)
  { id: "rev-023", stay_id: "stay-013", user_id: "user-03", rating: 5, content: "여수 밤바다 야경이 정말 환상적이에요. 자쿠지에서 보는 돌산대교 뷰는 말로 표현이 안 됩니다.", created_at: "2025-12-06T00:00:00Z", user_name: "도심여행가", user_image: "" },
  { id: "rev-024", stay_id: "stay-013", user_id: "user-04", rating: 5, content: "커플 여행으로 최고의 선택이었어요. 모든 것이 로맨틱하고 완벽했습니다.", created_at: "2025-11-15T00:00:00Z", user_name: "맛집탐험가", user_image: "" },

  // 서울 성수 아트 호텔 (stay-017)
  { id: "rev-025", stay_id: "stay-017", user_id: "user-05", rating: 5, content: "인테리어가 정말 예술이에요. 로컬 아티스트 작품들이 곳곳에 있어서 갤러리에 온 느낌.", created_at: "2025-12-09T00:00:00Z", user_name: "감성여행", user_image: "" },
  { id: "rev-026", stay_id: "stay-017", user_id: "user-06", rating: 4, content: "루프탑 바에서 보는 서울 야경이 멋져요. 성수동 카페거리도 바로 옆이라 위치 최고!", created_at: "2025-11-20T00:00:00Z", user_name: "전주사랑", user_image: "" },

  // 부산 해운대 웨이브 호텔 (stay-018)
  { id: "rev-027", stay_id: "stay-018", user_id: "user-07", rating: 5, content: "해운대 비치가 바로 앞이에요. 루프탑 풀에서 해운대 뷰를 보면서 수영하는 건 꿈같은 경험!", created_at: "2025-12-11T00:00:00Z", user_name: "바다사랑", user_image: "" },
  { id: "rev-028", stay_id: "stay-018", user_id: "user-08", rating: 5, content: "조식 뷔페도 훌륭하고, 직원분들도 친절해요. 부산 여행 숙소로 이만한 곳 없습니다.", created_at: "2025-11-25T00:00:00Z", user_name: "제주러버", user_image: "" },
  { id: "rev-029", stay_id: "stay-018", user_id: "user-09", rating: 4, content: "시설은 정말 좋은데 성수기에는 가격이 좀 올라가네요. 비수기에 가면 가성비 최고!", created_at: "2025-10-30T00:00:00Z", user_name: "여행메이트", user_image: "" },

  // 제주 협재 서핑캠프 (stay-022)
  { id: "rev-030", stay_id: "stay-022", user_id: "user-10", rating: 5, content: "서핑 처음 해봤는데 레슨이 너무 재밌었어요! 저녁 모닥불 파티에서 새 친구도 사귀었습니다.", created_at: "2025-12-04T00:00:00Z", user_name: "힐링여행", user_image: "" },
  { id: "rev-031", stay_id: "stay-022", user_id: "user-01", rating: 4, content: "자유로운 분위기가 좋아요. 혼자 여행 오는 분들에게 강추! 공용주방도 깨끗합니다.", created_at: "2025-11-19T00:00:00Z", user_name: "여행자A", user_image: "" },

  // 부산 광안리 루프탑 하우스 (stay-023)
  { id: "rev-032", stay_id: "stay-023", user_id: "user-02", rating: 5, content: "광안대교 야경 보면서 맥주 한 잔! 이 가격에 이 뷰를 볼 수 있다니 가성비 끝판왕.", created_at: "2025-12-07T00:00:00Z", user_name: "하늘빛", user_image: "" },
  { id: "rev-033", stay_id: "stay-023", user_id: "user-03", rating: 4, content: "외국인 게스트들과 교류하는 것도 재밌어요. 방은 작지만 깨끗하고 필요한 건 다 있습니다.", created_at: "2025-11-12T00:00:00Z", user_name: "도심여행가", user_image: "" },

  // 강릉 커피거리 하우스 (stay-024)
  { id: "rev-034", stay_id: "stay-024", user_id: "user-04", rating: 5, content: "1층 카페 커피가 정말 맛있어요. 아침에 내려가서 핸드드립 커피 한 잔이면 하루가 완벽하게 시작됩니다.", created_at: "2025-12-02T00:00:00Z", user_name: "맛집탐험가", user_image: "" },
  { id: "rev-035", stay_id: "stay-024", user_id: "user-05", rating: 4, content: "안목 해변 바로 앞이라 산책하기 좋고, 주변 카페 투어하기에 최적의 위치예요.", created_at: "2025-11-08T00:00:00Z", user_name: "감성여행", user_image: "" },

  // 전주 한옥마을 여행자의 집 (stay-025)
  { id: "rev-036", stay_id: "stay-025", user_id: "user-06", rating: 5, content: "호스트분이 추천해준 맛집 리스트가 최고였어요. 전주 여행의 핵심은 맛집인데, 덕분에 완벽한 여행!", created_at: "2025-12-10T00:00:00Z", user_name: "전주사랑", user_image: "" },
  { id: "rev-037", stay_id: "stay-025", user_id: "user-07", rating: 5, content: "이 가격에 한옥마을 바로 앞이라니! 한복 대여도 해주셔서 한옥마을 산책 제대로 했어요.", created_at: "2025-11-22T00:00:00Z", user_name: "바다사랑", user_image: "" },

  // 경주 달빛고택 (stay-003)
  { id: "rev-038", stay_id: "stay-003", user_id: "user-08", rating: 5, content: "200년 된 고택의 운치가 대단해요. 밤에 대청마루에 앉아 달빛 아래 경주를 느낄 수 있습니다.", created_at: "2025-12-13T00:00:00Z", user_name: "제주러버", user_image: "" },
  { id: "rev-039", stay_id: "stay-003", user_id: "user-09", rating: 4, content: "자전거 대여해서 경주 유적지 투어 했는데 정말 좋았어요. 숙소 위치가 탐방에 최적!", created_at: "2025-11-05T00:00:00Z", user_name: "여행메이트", user_image: "" },

  // 담양 죽림헌 (stay-004)
  { id: "rev-040", stay_id: "stay-004", user_id: "user-10", rating: 5, content: "대나무 숲에서 들리는 바람소리가 ASMR이에요. 세상에서 가장 평화로운 잠을 잤습니다.", created_at: "2025-12-08T00:00:00Z", user_name: "힐링여행", user_image: "" },

  // 안동 하회별장 (stay-005)
  { id: "rev-041", stay_id: "stay-005", user_id: "user-01", rating: 5, content: "하회마을 내려다보이는 뷰가 장관이에요. 아궁이 체험까지 해보니 진짜 옛날로 돌아간 기분.", created_at: "2025-12-14T00:00:00Z", user_name: "여행자A", user_image: "" },
  { id: "rev-042", stay_id: "stay-005", user_id: "user-02", rating: 4, content: "가족 여행으로 왔는데 마당이 넓어서 아이들이 뛰어놀기 좋았어요. 조식도 정갈합니다.", created_at: "2025-11-20T00:00:00Z", user_name: "하늘빛", user_image: "" },

  // 서촌 이음재 (stay-006)
  { id: "rev-043", stay_id: "stay-006", user_id: "user-03", rating: 5, content: "모던과 전통의 조화가 정말 멋져요. 서촌 골목 산책하다가 돌아오면 마치 집에 온 것 같은 편안함.", created_at: "2025-12-11T00:00:00Z", user_name: "도심여행가", user_image: "" },

  // 강릉 시포레 호텔 (stay-016)
  { id: "rev-044", stay_id: "stay-016", user_id: "user-04", rating: 5, content: "경포 해변과 소나무 숲 사이에 있는 느낌이 정말 특별해요. 미니멀한 디자인도 취향저격!", created_at: "2025-12-09T00:00:00Z", user_name: "맛집탐험가", user_image: "" },
  { id: "rev-045", stay_id: "stay-016", user_id: "user-05", rating: 4, content: "자전거 대여해서 경포호 한 바퀴 돌았는데 최고였어요. 조식도 깔끔하고 맛있습니다.", created_at: "2025-11-15T00:00:00Z", user_name: "감성여행", user_image: "" },

  // 통영 루체 호텔 (stay-020)
  { id: "rev-046", stay_id: "stay-020", user_id: "user-06", rating: 5, content: "한려수도 다도해 뷰가 말도 안 되게 아름다워요. 통영의 예술적 감성을 제대로 느낄 수 있는 곳.", created_at: "2025-12-05T00:00:00Z", user_name: "전주사랑", user_image: "" },

  // 제주 함덕 블루 호텔 (stay-021)
  { id: "rev-047", stay_id: "stay-021", user_id: "user-07", rating: 5, content: "함덕 바다가 정말 코앞이에요. 조식 먹으면서 보는 에메랄드빛 바다가 매일 아침 감동.", created_at: "2025-12-07T00:00:00Z", user_name: "바다사랑", user_image: "" },
  { id: "rev-048", stay_id: "stay-021", user_id: "user-08", rating: 4, content: "수영장도 좋고, 해변까지 맨발로 갈 수 있어서 편해요. 다만 주말에는 좀 붐빕니다.", created_at: "2025-11-18T00:00:00Z", user_name: "제주러버", user_image: "" },

  // 제주 이호테우 게스트하우스 (stay-026)
  { id: "rev-049", stay_id: "stay-026", user_id: "user-09", rating: 4, content: "조랑말 등대 보이는 테라스가 포인트! 공항에서 가까워서 도착하자마자 바로 체크인 가능.", created_at: "2025-12-01T00:00:00Z", user_name: "여행메이트", user_image: "" },

  // 경주 황리단길 이스트 (stay-027)
  { id: "rev-050", stay_id: "stay-027", user_id: "user-10", rating: 5, content: "황리단길 중심이라 밤에 나가면 바로 카페와 맛집! 옥상에서 보는 첨성대 야경이 보너스.", created_at: "2025-12-03T00:00:00Z", user_name: "힐링여행", user_image: "" },

  // 파주 헤이리 아트 스테이 (stay-028)
  { id: "rev-051", stay_id: "stay-028", user_id: "user-01", rating: 5, content: "작가의 작품들로 꾸며진 공간이 정말 특별해요. 아트 체험 프로그램도 재밌었습니다.", created_at: "2025-12-06T00:00:00Z", user_name: "여행자A", user_image: "" },

  // 평창 하늘목장 로그하우스 (stay-014)
  { id: "rev-052", stay_id: "stay-014", user_id: "user-02", rating: 5, content: "별이 정말 쏟아져요! 도시에서는 절대 볼 수 없는 밤하늘. 벽난로 앞에서 핫초코 마시며 보는 별.", created_at: "2025-12-10T00:00:00Z", user_name: "하늘빛", user_image: "" },
  { id: "rev-053", stay_id: "stay-014", user_id: "user-03", rating: 4, content: "여름에 가면 초록 목장이 펼쳐지고, 겨울에 가면 설경이 장관. 사계절 다 다른 매력이 있어요.", created_at: "2025-11-25T00:00:00Z", user_name: "도심여행가", user_image: "" },

  // 제주 돌담헌 (stay-007)
  { id: "rev-054", stay_id: "stay-007", user_id: "user-04", rating: 5, content: "제주 전통 초가를 현대적으로 리모델링해서 편하면서도 운치 있어요. 오름 뷰가 일품!", created_at: "2025-12-12T00:00:00Z", user_name: "맛집탐험가", user_image: "" },
  { id: "rev-055", stay_id: "stay-007", user_id: "user-05", rating: 4, content: "귤따기 체험이 재밌었어요. 가을에 가면 감귤이 주렁주렁 열려있어 정말 예쁩니다.", created_at: "2025-11-10T00:00:00Z", user_name: "감성여행", user_image: "" },

  // 제주 중문 그린 리조트 (stay-019)
  { id: "rev-056", stay_id: "stay-019", user_id: "user-06", rating: 5, content: "정원이 정말 넓고 잘 가꿔져 있어요. 아이들이 키즈풀에서 놀고 어른은 테라스에서 한라산 뷰!", created_at: "2025-12-08T00:00:00Z", user_name: "전주사랑", user_image: "" },
  { id: "rev-057", stay_id: "stay-019", user_id: "user-07", rating: 4, content: "가족 여행에 딱이에요. 중문 관광단지 안에 있어서 주변 관광도 편합니다.", created_at: "2025-11-20T00:00:00Z", user_name: "바다사랑", user_image: "" },
];
