import { useState } from 'react';
import { Button, Modal, Tabs, Toast } from '@vendys/ui';
import { typography } from '@vendys/tokens';

export function TabsDemo() {
  const [tab, setTab] = useState('all');
  return (
    <Tabs
      items={[
        { value: 'all', label: '전체' },
        { value: 'wait', label: '정산 대기' },
        { value: 'done', label: '정산 완료' },
      ]}
      value={tab}
      onChange={setTab}
    />
  );
}

export function ModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        모달 열기
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="정산을 확정할까요?"
        actions={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              취소
            </Button>
            <Button onClick={() => setOpen(false)}>확정</Button>
          </>
        }
      >
        확정 후에는 되돌릴 수 없습니다.
      </Modal>
    </>
  );
}

export function LoadingDemo() {
  const [loading, setLoading] = useState(false);
  const run = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };
  return (
    <Button loading={loading} onClick={run}>
      {loading ? '저장 중' : '저장'}
    </Button>
  );
}

export function ToastDemo() {
  const [show, setShow] = useState(false);
  const fire = () => {
    setShow(true);
    setTimeout(() => setShow(false), 3000);
  };
  return (
    <>
      <Button variant="secondary" onClick={fire}>
        토스트 띄우기
      </Button>
      {show && (
        <div className="vd-toast-viewport">
          <Toast>저장되었습니다</Toast>
        </div>
      )}
    </>
  );
}

export function Swatch({ color, name, hex }: { color: string; name: string; hex: string }) {
  return (
    <div style={{ width: 150, border: '1px solid var(--vd-border-subtle)', borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ height: 44, background: color }} />
      <div style={{ padding: '8px 11px', fontSize: 12.5 }}>
        <b>{name}</b>
        <div style={{ color: 'var(--vd-text-sub)', fontFamily: 'monospace', fontSize: 11 }}>{hex}</div>
      </div>
    </div>
  );
}

const TYPE_ROLES = [
  { key: 'display', label: 'Display', usage: '랜딩 히어로, 핵심 수치' },
  { key: 'title', label: 'Title', usage: '페이지 제목' },
  { key: 'section', label: 'Section', usage: '섹션 제목' },
  { key: 'cardTitle', label: 'Card title', usage: '카드·모달 제목' },
  { key: 'bodyLg', label: 'Body large', usage: '리드 문단, 강조 본문' },
  { key: 'body', label: 'Body', usage: '기본 본문' },
  { key: 'caption', label: 'Caption', usage: '보조 설명, 라벨' },
] as const;

function TypeSample({ device, size, weight, lineHeight }: { device: string; size: number; weight: number; lineHeight: number }) {
  return (
    <div style={{ flex: 1, minWidth: 240 }}>
      <div style={{ fontSize: 11.5, color: 'var(--vd-text-sub)', marginBottom: 4 }}>
        {device} · {size}px
      </div>
      <div
        style={{
          fontFamily: typography.fontFamily,
          fontSize: size,
          fontWeight: weight,
          lineHeight,
          letterSpacing: typography.letterSpacing,
          color: 'var(--vd-text)',
        }}
      >
        맛있는 식사, 간편한 정산
      </div>
    </div>
  );
}

/** 토큰(@vendys/tokens)의 값을 그대로 렌더링하는 타이포그래피 견본 - 문서와 실제 값이 어긋나지 않는다 */
export function TypeScale() {
  return (
    <div>
      {TYPE_ROLES.map(({ key, label, usage }) => {
        const t = typography.scale[key];
        const lineHeight = 'lineHeight' in t ? t.lineHeight : 1.35;
        return (
          <div
            key={key}
            style={{
              display: 'flex',
              gap: 24,
              padding: '16px 0',
              borderBottom: '1px solid var(--vd-border-subtle)',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ width: 150, flexShrink: 0, fontSize: 12.5, color: 'var(--vd-text-sub)', lineHeight: 1.5 }}>
              <div style={{ color: 'var(--vd-text)', fontSize: 13.5, fontWeight: 600 }}>{label}</div>
              <div>굵기 {t.weight}</div>
              <div>{usage}</div>
            </div>
            <TypeSample device="Desktop" size={t.desktop} weight={t.weight} lineHeight={lineHeight} />
            <TypeSample device="Mobile" size={t.mobile} weight={t.weight} lineHeight={lineHeight} />
          </div>
        );
      })}
    </div>
  );
}
