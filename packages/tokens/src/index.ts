/**
 * 현대벤디스 디자인 토큰 v0.2 — TS 상수
 * CSS 변수(tokens.css)와 같은 값을 JS에서 참조할 때 사용한다.
 * 원천 문서: packages/tokens/DESIGN.md
 */

export const colors = {
  primary: '#43A047',
  primaryHover: '#388E3C',
  primaryActive: '#2E7D32',
  primaryTint: '#E8F5E9',
  primaryTintHover: '#C8E6C9',
  onPrimary: '#FFFFFF',
  gray50: '#FAFAFA',
  gray100: '#F5F5F5',
  gray200: '#EEEEEE',
  gray300: '#E0E0E0',
  gray400: '#BDBDBD',
  gray500: '#9E9E9E',
  gray600: '#757575',
  gray700: '#616161',
  gray800: '#424242',
  gray900: '#212121',
  text: '#212121',
  textSub: '#616161',
  textDisabled: '#9E9E9E',
  border: '#E0E0E0',
  borderSubtle: '#EEEEEE',
  bg: '#FFFFFF',
  surface: '#F5F5F5',
  error: '#D32F2F',
  errorTint: '#FDECEA',
  warning: '#F57C00',
  warningTint: '#FFF3E0',
  warningText: '#B45309',
  info: '#1976D2',
  infoTint: '#E3F2FD',
  /** 성공은 primary를 재사용한다. 별도의 성공용 초록을 만들지 않는다. */
  success: '#43A047',
} as const;

/** 4px 그리드. 이 값 외 간격 사용 금지 */
export const spacing = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64] as const;

export const radius = {
  sm: 4,
  /** 기본값 — 버튼(sm·md)·입력창·카드 */
  md: 8,
  /** 모달, lg 버튼 */
  lg: 12,
  /** 모바일 바텀시트 상단 */
  xl: 16,
  full: 9999,
} as const;

export const shadow = {
  subtle: '0 1px 3px rgba(0,0,0,0.06)',
  standard: '0 2px 8px rgba(0,0,0,0.10)',
  prominent: '0 8px 24px rgba(0,0,0,0.14)',
} as const;

export const typography = {
  fontFamily:
    "'Pretendard Variable', 'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
  letterSpacing: '-0.2px',
  /** Desktop / Mobile 이원 스케일 */
  scale: {
    display: { desktop: 32, mobile: 28, weight: 700 },
    title: { desktop: 24, mobile: 22, weight: 700 },
    section: { desktop: 20, mobile: 18, weight: 700 },
    cardTitle: { desktop: 17, mobile: 16, weight: 600 },
    bodyLg: { desktop: 16, mobile: 16, weight: 400, lineHeight: 1.6 },
    body: { desktop: 14, mobile: 14, weight: 400, lineHeight: 1.55 },
    caption: { desktop: 12, mobile: 12, weight: 400 },
  },
} as const;

/** 브레이크포인트는 하나 — 767px 이하 모바일, 768px 이상 데스크톱 (태블릿 분기 없음) */
export const breakpoints = { mobile: 767, desktop: 768 } as const;

/** 터치 대상 최소 44px. 컨트롤 높이 Desktop 40 / Mobile 48 */
export const control = { sm: 32, md: 40, lg: 48, minTouchTarget: 44 } as const;
