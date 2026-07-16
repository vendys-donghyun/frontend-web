import type { HTMLAttributes } from 'react';

export type BadgeTone = 'success' | 'neutral' | 'warning' | 'error';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** 성공(초록) / 중립(회색) / 주의(주황) / 실패(빨강) - weak 톤이 기본형 */
  tone?: BadgeTone;
}

/** 상태·분류 표시용. 행동(버튼) 용도로 쓰지 않는다 */
export function Badge({ tone = 'neutral', className, children, ...rest }: BadgeProps) {
  return (
    <span className={['vd-badge', `vd-badge--${tone}`, className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </span>
  );
}
