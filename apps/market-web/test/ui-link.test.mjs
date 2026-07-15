import { test } from 'node:test';
import assert from 'node:assert';
import { colors, radius } from '@vendys/tokens';

// 공유 패키지가 워크스페이스 링크로 실제 연결됐는지 검증
test('design tokens are linked', () => {
  assert.strictEqual(colors.primary, '#43A047');
  assert.strictEqual(radius.md, 8);
  // 성공 색은 primary 재사용 규칙
  assert.strictEqual(colors.success, colors.primary);
});
