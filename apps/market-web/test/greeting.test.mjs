import { test } from 'node:test';
import assert from 'node:assert';
import { greeting } from '@vendys/ui';

// 공유 패키지(@vendys/ui)가 워크스페이스 링크로 실제 연결됐는지 검증
test('shared ui greeting works', () => {
  assert.strictEqual(greeting('market-web'), 'Hello from @vendys/ui, market-web!');
});
