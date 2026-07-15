import type { FormHTMLAttributes, HTMLAttributes } from 'react';

export type FormProps = FormHTMLAttributes<HTMLFormElement>;

/** 필드를 16px 간격 세로 스택으로 배치하는 폼 레이아웃. 기본 제출(새로고침)은 막는다 */
export function Form({ className, onSubmit, children, ...rest }: FormProps) {
  return (
    <form
      className={['vd-form', className].filter(Boolean).join(' ')}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.(e);
      }}
      {...rest}
    >
      {children}
    </form>
  );
}

/** 폼 하단 버튼 영역 - 우측 정렬(취소 왼쪽, 주요 동작 오른쪽), 모바일은 풀폭 세로 전환 */
export function FormActions({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={['vd-form__actions', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </div>
  );
}
