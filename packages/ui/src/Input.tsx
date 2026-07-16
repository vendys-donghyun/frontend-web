import { forwardRef, useId, type InputHTMLAttributes } from 'react';

interface FieldBaseProps {
  /** 입력창 위 13px 라벨. 플레이스홀더로 라벨을 대체하지 않는다 */
  label?: string;
  /** 아래 12px 도움말 */
  help?: string;
  /** 오류 문구 - 원인과 해결을 구체적으로. 설정 시 오류 상태로 표시 */
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
