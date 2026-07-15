# vendys-frontend (모노레포 테스트)

pnpm workspace + Turborepo 구조를 실제로 굴려보기 위한 최소 예제.
앱 2개(`market-web`, `vone-web`) + 공유 패키지 3개(`ui`, `typescript-config`, `eslint-config`)로 구성했다.

```
vendys-frontend/
├─ pnpm-workspace.yaml   # 워크스페이스 범위 + catalog(버전 관리)
├─ turbo.json            # 태스크 파이프라인(build/lint/test/dev)
├─ package.json          # 루트: pnpm/Node 핀, turbo 스크립트
├─ apps/
│  ├─ market-web/        # React 19  (dev: http://localhost:5173)
│  └─ vone-web/          # React 18  (dev: http://localhost:5174)
└─ packages/
   ├─ ui/                # @vendys/ui — 두 앱이 공유하는 컴포넌트 (tsup 빌드)
   ├─ typescript-config/ # @vendys/typescript-config — 공유 tsconfig (base/react)
   └─ eslint-config/     # @vendys/eslint-config — 공유 ESLint flat config
```

## 시작

```bash
pnpm install
pnpm build          # ui/config → 두 앱 순서로 빌드
```

## 핵심 명령과 각각 확인할 것

| 명령 | 무엇을 보여주나 |
|------|----------------|
| `pnpm build` | `@vendys/ui`가 먼저, 그다음 앱들이 빌드됨 (`dependsOn: ^build`) |
| `pnpm build` (두 번째) | 안 바뀌었으면 `>>> FULL TURBO` — 캐시에서 즉시 복원 |
| `pnpm lint` | 세 패키지가 공유 `@vendys/eslint-config`로 lint |
| `pnpm test` | `node --test`가 공유 `@vendys/ui`를 import해 동작 확인 |
| `pnpm dev` | ui(watch) + 두 앱 dev 서버 동시 실행 (5173 / 5174) |
| `turbo run dev --filter=market-web` | market-web 하나만 |
| `turbo run build --affected` | 바뀐 것만 (기준 `main...HEAD`) |

## 이 예제가 증명하는 것

- **catalog로 React 버전 공존** — market-web은 19, vone-web은 18. 확인:
  ```bash
  node -e "console.log(require('./apps/market-web/node_modules/react/package.json').version)"  # 19.x
  node -e "console.log(require('./apps/vone-web/node_modules/react/package.json').version)"    # 18.x
  ```
  버전은 `pnpm-workspace.yaml`의 `catalogs:` 한 곳에서만 관리한다.
- **workspace 링크** — 앱은 `@vendys/ui`를 `workspace:*`로 참조. 발행·설치 없이 옆 폴더를 바로 씀.
- **공유 설정** — 각 앱의 `tsconfig.json`은 `@vendys/typescript-config/react.json`을 extends,
  `eslint.config.js`는 `@vendys/eslint-config/base`를 재수출. 설정 중복이 사라진다.
- **topological 빌드** — `ui`가 빌드돼야 앱이 빌드된다(turbo가 순서 자동 결정).
- **캐싱** — 안 바뀐 태스크는 재실행하지 않음.

## 실제 프로덕션과의 차이 (의도적으로 낮춘 것)

- 이 머신 기준 **Node 22 / pnpm 10.33**으로 맞춰 바로 돌아가게 함.
  실제 목표는 **Node 24.11.1 / pnpm 11**이며, `package.json`의 `packageManager`와
  `devEngines.runtime`를 그 값으로 올리면 된다(`onFail`을 `warn`→`download`로).
- ESLint는 최신 10.x 대신, `typescript-eslint` 8.x가 공식 지원하는 **9.x**로 핀했다.
- E2E(`e2e/`)는 아직 없다. 필요 시 `packages`/`apps`와 같은 방식으로 추가.

## 다음 단계

- 앱 추가: `apps/<name>/`을 만들면 `pnpm-workspace.yaml`의 `apps/*`가 자동으로 잡음.
- 공유 코드 추출: 반복 컴포넌트를 `packages/ui`로 옮기고 각 앱에서 `@vendys/ui`로 import.
- E2E 추가: `e2e/` 워크스페이스 + Playwright, `turbo.json`에 `e2e` 태스크(`dependsOn: build`).
