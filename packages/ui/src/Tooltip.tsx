import type { HTMLAttributes, ReactNode } from 'react';

export interface TooltipProps extends HTMLAttributes<HTMLSpanElement> {
  /** 말풍선 문구. 한 줄 보조 설명만 - 행동이 필요한 내용은 툴팁에 넣지 않는다 */
  label: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: ReactNode;
}

/** hover/focus 시 표시. 터치 환경에서는 노출이 제한적이므로 필수 정보는 본문에 쓴다 */
export function Tooltip({ label, position = 'top', className, children, ...rest }: TooltipProps) {
  return (
    <span className={['vd-tooltip', `vd-tooltip--${position}`, className].filter(Boolean).join(' ')} {...rest}>
      {children}
      <span role="tooltip" className="vd-tooltip__bubble">
        {label}
      </span>
    </span>
  );
}
