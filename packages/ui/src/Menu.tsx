import { useEffect, useRef, useState, type ReactNode } from 'react';

export interface MenuItem {
  label: string;
  onSelect?: () => void;
  /** 삭제처럼 되돌릴 수 없는 동작이면 true - 빨간 글자로 표시 */
  danger?: boolean;
  disabled?: boolean;
}

export interface MenuProps {
  /** 메뉴를 여는 요소 (보통 Button 또는 Icon 버튼) */
  trigger: ReactNode;
  items: MenuItem[];
  /** 목록 정렬 기준 - 트리거의 왼쪽(start, 기본) / 오른쪽(end) */
  align?: 'start' | 'end';
}

/** 드롭다운 메뉴. 바깥 클릭·ESC로 닫히고, 항목 선택 시 자동으로 닫힌다 */
export function Menu({ trigger, items, align = 'start' }: MenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="vd-menu">
      <div
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        style={{ display: 'inline-flex' }}
      >
        {trigger}
      </div>
      {open && (
        <div role="menu" className={['vd-menu__list', align === 'end' && 'vd-menu__list--end'].filter(Boolean).join(' ')}>
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              disabled={item.disabled}
              className={['vd-menu__item', item.danger && 'vd-menu__item--danger'].filter(Boolean).join(' ')}
              onClick={() => {
                setOpen(false);
                item.onSelect?.();
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
