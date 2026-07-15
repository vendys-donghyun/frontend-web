import type { HTMLAttributes } from 'react';

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  /** sm 16 / md 24(기본) / lg 32 */
  size?: 'sm' | 'md' | 'lg';
}

/** 단독 로딩 표시. 버튼 내부 로딩은 Button의 loading prop을 쓴다 */
export function Spinner({ size = 'md', className, ...rest }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="로딩 중"
      className={['vd-spinner', size !== 'md' && `vd-spinner--${size}`, className].filter(Boolean).join(' ')}
      {...rest}
    />
  );
}
