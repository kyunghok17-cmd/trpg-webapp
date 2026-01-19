# TRPG Adventure Web App 🎮⚔️

AI 기반 텍스트 롤플레잉 게임(TRPG) 웹 애플리케이션입니다. Google Gemini API를 게임 마스터로 활용하여 동적이고 몰입감 있는 스토리를 생성합니다.

## 주요 기능

### 🎭 캐릭터 생성
- 캐릭터 이름 커스터마이징
- 5가지 직업 선택 (전사, 마법사, 도적, 성기사, 궁수)
- HP/MP 상태 표시 바

### 🎲 AI 게임 마스터
- Gemini API를 활용한 동적 스토리 생성
- 플레이어 행동에 따른 실시간 반응
- 각 상황마다 3-4개의 선택지 제공
- 전투, 대화, 탐험 등 다양한 게임플레이

### 💬 실시간 채팅 인터페이스
- 직관적인 대화형 UI
- 메시지 히스토리 유지
- 부드러운 스크롤 애니메이션
- 로딩 상태 표시

### 🎨 현대적인 디자인
- 그래디언트 배경과 글래스모피즘 효과
- 반응형 디자인 (모바일/태블릿/데스크톱)
- 다크 테마
- 커스텀 스크롤바

## 기술 스택

- **프레임워크**: Next.js 14 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **AI**: Google Gemini API (gemini-pro 모델)
- **배포**: Vercel

## 설치 및 실행

### 1. 의존성 설치

\`\`\`bash
npm install
\`\`\`

필요한 패키지:
- `next`: Next.js 프레임워크
- `react`, `react-dom`: React 라이브러리
- `@google/generative-ai`: Gemini API 클라이언트
- `typescript`: TypeScript 지원
- `tailwindcss`, `postcss`, `autoprefixer`: 스타일링

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 Gemini API 키를 추가합니다:

\`\`\`env
GEMINI_API_KEY=your_gemini_api_key_here
\`\`\`

**Gemini API 키 발급 방법:**
1. [Google AI Studio](https://makersuite.google.com/app/apikey) 접속
2. Google 계정으로 로그인
3. "Get API Key" 클릭
4. API 키 복사 후 `.env.local`에 붙여넣기

### 3. 개발 서버 실행

\`\`\`bash
npm run dev
\`\`\`

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

### 4. 프로덕션 빌드

\`\`\`bash
npm run build
npm start
\`\`\`

## Vercel 배포

### 1. Vercel 계정 준비
- [Vercel](https://vercel.com) 가입 (GitHub 계정 연동 권장)

### 2. GitHub 저장소 생성 및 푸시

\`\`\`bash
cd trpg-webapp
git init
git add .
git commit -m "Initial commit: TRPG web app"
git branch -M main
git remote add origin https://github.com/your-username/trpg-webapp.git
git push -u origin main
\`\`\`

### 3. Vercel에서 프로젝트 임포트
1. Vercel 대시보드에서 "New Project" 클릭
2. GitHub 저장소 선택
3. 프로젝트 설정:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 4. 환경 변수 설정
Vercel 프로젝트 설정에서:
1. "Settings" → "Environment Variables"
2. 다음 변수 추가:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: 발급받은 Gemini API 키
   - **Environment**: Production, Preview, Development 모두 선택

### 5. 배포
- "Deploy" 버튼 클릭
- 자동으로 빌드 및 배포 시작
- 배포 완료 후 생성된 URL로 접속

### 6. 자동 배포 설정
- GitHub에 푸시할 때마다 자동으로 배포됨
- PR 생성시 프리뷰 배포 자동 생성

## 프로젝트 구조

\`\`\`
trpg-webapp/
├── app/
│   ├── api/
│   │   └── gemini/
│   │       └── route.ts          # Gemini API 엔드포인트
│   ├── layout.tsx                # 루트 레이아웃
│   ├── page.tsx                  # 메인 게임 페이지
│   └── globals.css               # 전역 스타일
├── public/                       # 정적 파일
├── .env.local                    # 환경 변수 (git에 포함되지 않음)
├── .gitignore                    # Git 무시 파일
├── next.config.js                # Next.js 설정
├── package.json                  # 프로젝트 의존성
├── postcss.config.js             # PostCSS 설정
├── tailwind.config.js            # Tailwind CSS 설정
├── tsconfig.json                 # TypeScript 설정
├── vercel.json                   # Vercel 배포 설정
└── README.md                     # 프로젝트 문서
\`\`\`

## API 엔드포인트

### POST /api/gemini

게임 마스터 응답을 생성합니다.

**요청 본문:**
\`\`\`json
{
  "messages": [
    { "role": "user", "content": "플레이어 메시지" },
    { "role": "assistant", "content": "GM 응답" }
  ],
  "character": {
    "name": "캐릭터 이름",
    "class": "직업",
    "level": 1,
    "hp": 100,
    "maxHp": 100,
    "mp": 50,
    "maxMp": 50
  },
  "gameState": {
    "location": "현재 위치",
    "currentQuest": "진행 중인 퀘스트"
  }
}
\`\`\`

**응답:**
\`\`\`json
{
  "message": "게임 마스터의 응답 메시지"
}
\`\`\`

## 게임플레이 가이드

1. **게임 시작**
   - 캐릭터 이름과 직업을 선택
   - "모험 시작하기" 버튼 클릭

2. **게임 진행**
   - AI 게임 마스터가 상황을 설명
   - 채팅창에 원하는 행동을 입력
   - Enter 키로 전송 (Shift+Enter로 줄바꿈)

3. **전투와 스킬**
   - "검으로 공격한다", "마법을 사용한다" 등 자유롭게 행동 입력
   - AI가 주사위 굴림과 결과를 자동으로 판정

4. **탐험**
   - "주변을 둘러본다", "마을로 간다" 등 이동 명령
   - "NPC와 대화한다" 등 상호작용

## 커스터마이징

### 게임 마스터 프롬프트 수정

`app/api/gemini/route.ts`의 `systemPrompt`를 수정하여 게임 스타일 변경:
- 판타지, SF, 호러 등 장르 변경
- 난이도 조절
- 특정 설정이나 룰 추가

### 캐릭터 직업 추가

`app/page.tsx`의 직업 선택 부분에 새로운 직업 추가:
\`\`\`tsx
<option value="드루이드">🌿 드루이드</option>
\`\`\`

### UI 테마 변경

`app/globals.css`와 Tailwind 클래스를 수정하여 색상 테마 변경

## 문제 해결

### API 키 오류
- `.env.local` 파일에 올바른 Gemini API 키가 있는지 확인
- 개발 서버 재시작

### 빌드 오류
- `node_modules` 삭제 후 `npm install` 재실행
- Node.js 버전 확인 (18.17 이상 권장)

### Vercel 배포 실패
- 환경 변수가 올바르게 설정되었는지 확인
- 빌드 로그에서 에러 메시지 확인

## 향후 개선 사항

- [ ] 게임 세이브/로드 기능
- [ ] 캐릭터 스탯 시스템 고도화
- [ ] 인벤토리 및 아이템 시스템
- [ ] 멀티플레이어 지원
- [ ] 음성 합성 (TTS)
- [ ] 이미지 생성 (캐릭터, 장면)
- [ ] 전투 애니메이션
- [ ] 업적 시스템

## 라이선스

MIT License

## 기여

이슈와 풀 리퀘스트는 언제나 환영합니다!

## 제작자

Created with ❤️ using Gemini AI

---

즐거운 모험 되세요! 🎲✨
