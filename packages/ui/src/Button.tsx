import { forwardRef, type ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'fill' | 'weak' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** fill(기본) / weak(연한 배경) / secondary / ghost / danger */
  variant?: ButtonVariant;
  /** sm 32 / md 40 / lg 48 (모바일 주요 동작은 lg) */
  size?: ButtonSize;
  /** 비동기 동작 중. 스피너 표시 + 클릭 차단, 버튼 폭은 유지된다 */
  loading?: boolean;
}

/** 한 화면에 fill(primary) 버튼은 1개가 원칙 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'fill', size = 'md', loading = false, disabled, className, children, ...rest },
  ref,
) {
  const classes = [
    'vd-btn',
    `vd-btn--${variant}`,
    size !== 'md' && `vd-btn--${size}`,
    loading && 'vd-btn--loading',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      ref={ref}
      type="button"
      className={classes}
      disabled={disabled}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <span className="vd-btn__spinner" aria-hidden="true" />}
      {children}
    </button>
  );
});
