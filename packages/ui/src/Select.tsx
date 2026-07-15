import { useEffect, useId, useRef, useState } from 'react';
import { Icon } from './Icon';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectBaseProps {
  options: SelectOption[];
  /** 입력창 위 13px 라벨 */
  label?: string;
  /** 아래 12px 도움말 */
  help?: string;
  /** 오류 문구. 설정 시 오류 상태로 표시 */
  error?: string;
  placeholder?: string;
  /** 패널 상단에 옵션 검색 입력 표시 */
  searchable?: boolean;
  disabled?: boolean;
  className?: string;
}

export interface SelectSingleProps extends SelectBaseProps {
  multiple?: false;
  value?: string;
  onChange?: (value: string) => void;
}

export interface SelectMultipleProps extends SelectBaseProps {
  /** 체크박스 다중 선택. 선택해도 패널이 닫히지 않는다 */
  multiple: true;
  value?: string[];
  onChange?: (value: string[]) => void;
}

export type SelectProps = SelectSingleProps | SelectMultipleProps;

/**
 * 커스텀 셀렉트. 단일 선택 기본, multiple(다중)·searchable(검색) 옵션.
 * value를 넘기지 않으면 내부 상태로 동작한다(비제어)
 */
export function Select(props: SelectProps) {
  const { options, label, help, error, placeholder = '선택', searchable = false, disabled = false, className } = props;
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [internal, setInternal] = useState<string | string[]>(props.multiple ? [] : '');
  const rootRef = useRef<HTMLDivElement>(null);
  const autoId = useId();
  const helpText = error ?? help;

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

  const current = props.value !== undefined ? props.value : internal;
  const selectedValues = props.multiple ? ((current as string[]) ?? []) : current ? [current as string] : [];
  const selectedLabels = options.filter((o) => selectedValues.includes(o.value)).map((o) => o.label);

  const commit = (next: string | string[]) => {
    if (props.value === undefined) setInternal(next);
    if (props.multiple) props.onChange?.(next as string[]);
    else props.onChange?.(next as string);
  };

  const pick = (option: SelectOption) => {
    if (option.disabled) return;
    if (props.multiple) {
      const cur = selectedValues;
      commit(cur.includes(option.value) ? cur.filter((v) => v !== option.value) : [...cur, option.value]);
    } else {
      commit(option.value);
      setOpen(false);
    }
  };

  const visibleOptions =
    searchable && search ? options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase())) : options;

  return (
    <div className={['vd-field', className].filter(Boolean).join(' ')}>
      {label && (
        <label className="vd-field__label" htmlFor={autoId}>
          {label}
        </label>
      )}
      <div ref={rootRef} className="vd-select-wrap">
        <button
          type="button"
          id={autoId}
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-invalid={error ? true : undefined}
          disabled={disabled}
          className={[
            'vd-input',
            'vd-select-trigger',
            error && 'vd-input--error',
            open && 'vd-select-trigger--open',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={() => {
            setSearch('');
            setOpen((o) => !o);
          }}
        >
          <span
            className={['vd-select-trigger__value', selectedLabels.length === 0 && 'vd-select-trigger__value--empty']
              .filter(Boolean)
              .join(' ')}
          >
            {selectedLabels.length > 0 ? selectedLabels.join(', ') : placeholder}
          </span>
          <span className="vd-select-trigger__chevron" aria-hidden="true">
            <Icon name="chevron-down" size={16} />
          </span>
        </button>
        {open && (
          <div className="vd-select-panel" role="listbox" aria-multiselectable={props.multiple || undefined}>
            {searchable && (
              <input
                className="vd-input vd-select-panel__search"
                placeholder="검색"
                value={search}
                autoFocus
                onChange={(e) => setSearch(e.target.value)}
              />
            )}
            <div className="vd-select-panel__list">
              {visibleOptions.map((option) =>
                props.multiple ? (
                  <label
                    key={option.value}
                    className={['vd-check', 'vd-select-option', option.disabled && 'vd-check--disabled']
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <input
                      type="checkbox"
                      className="vd-check__input"
                      checked={selectedValues.includes(option.value)}
                      disabled={option.disabled}
                      onChange={() => pick(option)}
                    />
                    {option.label}
                  </label>
                ) : (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={selectedValues.includes(option.value)}
                    disabled={option.disabled}
                    className={[
                      'vd-select-option',
                      'vd-select-option--single',
                      selectedValues.includes(option.value) && 'vd-select-option--selected',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => pick(option)}
                  >
                    <span>{option.label}</span>
                    {selectedValues.includes(option.value) && <Icon name="check" size={16} />}
                  </button>
                ),
              )}
              {visibleOptions.length === 0 && <div className="vd-select-panel__empty">검색 결과 없음</div>}
            </div>
          </div>
        )}
      </div>
      {helpText && (
        <p className={['vd-field__help', error && 'vd-field__help--error'].filter(Boolean).join(' ')}>{helpText}</p>
      )}
    </div>
  );
}
