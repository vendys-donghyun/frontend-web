import { useState, type ReactNode } from 'react';
import { Icon } from './Icon';

export interface AccordionItem {
  title: string;
  content: ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** 처음부터 열어둘 항목 인덱스 */
  defaultOpen?: number[];
}

/** 여러 항목을 동시에 열 수 있는 아코디언. FAQ, 상세 설명 접기에 쓴다 */
export function Accordion({ items, defaultOpen = [] }: AccordionProps) {
  const [open, setOpen] = useState<number[]>(defaultOpen);

  const toggle = (index: number) =>
    setOpen((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));

  return (
    <div className="vd-accordion">
      {items.map((item, index) => {
        const expanded = open.includes(index);
        return (
          <div key={item.title} className="vd-accordion__item">
            <button
              type="button"
              className="vd-accordion__header"
              aria-expanded={expanded}
              onClick={() => toggle(index)}
            >
              {item.title}
              <span className="vd-accordion__chevron">
                <Icon name="chevron-down" size={18} />
              </span>
            </button>
            {expanded && <div className="vd-accordion__panel">{item.content}</div>}
          </div>
        );
      })}
    </div>
  );
}
