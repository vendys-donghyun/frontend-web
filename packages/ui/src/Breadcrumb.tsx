import type { ReactNode } from 'react';
import { Icon } from './Icon';

export interface BreadcrumbItem {
  label: ReactNode;
  /** 링크 이동. onClick과 둘 중 하나만 쓴다 */
  href?: string;
  /** 라우터 이동 등 커스텀 처리 */
  onClick?: () => void;
}

export interface BreadcrumbProps {
  /** 마지막 항목이 현재 위치. 현재 위치에는 href/onClick을 주지 않는다 */
  items: BreadcrumbItem[];
}

/** 현재 위치 경로 표시. 항목이 4개를 넘으면 정보 구조를 줄이는 것부터 검토한다 */
export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="현재 위치">
      <ol className="vd-breadcrumb">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="vd-breadcrumb__item" aria-current={isLast ? 'page' : undefined}>
              {isLast || (!item.href && !item.onClick) ? (
                <span className={isLast ? 'vd-breadcrumb__current' : 'vd-breadcrumb__text'}>{item.label}</span>
              ) : item.href ? (
                <a className="vd-breadcrumb__link" href={item.href}>
                  {item.label}
                </a>
              ) : (
                <button type="button" className="vd-breadcrumb__link" onClick={item.onClick}>
                  {item.label}
                </button>
              )}
              {!isLast && (
                <span className="vd-breadcrumb__sep" aria-hidden="true">
                  <Icon name="chevron-right" size={14} />
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
