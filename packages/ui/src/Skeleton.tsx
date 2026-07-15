import type { HTMLAttributes } from 'react';

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  /** text(한 줄 텍스트 자리) / rect(블록) / circle(아바타 등 원형) */
  variant?: 'text' | 'rect' | 'circle';
  width?: number | string;
  height?: number | string;
}

/**
 * 로딩 자리 표시. 최종 레이아웃과 같은 크기로 배치해 로딩 후 화면이 튀지 않게 한다.
 * 스피너는 버튼 내부·영역 로딩에, 스켈레톤은 콘텐츠 형태를 미리 보여줄 때 쓴다
 */
export function Skeleton({ variant = 'text', width, height, className, style, ...rest }: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={['vd-skeleton', `vd-skeleton--${variant}`, className].filter(Boolean).join(' ')}
      style={{ width, height, ...style }}
      {...rest}
    />
  );
}
