import type { SVGAttributes } from 'react';

/** 로고 전용 브랜드 그린. UI 요소에는 쓰지 않는다 (UI 초록은 --vd-primary) */
const BRAND_GREEN = '#1DB53A';

export interface LogoProps extends Omit<SVGAttributes<SVGSVGElement>, 'color'> {
  /** 심볼 높이(px). 너비는 4:3 비율로 자동. 최소 16 권장 */
  size?: number;
  /** 어두운 배경 위 흰색 반전 용도로만 사용 */
  color?: string;
  /** true면 심볼 옆에 워드마크(현대벤디스)를 함께 표시 */
  wordmark?: boolean;
}

/**
 * 현대벤디스 심볼 로고.
 * 왜곡·회전·그림자·임의 색 변경 금지 - color는 어두운 배경에서 흰색 반전 용도로만 쓴다.
 */
export function Logo({ size = 24, color = BRAND_GREEN, wordmark = false, ...rest }: LogoProps) {
  const symbol = (
    <svg
      width={(size * 40) / 30}
      height={size}
      viewBox="0 0 40 30"
      fill="none"
      role="img"
      aria-label="현대벤디스"
      {...rest}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.84903 7.22068L20.3032 5.2852V10.0491L35.151 8.3381V22.3329L19.9252 24.0452L24.0916 18.8336L4.84903 21.2155V7.22068ZM25.151 -0.00512695L0 2.9781V26.5007L14.5458 24.7897L10.3794 30L40 26.5007V2.9781L25.151 4.7639V-0.00512695Z"
        fill={color}
      />
    </svg>
  );

  if (!wordmark) return symbol;
  return (
    <span className="vd-logo" style={{ gap: Math.round(size * 0.3) }}>
      {symbol}
      <span className="vd-logo__wordmark" style={{ fontSize: Math.round(size * 0.62) }}>
        현대벤디스
      </span>
    </span>
  );
}
