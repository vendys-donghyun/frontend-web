---
id: intro
title: 시작하기
sidebar_position: 1
slug: /
---

# 현대벤디스 디자인 시스템

디자인 토큰과 공용 UI 컴포넌트를 하나의 기준으로 관리합니다.
Desktop과 Mobile을 대상으로 합니다.

## 패키지 구성

| 패키지 | 역할 |
|---|---|
| `@vendys/tokens` | 디자인 토큰 - CSS 변수(`--vd-*`)와 TS 상수 |
| `@vendys/ui` | 공용 UI 컴포넌트 (React) |

## 설치

모노레포 내부에서는 workspace 프로토콜로 참조합니다.

```json
{
  "dependencies": {
    "@vendys/tokens": "workspace:*",
    "@vendys/ui": "workspace:*"
  }
}
```

## 사용

앱 엔트리에서 토큰 CSS와 컴포넌트 스타일을 한 번 불러옵니다.

```tsx
import '@vendys/tokens/css';
import '@vendys/ui/styles.css';

import { Button } from '@vendys/ui';

export function App() {
  return <Button>저장</Button>;
}
```

TS 상수가 필요하면 `@vendys/tokens`에서 직접 가져옵니다.

```ts
import { colors, spacing, radius } from '@vendys/tokens';

colors.primary; // '#43A047'
radius.md;      // 8
```

## 핵심 원칙

- **Primary는 `#43A047` 하나** - 성공 상태(success)도 같은 색을 재사용합니다.
- **폰트는 Pretendard** - 시스템 폰트 폴백을 포함한 스택을 사용합니다.
- **간격은 4px 그리드** - 임의 값 대신 `--vd-space-*` 토큰을 씁니다.
- **radius 기본 8px** - 큰 컨트롤(48px)은 12px로 비례 확대합니다.
- **반응형 기준점은 하나** - 767px 이하 Mobile, 768px 이상 Desktop.
