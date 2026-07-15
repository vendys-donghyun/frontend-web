import { useState } from 'react';
import { Icon } from '@vendys/ui';
// @ts-expect-error raw-loader 인라인 로더 - packages/tokens/DESIGN.md 원본을 빌드 시 문자열로 가져온다 (사본 없음)
import designMd from '!!raw-loader!../../../../packages/tokens/DESIGN.md';

const content: string = designMd;

/** OmD 방식의 AI 프롬프트 제공 - 전체 복사 버튼 + 원문 미리보기 */
export function AiPrompt() {
  const [copied, setCopied] = useState(false);

  const copyAll = () => {
    void navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
          marginBottom: 12,
        }}
      >
        <span style={{ fontSize: 13, color: 'var(--ifm-color-emphasis-600)' }}>
          packages/tokens/DESIGN.md · {content.split('\n').length.toLocaleString()}줄 ·{' '}
          {content.length.toLocaleString()}자
        </span>
        <button
          type="button"
          className={['ai-prompt__copy', copied && 'ai-prompt__copy--done'].filter(Boolean).join(' ')}
          aria-label="전체 복사"
          title="전체 복사"
          onClick={copyAll}
        >
          <Icon name={copied ? 'check' : 'copy'} size={16} />
          {copied && <span>복사됨</span>}
        </button>
      </div>
      <pre className="ai-prompt__pre">{content}</pre>
    </div>
  );
}
