import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

export interface SwitchProps extends InputHTMLAttributes<HTMLInputElement> {
  /** 스위치 옆 라벨 */
  children?: ReactNode;
}

/** 즉시 적용되는 on/off 설정에 쓴다. 제출이 필요한 선택은 Checkbox */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { children, disabled, className, ...rest },
  ref,
) {
  return (
    <label className={['vd-switch', disabled && 'vd-switch--disabled', className].filter(Boolean).join(' ')}>
      <input ref={ref} type="checkbox" role="switch" className="vd-switch__input" disabled={disabled} {...rest} />
      <span className="vd-switch__track" aria-hidden="true">
        <span className="vd-switch__thumb" />
      </span>
      {children}
    </label>
  );
});
