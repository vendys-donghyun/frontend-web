import React, { useState } from 'react';
import { Button, Modal, Tabs, Toast } from '@vendys/ui';

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
