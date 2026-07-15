import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

interface CheckBaseProps extends InputHTMLAttributes<HTMLInputElement> {
  /** 체크 요소 옆 라벨. 터치 영역은 라벨 포함 확보된다 */
  children?: ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckBaseProps>(function Checkbox(
  { children, disabled, className, ...rest },
  ref,
) {
  return (
    <label className={['vd-check', disabled && 'vd-check--disabled', className].filter(Boolean).join(' ')}>
      <input ref={ref} type="checkbox" className="vd-check__input" disabled={disabled} {...rest} />
      {children}
    </label>
  );
});

export const Radio = forwardRef<HTMLInputElement, CheckBaseProps>(function Radio(
  { children, disabled, className, ...rest },
  ref,
) {
  return (
    <label className={['vd-check', disabled && 'vd-check--disabled', className].filter(Boolean).join(' ')}>
      <input
        ref={ref}
        type="radio"
        className="vd-check__input vd-check__input--radio"
        disabled={disabled}
        {...rest}
      />
      {children}
    </label>
  );
});
