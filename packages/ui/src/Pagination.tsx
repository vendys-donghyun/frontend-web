import { Icon } from './Icon';

export interface PaginationProps {
  /** 1부터 시작 */
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

/** 7페이지 초과 시 현재 페이지 주변만 표시하고 나머지는 줄임표 처리 */
function pageList(page: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const around = [page - 1, page, page + 1].filter((p) => p > 1 && p < total);
  const result: (number | 'ellipsis')[] = [1];
  if (around[0] !== undefined && around[0] > 2) result.push('ellipsis');
  result.push(...around);
  if (around[around.length - 1] !== undefined && around[around.length - 1] < total - 1) result.push('ellipsis');
  result.push(total);
  return result;
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  return (
    <nav className="vd-pagination" aria-label="페이지 이동">
      <button
        type="button"
        className="vd-pagination__btn"
        disabled={page <= 1}
        aria-label="이전 페이지"
        onClick={() => onChange(page - 1)}
      >
        <Icon name="chevron-left" size={16} />
      </button>
      {pageList(page, totalPages).map((p, i) =>
        p === 'ellipsis' ? (
          <span key={`e${i}`} className="vd-pagination__ellipsis" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            className={['vd-pagination__btn', p === page && 'vd-pagination__btn--active'].filter(Boolean).join(' ')}
            aria-current={p === page ? 'page' : undefined}
            onClick={() => onChange(p)}
          >
            {p}
          </button>
        ),
      )}
      <button
        type="button"
        className="vd-pagination__btn"
        disabled={page >= totalPages}
        aria-label="다음 페이지"
        onClick={() => onChange(page + 1)}
      >
        <Icon name="chevron-right" size={16} />
      </button>
    </nav>
  );
}
