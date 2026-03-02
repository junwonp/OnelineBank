# OnelineBank

[레거시 프로젝트 보기](https://github.com/junwonp/OnelineBank-legacy)

## 프로젝트 소개

2021년 우리은행 온택트 해커톤 출품작을 리빌드한 프로젝트입니다.

원본은 React Native (JavaScript)로 3~4일 만에 책을 보며 빠르게 제작한 것이라 코드 품질이 좋지 않았습니다. 이를 최신 기술 스택과 TypeScript로 전면 재작성하였습니다.

채팅 메시지를 분석하여 은행명, 계좌번호, 금액을 자동으로 인식하고, 생체 인증 후 송금까지 처리하는 **채팅 기반 간편 송금 앱**입니다.

## 주요 기능

- 채팅 텍스트에서 송금 정보(은행, 계좌번호, 금액) 자동 파싱
- 생체 인증(Face ID / Touch ID)을 통한 송금 확인
- Firebase 기반 회원가입 / 로그인
- 자주 쓰는 계좌 등록 및 관리 (주소록)
- 오프라인 대응 및 쿼리 캐싱

## 기술 스택

| 분류 | 기술 |
|---|---|
| 프레임워크 | React Native 0.83 + Expo 55 |
| 언어 | TypeScript 5.9 |
| 라우팅 | Expo Router (파일 기반) |
| 서버 상태 관리 | TanStack Query v5 |
| 폼 관리 | TanStack Form v1 |
| 클라이언트 상태 관리 | Zustand v5 |
| 스타일링 | NativeWind v5 (Tailwind CSS) |
| 스키마 검증 | Zod v4 |
| 로컬 스토리지 | MMKV |
| 쿼리 퍼시스트 | TanStack Query Async Storage Persister |
| 백엔드 | Firebase (Auth, Firestore, Crashlytics) |
| 애니메이션 | React Native Reanimated 4 |

## 시작하기

### 의존성 설치

```bash
yarn install
```

### 앱 실행

```bash
yarn start
```

iOS 시뮬레이터, Android 에뮬레이터, 또는 실기기에서 실행할 수 있습니다.

```bash
yarn ios
yarn android
```
