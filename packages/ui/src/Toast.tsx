import type { HTMLAttributes } from 'react';

export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  /** success(초록 점) / error(빨간 점) */
  tone?: 'success' | 'error';
}

/**
 * 토스트 표시체. 문구는 과거형 한 문장("저장되었습니다").
 * 하단 중앙 고정이 필요하면 vd-toast-viewport 컨테이너 안에 렌더링하고 3초 뒤 제거한다.
 */
export function Toast({ tone = 'success', className, children, ...rest }: ToastProps) {
  return (
    <div
      role="status"
      className={['vd-toast', tone === 'error' && 'vd-toast--error', className].filter(Boolean).join(' ')}
      {...rest}
    >
      <span className="vd-toast__dot" aria-hidden="true" />
      {children}
    </div>
  );
}
