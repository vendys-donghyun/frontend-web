/**
 * DOM 요소를 SVG로 직렬화해 클립보드에 복사한다.
 * Figma는 클립보드의 SVG 텍스트를 편집 가능한 레이어로 붙여넣는다.
 *
 * 정확도를 위해 원본 대신 전처리한 클론을 변환한다:
 * - input/textarea는 브라우저가 내부적으로 그려서 SVG 변환이 부정확 - 같은 스타일의 div+span으로 치환
 * - 데모의 복사 버튼·테스트 전용 UI([data-figma-exclude])는 결과물에서 제거
 */
export async function copyElementAsFigmaSvg(target: HTMLElement): Promise<void> {
  const { elementToSVG, inlineResources } = await import('dom-to-svg');

  const clone = target.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('.demo-figma-btn, [data-figma-exclude]').forEach((el) => el.remove());

  const originals = Array.from(target.querySelectorAll<HTMLInputElement>('input, textarea'));
  const cloned = Array.from(clone.querySelectorAll<HTMLElement>('input, textarea'));
  originals.forEach((source, index) => {
    const cloneEl = cloned[index];
    if (!cloneEl) return;
    const type = source.type;
    if (type === 'checkbox' || type === 'radio' || type === 'file') return; // 도형 기반은 그대로 둔다

    const cs = getComputedStyle(source);
    const box = document.createElement('div');
    for (const prop of Array.from(cs)) box.style.setProperty(prop, cs.getPropertyValue(prop));
    box.style.display = 'flex';
    box.style.alignItems = 'center';
    box.style.overflow = 'hidden';

    const value = source.value;
    const placeholder = source.getAttribute('placeholder') ?? '';
    if (value || placeholder) {
      const text = document.createElement('span');
      text.textContent = value || placeholder;
      text.style.whiteSpace = 'nowrap';
      if (!value) text.style.color = '#9e9e9e';
      box.appendChild(text);
    }
    cloneEl.replaceWith(box);
  });

  // 화면 밖에 실제로 붙여 레이아웃 좌표를 잡는다 (변환기는 실제 렌더 좌표를 쓴다)
  const host = document.createElement('div');
  host.style.position = 'absolute';
  host.style.left = '-100000px';
  host.style.top = '0';
  host.style.width = `${target.getBoundingClientRect().width}px`;
  host.appendChild(clone);
  document.body.appendChild(host);
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

  try {
    const svgDocument = elementToSVG(clone);
    await inlineResources(svgDocument.documentElement);
    const svgText = new XMLSerializer().serializeToString(svgDocument);
    await navigator.clipboard.writeText(svgText);
  } finally {
    host.remove();
  }
}
