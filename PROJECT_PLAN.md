# STAYLOG — 감성 숙소 예약 플랫폼

> 레퍼런스: 스테이폴리오 / 에어비앤비
> 컨셉: 국내 감성 숙소를 큐레이션하여 예약할 수 있는 웹 플랫폼

---

## 1. 기술 스택

| 영역 | 기술 | 선정 이유 |
|------|------|-----------|
| 프레임워크 | Next.js 14 (App Router) | SSR/SSG, 이미지 최적화, 배포 용이 |
| 언어 | TypeScript | 타입 안정성 |
| 스타일링 | Tailwind CSS | 빠른 UI 개발, 커스텀 디자인 시스템 |
| 상태관리 | Zustand | 경량, 장바구니/찜/필터 상태 관리 |
| DB | Supabase (PostgreSQL) | CRUD + Auth + Storage 통합 |
| 캘린더 | react-day-picker | 날짜 범위 선택 UI |
| 지도 | Kakao Maps SDK | 숙소 위치 표시 |
| 배포 | Vercel | Next.js 최적화 배포 |

---

## 2. 디자인 시스템

### 컬러
```
Primary:    #1A1A1A (블랙)
Secondary:  #F5F0EB (웜 크림)
Accent:     #C8A882 (골드 베이지)
Text:       #333333 (본문), #999999 (서브)
Background: #FFFFFF (흰색), #FAFAF8 (오프화이트)
Error:      #D94040
Success:    #2D8F5E
```

### 타이포그래피
```
한글: Pretendard (본문), Noto Serif KR (에디토리얼 타이틀)
영문: Inter
크기: 14px(본문), 16px(서브타이틀), 24~40px(타이틀)
```

### 디자인 원칙
- 여백을 넉넉히 사용 (섹션 간 80~120px)
- 이미지 비율 통일 (16:9, 4:3 혼용)
- 비대칭 그리드 활용 (2:1, 1:1:1 혼합)
- 라운딩: 8px(카드), 4px(버튼), 12px(모달)
- 섀도우 최소화, 보더 활용

---

## 3. 데이터 모델

### stays (숙소)
```sql
id            UUID PRIMARY KEY
name          VARCHAR(100)       -- 숙소명
description   TEXT               -- 숙소 소개
category      VARCHAR(20)        -- 펜션 | 한옥 | 호텔 | 게스트하우스
region        VARCHAR(20)        -- 제주 | 강원 | 경상 | 전라 | 서울 | 경기
address       VARCHAR(200)       -- 상세 주소
latitude      DECIMAL(10,7)      -- 위도
longitude     DECIMAL(10,7)      -- 경도
price         INTEGER            -- 1박 가격
max_guests    INTEGER            -- 최대 인원
images        TEXT[]             -- 이미지 URL 배열
amenities     TEXT[]             -- 편의시설 태그
host_name     VARCHAR(50)        -- 호스트 이름
host_image    TEXT               -- 호스트 프로필 이미지
rating        DECIMAL(2,1)       -- 평균 평점
review_count  INTEGER            -- 리뷰 수
created_at    TIMESTAMP
```

### reservations (예약)
```sql
id            UUID PRIMARY KEY
stay_id       UUID REFERENCES stays(id)
user_id       UUID REFERENCES auth.users(id)
check_in      DATE               -- 체크인 날짜
check_out     DATE               -- 체크아웃 날짜
guests        INTEGER            -- 인원 수
total_price   INTEGER            -- 총 금액
status        VARCHAR(20)        -- pending | confirmed | cancelled | completed
created_at    TIMESTAMP
```

### reviews (리뷰)
```sql
id            UUID PRIMARY KEY
stay_id       UUID REFERENCES stays(id)
user_id       UUID REFERENCES auth.users(id)
rating        INTEGER            -- 1~5
content       TEXT
created_at    TIMESTAMP
```

### wishlists (찜)
```sql
id            UUID PRIMARY KEY
stay_id       UUID REFERENCES stays(id)
user_id       UUID REFERENCES auth.users(id)
created_at    TIMESTAMP
```

---

## 4. 페이지 구조 및 기능 명세

### 4.1 홈페이지 `/`
- 히어로 섹션: 풀스크린 이미지 + 검색바 (지역, 날짜, 인원)
- 에디토리얼 큐레이션: "이번 주 추천 스테이" (비대칭 그리드)
- 카테고리 바로가기: 한옥 / 펜션 / 호텔 / 게스트하우스
- 지역별 인기 숙소 섹션
- 푸터: 로고, 메뉴, 소셜링크

### 4.2 숙소 목록 `/stays`
- 필터: 지역, 카테고리, 가격 범위(슬라이더), 인원
- 정렬: 추천순, 가격 낮은순, 평점순, 최신순
- 그리드 뷰 (카드: 이미지 슬라이더, 이름, 지역, 가격, 평점)
- 스켈레톤 로딩
- 무한 스크롤 or 페이지네이션

### 4.3 숙소 상세 `/stays/[id]`
- 이미지 갤러리 (메인 1장 + 그리드 4장, 클릭 시 전체보기 모달)
- 숙소 정보: 이름, 카테고리, 지역, 설명
- 호스트 프로필 카드
- 편의시설 아이콘 리스트
- 예약 위젯 (사이드바 고정)
  - 캘린더 날짜 선택 (이미 예약된 날짜 비활성화)
  - 인원 선택
  - 가격 계산 (박수 x 1박 가격)
  - 예약하기 버튼
- 카카오 지도 (핀 표시)
- 리뷰 섹션 (평점 분포 + 리뷰 리스트)

### 4.4 예약 확인 `/reservation/[id]`
- 예약 정보 요약 (숙소, 날짜, 인원, 금액)
- 예약 상태 표시
- 예약 취소 버튼 (pending/confirmed 상태만)

### 4.5 로그인/회원가입 `/auth`
- 이메일 + 비밀번호 로그인
- 회원가입 폼
- Supabase Auth 활용

### 4.6 마이페이지 `/mypage`
- 탭 구성
  - 예약 내역: 상태별 필터 (예정/완료/취소), 카드 리스트
  - 찜 목록: 숙소 카드 그리드
  - 내 리뷰: 작성한 리뷰 리스트
- 프로필 편집 (닉네임, 프로필 이미지)

### 4.7 관리자 `/admin`
- 숙소 관리: 테이블 뷰 + CRUD
  - 등록: 모달 폼 (이미지 업로드, 정보 입력)
  - 수정: 인라인 편집 or 모달
  - 삭제: 확인 다이얼로그
- 예약 관리: 예약 목록 + 상태 변경
- 간단한 대시보드 (총 숙소 수, 예약 수, 리뷰 수)

---

## 5. 목업 데이터 계획

### 숙소 데이터 (20~30개)
- 카테고리별 균등 배분 (펜션 7, 한옥 7, 호텔 7, 게스트하우스 7)
- 지역별 분산 (제주 8, 강원 6, 경상 5, 전라 5, 서울/경기 4)
- 실제 숙소 이름 느낌의 네이밍 (예: "소길댁", "월정리 파도소리", "북촌 고요한 아침")
- Unsplash 이미지 활용 (숙소/인테리어 키워드)
- 가격대: 80,000 ~ 350,000원

### 리뷰 데이터 (50~80개)
- 자연스러운 한국어 리뷰 텍스트
- 평점 분포: 4~5점 위주 (실제 서비스와 유사)

---

## 6. "AI스럽지 않게" 만드는 체크리스트

### 디자인
- [ ] 히어로 이미지에 그라데이션 오버레이 + 타이포 조합
- [ ] 카드 호버 시 이미지 살짝 확대 (scale 1.03, 0.3s ease)
- [ ] 비대칭 그리드 레이아웃 (홈 큐레이션 섹션)
- [ ] 스크롤 시 헤더 배경색 전환 (transparent → white)
- [ ] 찜 버튼 하트 애니메이션
- [ ] 빈 상태 일러스트 + 안내 문구
- [ ] 토스트 알림 (예약 완료, 찜 추가 등)

### 인터랙션
- [ ] 이미지 갤러리 스와이프 / 화살표 전환
- [ ] 캘린더 날짜 범위 선택 (드래그)
- [ ] 인원 선택 +/- 스텝퍼
- [ ] 필터 적용 시 URL 쿼리 파라미터 반영
- [ ] 스켈레톤 로딩 (카드, 상세 페이지)
- [ ] 페이지 전환 트랜지션

### 디테일
- [ ] 파비콘, OG 이미지 설정
- [ ] 404 페이지 커스텀
- [ ] 반응형 (모바일/태블릿/데스크톱)
- [ ] 가격 포맷팅 (₩80,000)
- [ ] 날짜 포맷팅 (2026.03.15 (일))
- [ ] 예약 불가 날짜 시각적 구분

---

## 7. 개발 일정 (2주 기준)

### 1주차: 기능 구현

| 일차 | 작업 |
|------|------|
| Day 1 | 프로젝트 세팅, Supabase 연동, DB 스키마 생성, 목업 데이터 시딩 |
| Day 2 | 공통 레이아웃 (헤더, 푸터, 디자인 시스템), 홈페이지 |
| Day 3 | 숙소 목록 페이지 (필터, 정렬, 카드) |
| Day 4 | 숙소 상세 페이지 (갤러리, 정보, 지도) |
| Day 5 | 예약 기능 (캘린더, 인원 선택, 예약 생성) |
| Day 6 | 인증 (로그인/회원가입) + 마이페이지 |
| Day 7 | 관리자 페이지 (숙소 CRUD, 예약 관리) |

### 2주차: 완성도

| 일차 | 작업 |
|------|------|
| Day 8 | 리뷰 CRUD, 찜 기능 |
| Day 9 | 마이크로 인터랙션 (호버, 트랜지션, 토스트) |
| Day 10 | 스켈레톤 로딩, 빈 상태, 에러 처리 |
| Day 11 | 반응형 대응 (모바일/태블릿) |
| Day 12 | 디자인 디테일 마감 (여백, 타이포, 컬러 통일) |
| Day 13 | Vercel 배포 + 도메인 연결 + OG/파비콘 |
| Day 14 | QA + 버그 수정 + 최종 점검 |

---

## 8. 폴더 구조

```
src/
├── app/
│   ├── layout.tsx              # 루트 레이아웃
│   ├── page.tsx                # 홈
│   ├── stays/
│   │   ├── page.tsx            # 숙소 목록
│   │   └── [id]/
│   │       └── page.tsx        # 숙소 상세
│   ├── reservation/
│   │   └── [id]/
│   │       └── page.tsx        # 예약 확인
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── mypage/
│   │   └── page.tsx
│   └── admin/
│       └── page.tsx
├── components/
│   ├── common/                 # Header, Footer, Button, Modal, Toast 등
│   ├── home/                   # Hero, Curation, CategoryNav
│   ├── stays/                  # StayCard, StayFilter, StayGrid
│   ├── detail/                 # ImageGallery, ReservationWidget, ReviewSection
│   ├── reservation/            # ReservationCard, Calendar
│   └── admin/                  # StayTable, StayForm
├── lib/
│   ├── supabase.ts             # Supabase 클라이언트
│   └── utils.ts                # 포맷팅, 헬퍼 함수
├── store/
│   └── useStore.ts             # Zustand 스토어
├── types/
│   └── index.ts                # TypeScript 타입 정의
└── data/
    └── seed.ts                 # 목업 데이터 시딩 스크립트
```

---

## 9. 배포 체크리스트

- [ ] Vercel 프로젝트 연결
- [ ] Supabase 환경 변수 설정
- [ ] 목업 데이터 프로덕션 DB에 시딩
- [ ] 이미지 최적화 (next/image)
- [ ] Lighthouse 성능 점검 (목표: 90+)
- [ ] 모바일 최종 확인
