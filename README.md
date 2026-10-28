# ⚽ FC TACTICS

> FC온라인 구단주 닉네임으로 최근 경기 전적, 스쿼드, 플레이 스타일을 한눈에 보는 전적 검색 사이트

**🔗 배포 링크: https://fctactics.vercel.app**

<img width="1919" height="1078" alt="검색 화면" src="https://github.com/user-attachments/assets/36b8e403-05f8-4592-b054-a58462fae3da" />
<img width="1917" height="1072" alt="검색 결과 화면" src="https://github.com/user-attachments/assets/3a7a7d77-7736-4eb7-9b66-7b977af0579d" />

<br />

## 주요 기능

| 기능 | 설명 |
|---|---|
| 구단주 검색 | 닉네임으로 검색하고 역대 최고 등급을 표시 |
| 경기 유형 필터 | 공식경기, 감독모드 등 유형별 전적 조회 |
| 최근 경기 목록 | 최근 20경기를 5개씩 더보기로 표시하고 스코어와 승패를 보여줌 |
| 스쿼드 보기 | 경기를 누르면 양 팀 선수를 축구장 위 포지션에 배치하고 평점, 골, 어시스트를 표시 |
| 플레이 스타일 차트 | 최근 경기 기준 유효슈팅률, 골 결정력, 패스·드리블 성공률, 점유율, 승률을 차트로 표시 |

<br />

## 기술 스택

| 구분 | 사용 기술 |
|---|---|
| 프레임워크 | React 19, TypeScript, Vite |
| 서버 상태 | TanStack Query |
| 클라이언트 상태 | Zustand |
| 스타일 | Tailwind CSS, shadcn/ui |
| 차트 | Recharts |
| 배포 | Vercel (정적 호스팅 + 서버리스 함수) |
| 데이터 | NEXON Open API (FC온라인) |

<br />

## 구조

```
브라우저 ──▶ /api/fconline/v1/*  ──▶  Vercel 서버리스(api/nexon.ts)  ──▶  NEXON Open API
                                       · API 키 주입
                                       · 허용 경로만 통과
                                       · 경로별 CDN 캐시
브라우저 ──▶ NEXON 메타데이터 CDN (선수·포지션·등급 정보, 키 불필요)
```

```
src/
├─ api/          # axios 인스턴스, 429 재시도, API 함수
├─ hooks/        # TanStack Query 훅 (전적, 경기 상세, 메타데이터)
├─ stores/       # Zustand (검색어, 경기 유형)
├─ components/   # 경기 목록, 축구장 레이아웃, 차트, UI
├─ pages/        # 검색 / 검색 결과
├─ constants/    # 포지션별 좌표·색상
└─ utils/        # 날짜(KST), 선수 이미지 경로
api/nexon.ts     # Vercel 서버리스 프록시
```

<br />

## 기술적 고민

### 1. API 키가 브라우저에 노출되는 문제
- **문제**: 처음에는 `VITE_` 환경변수로 키를 넣어 요청했는데, Vite는 `VITE_` 변수를 빌드 결과물에 그대로 포함시킨다. 배포된 JS 파일을 열면 누구나 키를 볼 수 있었다.
- **해결**: 키를 서버 쪽으로 옮겼다.
  - 개발 환경: Vite dev server 프록시가 요청 헤더에 키를 주입
  - 배포 환경: Vercel 서버리스 함수(`api/nexon.ts`)가 키를 주입하고 넥슨 API로 전달
  - 프록시는 미리 정한 경로만 통과시켜, 다른 용도로 악용되지 않게 막았다.

### 2. 같은 데이터를 반복 요청하는 문제
데이터 성격에 따라 캐시 기간을 다르게 두었다.

| 데이터 | 특징 | 캐시 |
|---|---|---|
| 경기 상세 | 끝난 경기는 바뀌지 않음 | 브라우저 무기한 + CDN 1년 |
| 메타데이터 | 세션 동안 바뀌지 않음 | 브라우저 무기한 |
| 최고 등급, 닉네임→ID | 가끔 바뀜 | 10분 / CDN 5~10분 |
| 최근 경기 목록 | 새 경기가 추가됨 | 1분 / CDN 30초 |

- 플레이 스타일 차트와 경기 목록이 같은 query key를 써서, 경기 상세를 두 번 요청하지 않는다.
- 브라우저 캐시(TanStack Query)와 서버 캐시(Vercel CDN)를 함께 써서, 다른 사용자가 같은 경기를 봐도 넥슨 API를 다시 부르지 않는다.

### 3. 요청 한도 초과 (429)
넥슨 API는 짧은 시간에 요청이 몰리면 429를 돌려준다. axios 인터셉터에서 429를 받으면 1초, 2초, 4초 간격으로 최대 3번 다시 시도하게 했다.

### 4. 초기 로딩 속도
- **차트 lazy 로딩**: Recharts는 용량이 커서, 검색 결과 화면에 들어갈 때만 불러온다.
- **큰 메타데이터 분리**: 선수 이름 파일(`spid.json`)이 커서 첫 화면 로딩과 분리했다. 경기 목록이 뜨면 백그라운드에서 미리 받아 두고, 스쿼드를 펼칠 때 바로 이름이 보이게 했다.
- **필요한 경기만 표시**: 경기 목록은 5개씩 더보기로 보여준다.

### 5. 축구장 위 선수 배치
포지션 번호마다 x, y 좌표를 정하고, SVG로 그린 경기장 위에 선수 카드를 배치했다. 상대 팀은 y 좌표를 뒤집어 반대편 진영에 놓았다. 팀 안에서 평점이 가장 높은 선수와 낮은 선수는 색으로 구분했다.

<br />

## 로컬 실행

```bash
git clone https://github.com/byun970/fctactics.git
cd fctactics
npm install
cp .env.example .env   # NEXON_API_KEY에 넥슨 Open API 키 입력
npm run dev
```

- 넥슨 API 키는 [NEXON Open API](https://openapi.nexon.com)에서 발급받는다.
- 배포할 때는 Vercel 프로젝트 환경변수에 `NEXON_API_KEY`를 등록한다.
- `VITE_` 접두사를 붙이지 않는다. 붙이면 키가 클라이언트 번들에 노출된다.

<br />

## 개선 예정
- [ ] 최근 20경기 이후 기록 조회
- [ ] 선수별 상세 기록
- [ ] 테스트 코드 추가

<br />

---
Data based on NEXON Open API.
