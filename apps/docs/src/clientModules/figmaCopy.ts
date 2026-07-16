/**
 * 모든 데모 박스(.demo)에 "Figma로 복사" 버튼을 붙인다.
 * 데모 DOM을 SVG로 직렬화해 클립보드에 넣으면, Figma에서 붙여넣기 시
 * 편집 가능한 도형·텍스트 레이어로 들어간다.
 */

function makeButton(target: HTMLElement): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'demo-figma-btn';
  button.textContent = 'Figma로 복사';
  button.title = '복사 후 Figma에서 붙여넣기 (Cmd+V)';
  button.addEventListener('click', async () => {
    button.disabled = true;
    button.textContent = '변환 중';
    try {
      const { copyElementAsFigmaSvg } = await import('../lib/figmaSvg');
      await copyElementAsFigmaSvg(target);
      button.textContent = '복사됨';
    } catch {
      button.textContent = '복사 실패';
    }
    button.disabled = false;
    window.setTimeout(() => {
      button.textContent = 'Figma로 복사';
    }, 2500);
  });
  return button;
}

function attach() {
  for (const demo of document.querySelectorAll<HTMLElement>('.markdown .demo')) {
    if (demo.dataset.figmaCopy) continue;
    demo.dataset.figmaCopy = 'true';
    demo.appendChild(makeButton(demo));
  }
}

export function onRouteDidUpdate() {
  // MDX 렌더 직후 데모가 그려진 다음에 버튼을 붙인다
  window.setTimeout(attach, 0);
}
