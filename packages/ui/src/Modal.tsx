import { useEffect, useRef, type ReactNode, type MouseEvent } from 'react';

export interface ModalProps {
  open: boolean;
  /** 닫기 요청 (배경 클릭, ESC). 확정 동작은 actions의 버튼으로 */
  onClose: () => void;
  title: string;
  children?: ReactNode;
  /** 우측 정렬 버튼들 (취소 왼쪽, 주요 동작 오른쪽). 모바일에선 풀폭 세로로 전환된다 */
  actions?: ReactNode;
}

/** 데스크톱: 중앙 모달(max 480, radius 12) / 모바일(767px 이하): 바텀시트로 자동 전환 */
export function Modal({ open, onClose, title, children, actions }: ModalProps) {
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
    <div ref={backdropRef} className="vd-modal-backdrop" onClick={onBackdropClick}>
      <div role="dialog" aria-modal="true" aria-label={title} className="vd-modal">
        <div className="vd-modal__grip" aria-hidden="true" />
        <h2 className="vd-modal__title">{title}</h2>
        <div className="vd-modal__body">{children}</div>
        {actions && <div className="vd-modal__actions">{actions}</div>}
      </div>
    </div>
  );
}
