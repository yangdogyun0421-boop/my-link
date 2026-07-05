# 마이링크 (MyLink) — 개발 지침서

> **목적**: AI 에이전트가 프로젝트 컨텍스트를 빠르게 파악하고 일관된 코드를 작성하기 위한 단일 참조 문서  
> **최종 갱신**: 2026-07-05  
> **상세 문서**: [PRD](./prd.md) · [사용자 시나리오](./user-scenarios.md) · [와이어프레임](./wireframes.md)

---

## 1. 프로젝트 한 줄 요약

**Linktree 클론** — 사용자가 여러 링크를 하나의 공개 페이지에 모아 SNS 바이오에 공유하는 서비스.

---

## 2. 기술 스택

| 항목 | 기술 | 비고 |
|------|------|------|
| 프레임워크 | **Next.js 16** (App Router) | `node_modules/next/dist/docs/` 참조 필수 |
| 언어 | **TypeScript** (strict mode) | |
| 스타일링 | **Tailwind CSS v4** + **shadcn/ui** (base-mira 스타일) | |
| UI 컴포넌트 | **@base-ui/react** 기반 shadcn v4 | `npx shadcn@latest add <컴포넌트명>` |
| 아이콘 | **HugeIcons** (`@hugeicons/react`, `@hugeicons/core-free-icons`) | |
| 폰트 | **Raleway** (본문, `--font-sans`), **Nunito Sans** (제목, `--font-heading`), **Geist Mono** (코드) | |
| 테마 | **next-themes** (system/dark/light) | `d` 키로 토글 |
| 유틸리티 | **clsx** + **tailwind-merge** → `cn()` 함수 | `@/lib/utils` |
| 백엔드/DB | **Firebase** (Firestore + Authentication) | 아직 미설정 |
| 인증 | **Google 소셜 로그인** (Firebase Auth) | |
| 배포 | Vercel 또는 Firebase Hosting | |

---

## 3. 현재 프로젝트 상태

### ✅ 완료

- Next.js + Tailwind CSS + shadcn/ui 초기 프로젝트 설정
- 폰트 설정 (Raleway, Nunito Sans, Geist Mono)
- 테마 프로바이더 (다크모드 지원)
- shadcn Button 컴포넌트
- PRD / 사용자 시나리오 / 와이어프레임 문서

### ❌ 미구현

- [ ] 랜딩 페이지 (`/`)
- [ ] 로그인 페이지 (`/login`)
- [ ] 대시보드 (`/dashboard`)
- [ ] 공개 프로필 페이지 (`/[displayName]`)
- [ ] 404 페이지
- [ ] Firebase 설정 및 연동 (Auth, Firestore)
- [ ] 인라인 편집 컴포넌트
- [ ] 반응형 레이아웃

---

## 4. 디렉토리 구조 (목표)

```
my-link/
├── app/
│   ├── layout.tsx              # 루트 레이아웃 (폰트, 테마)
│   ├── globals.css             # 글로벌 CSS (shadcn 토큰)
│   ├── page.tsx                # 랜딩 페이지 (/)
│   ├── login/
│   │   └── page.tsx            # 로그인 페이지
│   ├── dashboard/
│   │   └── page.tsx            # 대시보드 (인증 필요)
│   ├── [displayName]/
│   │   └── page.tsx            # 공개 프로필 페이지
│   └── not-found.tsx           # 404 페이지
├── components/
│   ├── ui/                     # shadcn 컴포넌트 (자동생성)
│   ├── theme-provider.tsx      # 테마 프로바이더
│   ├── landing/                # 랜딩 페이지 전용 컴포넌트
│   ├── dashboard/              # 대시보드 전용 컴포넌트
│   └── profile/                # 공개 프로필 전용 컴포넌트
├── lib/
│   ├── utils.ts                # cn() 유틸리티
│   └── firebase/
│       ├── config.ts           # Firebase 초기화
│       ├── auth.ts             # 인증 관련 함수
│       └── firestore.ts        # Firestore CRUD 함수
├── hooks/
│   ├── use-auth.ts             # 인증 상태 훅
│   └── use-inline-edit.ts      # 인라인 편집 훅
├── types/
│   └── index.ts                # 공통 타입 정의
└── docs/                       # 기획 문서
```

---

## 5. 페이지 라우팅 & 접근 제어

```
/ ........................ 랜딩 페이지 (공개)
/login ................... 로그인 페이지 (공개, 로그인 상태면 /dashboard로 리다이렉트)
/dashboard ............... 대시보드 (인증 필요, 미인증 시 /login으로 리다이렉트)
/[displayName] ........... 공개 프로필 (공개, 미존재 시 404)
```

### 네비게이션 흐름

```
랜딩(/) → "시작하기" → /login → Google 로그인 → /dashboard
대시보드 → "내 페이지 URL 클릭" → /[displayName]
대시보드 → "로그아웃" → /login
/[존재하지않는경로] → 404 → "홈으로" → /
```

---

## 6. 페이지별 구현 명세

### 6.1 랜딩 페이지 (`/`)

**역할**: 서비스 소개 + 회원가입 유도

**섹션 구성**:
1. **Header** — 로고(`🔗 MyLink`) + "시작하기" CTA 버튼 → `/login`
2. **Hero** — 메인 타이틀 + 서브 타이틀 + "무료로 시작하기" CTA → `/login`
3. **Features** — 3개 카드 (⚡ 간편 설정 / 🎨 나만의 페이지 / 📱 어디서나)
4. **Footer** — `© 2026 MyLink`

**핵심 요구사항**:
- 로그인 상태라면 CTA 버튼 텍스트를 "대시보드로 이동"으로 변경하고 `/dashboard`로 연결
- 반응형: 모바일에서 Features 카드를 1열로 전환

---

### 6.2 로그인 페이지 (`/login`)

**역할**: Google 소셜 로그인

**UI 구성**:
- 화면 중앙에 카드 배치
- 카드 내: 로고 + 안내 문구 + "Google로 로그인" 버튼
- 카드 하단: "← 홈으로 돌아가기" 링크 → `/`

**처리 흐름**:
1. Google OAuth 팝업 실행
2. 인증 성공 → Firestore에서 사용자 문서 존재 확인
3. **신규 사용자** → 자동 프로필 생성:
   - `displayName`: Gmail `@` 앞부분 (예: `yangdogyun0421`)
   - `username`: Google 표시 이름 (예: `양도균`)
   - `photoURL`: Google 프로필 사진 URL
   - `usernames/{displayName}` 문서에 `userId` 매핑
4. `/dashboard`로 리다이렉트

---

### 6.3 대시보드 (`/dashboard`)

**역할**: 프로필 관리 + 링크 CRUD

**레이아웃**: 데스크탑에서 사이드바 + 메인 영역 / 모바일에서 1단

**사이드바**:
- 로고
- 메뉴: 📋 링크 관리, 👤 내 프로필 (같은 페이지 내 스크롤)
- 하단 고정: 🚪 로그아웃

**메인 영역**:

#### A. 프로필 섹션
- **프로필 이미지**: 원형, Google 사진 (읽기 전용)
- **username**: 인라인 편집 가능, 최대 30자
- **displayName**: `@` 접두어, 인라인 편집, 영문소문자/숫자/하이픈만, 최대 30자, **실시간 중복 검사**
- **Bio**: 인라인 편집, 최대 150자

#### B. URL 바
- `mylink.com/{displayName}` 형식 표시
- **클립보드 복사** 버튼

#### C. 링크 목록
- 헤더: "내 링크 목록" + "링크 추가" 버튼
- **링크 카드**: 파비콘(좌) + 제목(인라인편집) + URL(인라인편집) + 삭제 버튼(우)
- **빈 상태**: 링크 0개일 때 안내 메시지 + CTA

#### 인라인 편집 동작 (모든 편집 필드 공통)
| 동작 | 결과 |
|------|------|
| 텍스트 클릭 또는 ✏️ 클릭 | → 입력 필드로 전환 (편집 모드) |
| Enter 또는 바깥 클릭 | → Firestore 저장 시도 |
| Escape | → 변경 취소, 원래 값 복원 |
| 저장 중 | → 입력 필드 비활성화 + 로딩 스피너 |
| 저장 실패 | → 오류 표시 + 편집 모드 유지 |

#### 링크 추가 폼
- "링크 추가" 클릭 → 목록 상단에 폼 표시
- 입력 필드: 제목 (placeholder: "링크 제목을 입력하세요"), URL (placeholder: "https://")
- URL 유효성 검증: `http://` 또는 `https://`로 시작 필수
- 버튼: 취소 / 저장

#### 삭제 확인 다이얼로그
- 오버레이 모달
- "🗑️ 링크를 삭제하시겠습니까?" + 삭제 대상 링크 제목 표시
- 버튼: 취소 / 삭제 (강조 색상)

---

### 6.4 공개 프로필 페이지 (`/[displayName]`)

**역할**: 방문자에게 소유자의 링크 목록 표시

**표시 요소** (위→아래):
1. 프로필 이미지 (원형)
2. username (닉네임)
3. Bio (소개글)
4. 링크 카드 목록 (createdAt 순)
   - 파비콘 + 제목 + 화살표(→)
   - 클릭 시 **새 탭**(`target="_blank"`)으로 열림
5. "Powered by MyLink" 푸터

**핵심 요구사항**:
- 인증 불필요 (공개 페이지)
- 존재하지 않는 displayName → **404 페이지**
- SSR 또는 ISR 활용 (SEO + 로딩 속도)
- 링크 0개: "아직 등록된 링크가 없습니다" 메시지
- 반응형: 모바일~데스크탑 대응

---

### 6.5 404 페이지

**표시 요소**:
- "404" 대형 텍스트
- "페이지를 찾을 수 없습니다"
- "요청하신 페이지가 존재하지 않습니다."
- "홈으로 돌아가기" 버튼 → `/`

---

## 7. 데이터 모델 (Firestore)

### 7.1 컬렉션 구조

```
users/{userId}
  ├── displayName: string          // URL 고유 식별자 (예: "dokyun")
  ├── username: string             // 프로필 표시 닉네임 (예: "양도균")
  ├── email: string                // 이메일 (Google)
  ├── photoURL: string             // 프로필 이미지 URL
  ├── bio: string                  // 소개글 (최대 150자)
  ├── createdAt: timestamp
  ├── updatedAt: timestamp
  │
  └── links/{linkId}               // 서브 컬렉션
        ├── title: string            // 링크 제목
        ├── url: string              // 링크 URL
        └── createdAt: timestamp

usernames/{displayName}
  └── userId: string               // displayName → userId 매핑 (중복 방지)
```

### 7.2 중요 제약사항

- `displayName` 변경 시: 기존 `usernames/{이전}` 삭제 + 새 `usernames/{새}` 생성 → **트랜잭션 필수**
- `displayName` 유효성: 영문 소문자 + 숫자 + 하이픈(`-`)만, 최대 30자
- 링크 개수 제한 없음
- 링크 순서: `createdAt` 기준

---

## 8. 파비콘 처리

```
https://www.google.com/s2/favicons?domain={도메인}&sz=64
```

- 링크 URL에서 도메인 추출 → API URL 동적 생성
- DB에 파비콘 URL 저장하지 않음 (클라이언트에서 실시간 로드)
- 로드 실패 시: 기본 링크 아이콘(🔗) 대체 표시
- 대시보드 + 공개 프로필 양쪽에서 동일하게 사용

---

## 9. 반응형 Breakpoints

| 기기 | 너비 | 레이아웃 |
|------|------|----------|
| 모바일 | < 640px | 1단 세로, 터치 친화적, 사이드바 → 하단 또는 햄버거 |
| 태블릿 | 640px ~ 1024px | 적당한 여백, 중간 크기 카드 |
| 데스크탑 | > 1024px | 넓은 레이아웃, 사이드바 기반 대시보드 |

---

## 10. 구현 순서 (권장)

> 아래 순서는 의존성을 고려한 권장 순서입니다.

### Phase 1 — UI 구축 (Firebase 없이 목업 데이터로)

| 순서 | 작업 | 설명 |
|------|------|------|
| 1 | 랜딩 페이지 | Header + Hero + Features + Footer |
| 2 | 로그인 페이지 | 카드 UI (버튼은 아직 동작 X) |
| 3 | 대시보드 레이아웃 | 사이드바 + 프로필 + 링크 목록 (목업 데이터) |
| 4 | 인라인 편집 컴포넌트 | 재사용 가능한 `InlineEdit` 훅/컴포넌트 |
| 5 | 공개 프로필 페이지 | 프로필 + 링크 카드 (목업 데이터) |
| 6 | 404 페이지 | |

### Phase 2 — Firebase 연동

| 순서 | 작업 | 설명 |
|------|------|------|
| 7 | Firebase 초기화 | `lib/firebase/config.ts` |
| 8 | Google 인증 | `lib/firebase/auth.ts` + `hooks/use-auth.ts` |
| 9 | 인증 가드 | 대시보드 접근 제어, 로그인 리다이렉트 |
| 10 | 사용자 프로필 CRUD | Firestore 연동 |
| 11 | 링크 CRUD | Firestore 서브 컬렉션 연동 |
| 12 | 공개 프로필 SSR | displayName 기반 데이터 페칭 |

### Phase 3 — 마무리

| 순서 | 작업 | 설명 |
|------|------|------|
| 13 | displayName 중복 검사 | 실시간 Firestore 쿼리 |
| 14 | URL 복사 기능 | Clipboard API |
| 15 | 반응형 최적화 | 모바일 사이드바, 카드 레이아웃 조정 |
| 16 | 빌드 검증 | `npm run build` |

---

## 11. 코드 컨벤션

### 일반

- **언어**: TypeScript strict 모드
- **스타일링**: Tailwind CSS 유틸리티 클래스 사용, `cn()` 함수로 조건부 클래스 병합
- **컴포넌트**: shadcn/ui 컴포넌트 우선 사용 → `npx shadcn@latest add <name>`
- **아이콘**: HugeIcons 사용 (`import { IconName } from "@hugeicons/react"`)
- **폰트**: 제목에는 `font-heading`, 본문은 `font-sans` (기본 적용됨)

### 파일/네이밍

- 컴포넌트 파일: `kebab-case.tsx` (예: `inline-edit.tsx`)
- 타입 파일: `kebab-case.ts`
- 훅: `use-<name>.ts` (예: `use-auth.ts`)
- 서버 컴포넌트 기본, 클라이언트 필요 시 `"use client"` 명시

### shadcn 컴포넌트 추가 방법

```bash
npx shadcn@latest add dialog    # 예: 삭제 확인 다이얼로그
npx shadcn@latest add input     # 예: 인라인 편집 입력 필드
npx shadcn@latest add card      # 예: 링크 카드
```

### next.config.ts 설정 주의사항

- Google 프로필 이미지 사용 시 `images.remotePatterns`에 `lh3.googleusercontent.com` 추가 필요
- Google Favicon API 사용 시 `www.google.com` 추가 필요

---

## 12. 주의사항 & 엣지 케이스

| 상황 | 처리 방법 |
|------|----------|
| displayName에 비ASCII 문자 | URL 인코딩/디코딩 처리 |
| Gmail 앞부분이 이미 사용 중 (신규 가입 시) | 숫자 접미사 자동 추가 또는 사용자에게 변경 요청 |
| 파비콘 로드 실패 | 기본 아이콘(🔗) 대체 |
| 공개 페이지에 링크 0개 | "아직 등록된 링크가 없습니다" 메시지 |
| 비로그인 상태로 /dashboard 접근 | /login으로 리다이렉트 |
| 이미 로그인 상태에서 /login 접근 | /dashboard로 리다이렉트 |
| displayName 변경 중 네트워크 오류 | 트랜잭션 롤백, 편집 모드 유지, 오류 메시지 |

---

## 13. 빠른 참조

### 파일 위치

| 역할 | 경로 |
|------|------|
| 글로벌 CSS | `app/globals.css` |
| 루트 레이아웃 | `app/layout.tsx` |
| cn() 유틸리티 | `lib/utils.ts` |
| 테마 프로바이더 | `components/theme-provider.tsx` |
| shadcn 설정 | `components.json` |
| UI 컴포넌트 | `components/ui/` |

### 자주 쓰는 명령어

```bash
npm run dev          # 개발 서버 실행
npm run build        # 프로덕션 빌드 (검증용)
npm run typecheck    # TypeScript 타입 체크
npm run lint         # ESLint 실행
npm run format       # Prettier 포맷팅
npx shadcn@latest add <name>   # shadcn 컴포넌트 추가
```
