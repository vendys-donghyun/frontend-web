import { forwardRef } from 'react';
import { Input, type InputProps } from './Input';

export type DatePickerProps = Omit<InputProps, 'type'>;

/**
 * 네이티브 input[type=date] 기반의 기본형.
 * 브라우저 달력 UI를 그대로 쓰므로 커스텀 달력이 필요해지면 이 API를 유지한 채 내부만 교체한다.
 */
export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(function DatePicker(props, ref) {
  return <Input ref={ref} type="date" {...props} />;
});
