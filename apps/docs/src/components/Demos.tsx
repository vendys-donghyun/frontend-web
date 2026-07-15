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

const SPACE_STEPS = [
  { token: '--vd-space-1', px: 4, usage: '아이콘-텍스트 사이' },
  { token: '--vd-space-2', px: 8, usage: '밀접한 요소 사이' },
  { token: '--vd-space-3', px: 12, usage: '폼 필드 내부' },
  { token: '--vd-space-4', px: 16, usage: '필드 사이, 모바일 카드 패딩' },
  { token: '--vd-space-5', px: 20, usage: '데스크톱 카드 패딩' },
  { token: '--vd-space-6', px: 24, usage: '섹션 내 블록 사이' },
  { token: '--vd-space-8', px: 32, usage: '섹션 사이' },
  { token: '--vd-space-10', px: 40, usage: '큰 블록 사이' },
  { token: '--vd-space-12', px: 48, usage: '페이지 상하 여백' },
  { token: '--vd-space-16', px: 64, usage: '큰 섹션 구분' },
];

/** 간격 토큰을 실제 폭의 막대로 렌더링 */
export function SpacingScale() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
      {SPACE_STEPS.map(({ token, px, usage }) => (
        <div key={token} style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <code style={{ width: 130, flexShrink: 0, fontSize: 12 }}>{token}</code>
          <span style={{ width: 40, flexShrink: 0, fontSize: 12.5, color: 'var(--vd-text-sub)', textAlign: 'right' }}>
            {px}px
          </span>
          <span
            style={{ width: px, height: 16, flexShrink: 0, background: 'var(--vd-primary)', borderRadius: 2 }}
            aria-hidden="true"
          />
          <span style={{ fontSize: 12.5, color: 'var(--vd-text-sub)' }}>{usage}</span>
        </div>
      ))}
    </div>
  );
}

const RADIUS_STEPS = [
  { name: 'sm', px: '4px', usage: '배지, 체크박스' },
  { name: 'md', px: '8px', usage: '버튼(32·40), 인풋, 카드 기본' },
  { name: 'lg', px: '12px', usage: '큰 버튼(48), 모달' },
  { name: 'xl', px: '16px', usage: '바텀시트 상단' },
  { name: 'full', px: '9999px', usage: '필형 요소' },
];

/** radius 토큰을 실제 모서리가 적용된 사각형으로 렌더링 */
export function RadiusScale() {
  return (
    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
      {RADIUS_STEPS.map(({ name, px, usage }) => (
        <div key={name} style={{ width: 130, textAlign: 'center' }}>
          <div
            style={{
              height: 64,
              background: 'var(--vd-primary-tint)',
              border: '2px solid var(--vd-primary)',
              borderRadius: `var(--vd-radius-${name})`,
            }}
            aria-hidden="true"
          />
          <div style={{ marginTop: 8, fontSize: 13, fontWeight: 600 }}>
            {name} · {px}
          </div>
          <div style={{ fontSize: 12, color: 'var(--vd-text-sub)', lineHeight: 1.45 }}>{usage}</div>
        </div>
      ))}
    </div>
  );
}

const SHADOW_STEPS = [
  { name: 'subtle', usage: '떠 있는 카드' },
  { name: 'standard', usage: '드롭다운, 팝오버' },
  { name: 'prominent', usage: '모달' },
];

/** 그림자 토큰을 실제 그림자가 적용된 카드로 렌더링 */
export function ShadowScale() {
  return (
    <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', padding: '8px 4px' }}>
      {SHADOW_STEPS.map(({ name, usage }) => (
        <div
          key={name}
          style={{
            width: 170,
            padding: '24px 16px',
            background: '#fff',
            borderRadius: 'var(--vd-radius-md)',
            boxShadow: `var(--vd-shadow-${name})`,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600 }}>{name}</div>
          <div style={{ fontSize: 12, color: 'var(--vd-text-sub)' }}>{usage}</div>
        </div>
      ))}
    </div>
  );
}

/** 컨트롤 높이 3단을 실제 버튼으로 렌더링 */
export function ControlScale() {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
      <Button size="sm">sm · 32px</Button>
      <Button size="md">md · 40px</Button>
      <Button size="lg">lg · 48px</Button>
    </div>
  );
}
