import { forwardRef, useId, type InputHTMLAttributes, type SelectHTMLAttributes } from 'react';

interface FieldBaseProps {
  /** 입력창 위 13px 라벨. 플레이스홀더로 라벨을 대체하지 않는다 */
  label?: string;
  /** 아래 12px 도움말 */
  help?: string;
  /** 오류 문구 — 원인과 해결을 구체적으로. 설정 시 오류 상태로 표시 */
  error?: string;
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement>, FieldBaseProps {}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, help, error, className, id, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const helpText = error ?? help;
  const helpId = helpText ? `${inputId}-help` : undefined;

  return (
    <div className="vd-field">
      {label && (
        <label className="vd-field__label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={['vd-input', error && 'vd-input--error', className].filter(Boolean).join(' ')}
        aria-invalid={error ? true : undefined}
        aria-describedby={helpId}
        {...rest}
      />
      {helpText && (
        <p id={helpId} className={['vd-field__help', error && 'vd-field__help--error'].filter(Boolean).join(' ')}>
          {helpText}
        </p>
      )}
    </div>
  );
});

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement>, FieldBaseProps {}

/** 입력창과 같은 프레임의 셀렉트. 모바일에서는 네이티브 드롭다운이 뜬다 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, help, error, className, id, children, ...rest },
  ref,
) {
  const autoId = useId();
  const selectId = id ?? autoId;
  const helpText = error ?? help;
  const helpId = helpText ? `${selectId}-help` : undefined;

  return (
    <div className="vd-field">
      {label && (
        <label className="vd-field__label" htmlFor={selectId}>
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={['vd-input', 'vd-select', error && 'vd-input--error', className].filter(Boolean).join(' ')}
        aria-invalid={error ? true : undefined}
        aria-describedby={helpId}
        {...rest}
      >
        {children}
      </select>
      {helpText && (
        <p id={helpId} className={['vd-field__help', error && 'vd-field__help--error'].filter(Boolean).join(' ')}>
          {helpText}
        </p>
      )}
    </div>
  );
});
