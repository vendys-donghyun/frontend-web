import { version } from 'react';
import { Badge, Button, Card, Input } from '@vendys/ui';
import '@vendys/tokens/css';
import '@vendys/ui/styles.css';

export function App() {
  return (
    <main style={{ fontFamily: 'var(--vd-font)', padding: 32, display: 'grid', gap: 16, maxWidth: 480 }}>
      <h1>vone-web</h1>
      <p>
        실행 중인 React 버전: <strong>{version}</strong>
      </p>
      <Card>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
          <Badge tone="success">정산 완료</Badge>
          <Badge tone="warning">확인 필요</Badge>
        </div>
        <Input label="가맹점명" placeholder="입력해 주세요" />
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <Button variant="secondary">취소</Button>
          <Button>저장</Button>
        </div>
      </Card>
    </main>
  );
}
