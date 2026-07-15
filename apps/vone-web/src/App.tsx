import { version } from 'react';
import { Button, greeting } from '@vendys/ui';

export function App() {
  return (
    <main style={{ fontFamily: 'system-ui', padding: 32 }}>
      <h1>vone-web</h1>
      <p>실행 중인 React 버전: <strong>{version}</strong></p>
      <p>{greeting('vone-web')}</p>
      <Button>공유 UI 버튼 (@vendys/ui)</Button>
    </main>
  );
}
