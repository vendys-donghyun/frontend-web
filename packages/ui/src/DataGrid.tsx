import { useEffect, useMemo, useState, type MouseEvent as ReactMouseEvent, type ReactNode } from 'react';
import { Icon } from './Icon';
import { Spinner } from './Spinner';

/**
 * vone-web의 ag-Grid(ClientSideTable) 사용 패턴을 참고한 조회형 클라이언트 그리드.
 * 인라인 편집·셋필터·서버사이드 로우 모델·붙여넣기가 필요한 화면은 이 컴포넌트 대상이 아니다(ag-Grid 유지).
 */

export interface DataGridColumn<T> {
  field: string;
  headerName: string;
  /** px 고정폭. 지정하지 않으면 남은 폭을 균등 분배. pinned 컬럼은 고정폭 필수 */
  width?: number;
  /** number는 콤마+우측정렬+tabular-nums, date/datetime은 포맷 적용. null/빈값은 '-' */
  type?: 'text' | 'number' | 'date' | 'datetime';
  align?: 'left' | 'center' | 'right';
  /** 기본 true. 헤더 클릭으로 오름/내림/해제 순환 */
  sortable?: boolean;
  /** 좌/우 고정. 가로 스크롤(minWidth)이 있을 때 의미가 있다. width 미지정 시 120px로 간주 */
  pinned?: 'left' | 'right';
  /** 셀 커스텀 렌더링 (상태 배지, 링크, 액션 버튼 등) */
  render?: (value: unknown, row: T) => ReactNode;
  /** 표시·정렬에 쓸 값을 행에서 직접 계산 (기본은 row[field]) */
  valueGetter?: (row: T) => unknown;
}

export type DataGridSort = { field: string; direction: 'asc' | 'desc' } | null;

export interface DataGridProps<T> {
  columns: DataGridColumn<T>[];
  rows: T[];
  /** 행 식별자 - 선택 상태의 키로 쓴다 */
  rowKey: (row: T) => string | number;
  /** multi: 헤더 전체 선택 포함 체크박스 열 추가 */
  selectable?: 'single' | 'multi';
  selectedKeys?: (string | number)[];
  onSelectionChange?: (keys: (string | number)[], rows: T[]) => void;
  onRowClick?: (row: T) => void;
  onSortChange?: (sort: DataGridSort) => void;
  loading?: boolean;
  emptyMessage?: string;
  /** standard 행 48(기본) / compact 행 36 - 어드민 밀도 */
  density?: 'standard' | 'compact';
  /** 컨테이너 높이. 넘치면 헤더 고정 세로 스크롤 */
  height?: number | string;
  /** 표 최소 폭(px). 컨테이너보다 크면 가로 스크롤 - pinned 컬럼과 함께 쓴다 */
  minWidth?: number;
  /** 셀 우클릭 복사 메뉴(셀 값/행). 기본 true. 붙여넣기는 지원하지 않는다(편집 영역) */
  enableCopy?: boolean;
}

const PINNED_DEFAULT_WIDTH = 120;

function formatValue(value: unknown, type: DataGridColumn<never>['type']): string {
  if (value === null || value === undefined || value === '') return '-';
  if (type === 'number') {
    const n = Number(value);
    return Number.isNaN(n) ? String(value) : n.toLocaleString('ko-KR');
  }
  if (type === 'date' || type === 'datetime') {
    const d = value instanceof Date ? value : new Date(String(value));
    if (Number.isNaN(d.getTime())) return String(value);
    const pad = (n: number) => String(n).padStart(2, '0');
    const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    return type === 'datetime' ? `${date} ${pad(d.getHours())}:${pad(d.getMinutes())}` : date;
  }
  return String(value);
}

function compareValues(a: unknown, b: unknown, type: DataGridColumn<never>['type']): number {
  if (a === null || a === undefined || a === '') return 1;
  if (b === null || b === undefined || b === '') return -1;
  if (type === 'number') return Number(a) - Number(b);
  if (type === 'date' || type === 'datetime') {
    return new Date(String(a)).getTime() - new Date(String(b)).getTime();
  }
  return String(a).localeCompare(String(b), 'ko');
}

export function DataGrid<T>({
  columns,
  rows,
  rowKey,
  selectable,
  selectedKeys,
  onSelectionChange,
  onRowClick,
  onSortChange,
  loading = false,
  emptyMessage = '조회된 데이터가 없습니다',
  density = 'standard',
  height,
  minWidth,
  enableCopy = true,
}: DataGridProps<T>) {
  const [sort, setSort] = useState<DataGridSort>(null);
  const [internalSelected, setInternalSelected] = useState<(string | number)[]>([]);
  const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number; cell: string; row: string } | null>(null);
  const selected = selectedKeys ?? internalSelected;

  const getValue = (col: DataGridColumn<T>, row: T) =>
    col.valueGetter ? col.valueGetter(row) : (row as Record<string, unknown>)[col.field];

  const sortedRows = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.field === sort.field);
    if (!col) return rows;
    const dir = sort.direction === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => dir * compareValues(getValue(col, a), getValue(col, b), col.type));
  }, [rows, sort, columns]);

  // 우클릭 복사 메뉴 - 바깥 클릭·ESC·스크롤에 닫힘
  useEffect(() => {
    if (!ctxMenu) return;
    const close = () => setCtxMenu(null);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('scroll', close, true);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('scroll', close, true);
      document.removeEventListener('keydown', onKey);
    };
  }, [ctxMenu]);

  const cycleSort = (col: DataGridColumn<T>) => {
    if (col.sortable === false) return;
    const next: DataGridSort =
      sort?.field !== col.field
        ? { field: col.field, direction: 'asc' }
        : sort.direction === 'asc'
          ? { field: col.field, direction: 'desc' }
          : null;
    setSort(next);
    onSortChange?.(next);
  };

  const updateSelection = (keys: (string | number)[]) => {
    if (selectedKeys === undefined) setInternalSelected(keys);
    onSelectionChange?.(
      keys,
      rows.filter((r) => keys.includes(rowKey(r))),
    );
  };

  const toggleRow = (key: string | number) => {
    if (selectable === 'single') {
      updateSelection(selected.includes(key) ? [] : [key]);
      return;
    }
    updateSelection(selected.includes(key) ? selected.filter((k) => k !== key) : [...selected, key]);
  };

  const openCopyMenu = (e: ReactMouseEvent, col: DataGridColumn<T>, row: T) => {
    if (!enableCopy) return;
    e.preventDefault();
    setCtxMenu({
      x: e.clientX,
      y: e.clientY,
      cell: formatValue(getValue(col, row), col.type),
      row: columns.map((c) => formatValue(getValue(c, row), c.type)).join('\t'),
    });
  };

  const copyText = (text: string) => {
    void navigator.clipboard?.writeText(text);
    setCtxMenu(null);
  };

  // 컬럼 고정 오프셋 - selection 열은 항상 맨 왼쪽 고정
  const colWidth = (c: DataGridColumn<T>) => c.width ?? PINNED_DEFAULT_WIDTH;
  const leftPinned = columns.filter((c) => c.pinned === 'left');
  const rightPinned = columns.filter((c) => c.pinned === 'right');
  const anyPinned = leftPinned.length > 0 || rightPinned.length > 0;
  const leftOffsets = new Map<string, number>();
  let leftAcc = selectable && anyPinned ? 40 : 0;
  for (const c of leftPinned) {
    leftOffsets.set(c.field, leftAcc);
    leftAcc += colWidth(c);
  }
  const rightOffsets = new Map<string, number>();
  let rightAcc = 0;
  for (const c of [...rightPinned].reverse()) {
    rightOffsets.set(c.field, rightAcc);
    rightAcc += colWidth(c);
  }
  const leftEdgeField = leftPinned[leftPinned.length - 1]?.field;
  const rightEdgeField = rightPinned[0]?.field;
  const checkColPinned = Boolean(selectable && anyPinned);

  const pinnedCell = (col: DataGridColumn<T>): { classes: string[]; style?: { left?: number; right?: number } } => {
    if (col.pinned === 'left') {
      return {
        classes: ['vd-grid__cell--pinned', col.field === leftEdgeField ? 'vd-grid__cell--pinned-left-edge' : ''],
        style: { left: leftOffsets.get(col.field) },
      };
    }
    if (col.pinned === 'right') {
      return {
        classes: ['vd-grid__cell--pinned', col.field === rightEdgeField ? 'vd-grid__cell--pinned-right-edge' : ''],
        style: { right: rightOffsets.get(col.field) },
      };
    }
    return { classes: [] };
  };

  const allKeys = sortedRows.map(rowKey);
  const allChecked = allKeys.length > 0 && allKeys.every((k) => selected.includes(k));
  const someChecked = allKeys.some((k) => selected.includes(k));

  const gridClass = ['vd-grid', density === 'compact' && 'vd-grid--compact'].filter(Boolean).join(' ');
  const checkCellClass = [
    checkColPinned && 'vd-grid__cell--pinned',
    checkColPinned && leftPinned.length === 0 && 'vd-grid__cell--pinned-left-edge',
  ]
    .filter(Boolean)
    .join(' ');
  const checkCellStyle = checkColPinned ? { left: 0 } : undefined;

  return (
    <div className={gridClass} style={{ height }}>
      <div className="vd-grid__scroll">
        <table className="vd-grid__table" style={minWidth ? { minWidth } : undefined}>
          <colgroup>
            {selectable && <col style={{ width: 40 }} />}
            {columns.map((col) => (
              <col key={col.field} style={col.width ? { width: col.width } : undefined} />
            ))}
          </colgroup>
          <thead>
            <tr>
              {selectable && (
                <th className={['vd-grid__th', 'vd-grid__th--check', checkCellClass].filter(Boolean).join(' ')} style={checkCellStyle}>
                  {selectable === 'multi' && (
                    <input
                      type="checkbox"
                      className="vd-check__input"
                      aria-label="전체 선택"
                      checked={allChecked}
                      ref={(el) => {
                        if (el) el.indeterminate = !allChecked && someChecked;
                      }}
                      onChange={() => updateSelection(allChecked ? [] : allKeys)}
                    />
                  )}
                </th>
              )}
              {columns.map((col) => {
                const active = sort?.field === col.field;
                const sortable = col.sortable !== false;
                const align = col.align ?? (col.type === 'number' ? 'right' : 'left');
                const pin = pinnedCell(col);
                return (
                  <th
                    key={col.field}
                    className={[
                      'vd-grid__th',
                      sortable && 'vd-grid__th--sortable',
                      `vd-grid__cell--${align}`,
                      ...pin.classes,
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    style={pin.style}
                    aria-sort={active ? (sort!.direction === 'asc' ? 'ascending' : 'descending') : undefined}
                    onClick={() => cycleSort(col)}
                  >
                    <span className="vd-grid__th-inner">
                      {col.headerName}
                      {active && <Icon name={sort!.direction === 'asc' ? 'chevron-up' : 'chevron-down'} size={14} />}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row) => {
              const key = rowKey(row);
              const isSelected = selected.includes(key);
              return (
                <tr
                  key={key}
                  className={[isSelected && 'vd-grid__row--selected', onRowClick && 'vd-grid__row--clickable']
                    .filter(Boolean)
                    .join(' ')}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {selectable && (
                    <td
                      className={['vd-grid__td', 'vd-grid__td--check', checkCellClass].filter(Boolean).join(' ')}
                      style={checkCellStyle}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        className="vd-check__input"
                        aria-label="행 선택"
                        checked={isSelected}
                        onChange={() => toggleRow(key)}
                      />
                    </td>
                  )}
                  {columns.map((col) => {
                    const value = getValue(col, row);
                    const align = col.align ?? (col.type === 'number' ? 'right' : 'left');
                    const pin = pinnedCell(col);
                    return (
                      <td
                        key={col.field}
                        className={[
                          'vd-grid__td',
                          `vd-grid__cell--${align}`,
                          col.type === 'number' && 'vd-grid__td--num',
                          ...pin.classes,
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        style={pin.style}
                        onContextMenu={(e) => openCopyMenu(e, col, row)}
                      >
                        {col.render ? col.render(value, row) : formatValue(value, col.type)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        {!loading && sortedRows.length === 0 && <div className="vd-grid__empty">{emptyMessage}</div>}
      </div>
      {loading && (
        <div className="vd-grid__overlay">
          <Spinner />
        </div>
      )}
      {ctxMenu && (
        <div
          role="menu"
          className="vd-menu__list vd-grid__ctx"
          style={{ top: ctxMenu.y, left: ctxMenu.x }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <button type="button" role="menuitem" className="vd-menu__item" onClick={() => copyText(ctxMenu.cell)}>
            셀 값 복사
          </button>
          <button type="button" role="menuitem" className="vd-menu__item" onClick={() => copyText(ctxMenu.row)}>
            행 복사 (탭 구분)
          </button>
        </div>
      )}
    </div>
  );
}
