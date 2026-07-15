import { forwardRef, useId, useState, type ChangeEvent, type InputHTMLAttributes } from 'react';

export interface FileUploadProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** 입력창 위 라벨 */
  label?: string;
  /** 아래 도움말 (허용 형식·용량 안내 등) */
  help?: string;
  error?: string;
  /** 버튼 문구 */
  buttonText?: string;
}

/** 파일 선택 버튼 + 선택된 파일명 표시. 실제 업로드 처리는 onChange에서 한다 */
export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(function FileUpload(
  { label, help, error, buttonText = '파일 선택', id, onChange, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const helpText = error ?? help;
  const [names, setNames] = useState<string[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNames(Array.from(e.target.files ?? []).map((f) => f.name));
    onChange?.(e);
  };

  return (
    <div className="vd-field">
      {label && (
        <span className="vd-field__label" id={`${inputId}-label`}>
          {label}
        </span>
      )}
      <div className="vd-upload">
        <label className="vd-btn vd-btn--secondary vd-btn--sm" htmlFor={inputId}>
          {buttonText}
        </label>
        <input
          ref={ref}
          id={inputId}
          type="file"
          style={{ display: 'none' }}
          aria-labelledby={label ? `${inputId}-label` : undefined}
          onChange={handleChange}
          {...rest}
        />
        <span className="vd-upload__names">{names.length ? names.join(', ') : '선택된 파일 없음'}</span>
      </div>
      {helpText && (
        <p className={['vd-field__help', error && 'vd-field__help--error'].filter(Boolean).join(' ')}>{helpText}</p>
      )}
    </div>
  );
});
