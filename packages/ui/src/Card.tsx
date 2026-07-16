import type { HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** 다른 내용 위에 떠 있는 패널에만 subtle 그림자 적용 */
  elevated?: boolean;
}

/** 보더가 기본, 그림자 없음. 패딩 D 20 / M 16 */
export function Card({ elevated = false, className, children, ...rest }: CardProps) {
  return (
    <div
      className={['vd-card', elevated && 'vd-card--elevated', className].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </div>
  );
}
