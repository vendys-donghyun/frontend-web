import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react';
import { Icon } from './Icon';

export interface DrawerProps {
  open: boolean;
  /** 닫기 요청 (배경 클릭, ESC, 닫기 버튼) */
  onClose: () => void;
  title: string;
  children?: ReactNode;
  /** 열리는 방향. 기본 오른쪽 */
  position?: 'left' | 'right';
  /** 패널 폭(px). 기본 400. 모바일에서는 화면의 85%까지로 제한된다 */
  width?: number;
  /** 하단 고정 버튼 영역 (취소 왼쪽, 주요 동작 오른쪽) */
  actions?: ReactNode;
}

/**
 * 측면 패널. 목록 화면을 벗어나지 않고 상세·필터를 보여줄 때 쓴다.
 * 확정이 필요한 짧은 결정("정산을 확정할까요?")은 Drawer가 아니라 Modal
 */
export function Drawer({ open, onClose, title, children, position = 'right', width = 400, actions }: DrawerProps) {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const onBackdropClick = (e: MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  return (
    <div ref={backdropRef} className="vd-drawer-backdrop" onClick={onBackdropClick}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={['vd-drawer', `vd-drawer--${position}`].join(' ')}
        style={{ width }}
      >
        <div className="vd-drawer__header">
          <h2 className="vd-drawer__title">{title}</h2>
          <button type="button" className="vd-drawer__close" aria-label="닫기" onClick={onClose}>
            <Icon name="close" size={18} />
          </button>
        </div>
        <div className="vd-drawer__body">{children}</div>
        {actions && <div className="vd-drawer__actions">{actions}</div>}
      </div>
    </div>
  );
}
