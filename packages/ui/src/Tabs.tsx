import type { HTMLAttributes } from 'react';

export interface TabItem {
  value: string;
  label: string;
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
}

/** 활성 탭 = primary 굵은 글자 + 2px 언더라인. 모바일은 가로 스크롤 */
export function Tabs({ items, value, onChange, className, ...rest }: TabsProps) {
  return (
    <div role="tablist" className={['vd-tabs', className].filter(Boolean).join(' ')} {...rest}>
      {items.map((item) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={active}
            className={['vd-tab', active && 'vd-tab--active'].filter(Boolean).join(' ')}
            onClick={() => onChange(item.value)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
