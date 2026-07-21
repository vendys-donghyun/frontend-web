/**
 * DOM 요소를 SVG로 직렬화해 클립보드에 복사한다.
 * Figma는 클립보드의 SVG 텍스트를 편집 가능한 레이어로 붙여넣는다.
 *
 * 정확도를 위해 원본 대신 전처리한 클론을 변환한다. 변환기가 못 읽는 것들을 보정한다:
 * - 클론을 DOM에 붙이면 등장 애니메이션이 재시작돼 opacity 0 시점에 캡처된다(토스트 증발) - 전부 끈다
 * - checked 같은 폼 상태는 cloneNode로 복제되지 않는다 - 원본에서 다시 심는다 (스위치 색 유실 방지)
 * - 그림자만으로 경계를 만드는 패널(모달·드로어)은 SVG에서 그림자가 빠져 윤곽이 사라진다 - 얇은 테두리를 넣는다
 * - button: 라벨이 엉뚱한 위치로 간다 - 같은 스타일의 div로 치환하고 내용물을 옮긴다
 * - checkbox/radio: 기본 value "on"이 텍스트로 샌다 - 박스를 도형으로 그리고 체크·점을 직접 넣는다
 * - 스피너: border 회전 트릭이라 호가 안 그려진다 - SVG 원호로 치환
 * - 텍스트 y 좌표: 변환기는 dominant-baseline="text-after-edge"로 좌표를 잡는데 Figma는 이 속성을
 *   무시하고 y를 베이스라인으로 해석한다(라벨이 아래로 밀림) - 베이스라인 기준 좌표로 재계산
 * - 데모의 복사 버튼·테스트 전용 UI([data-figma-exclude])는 결과물에서 제거
 */

const SVG_NS = 'http://www.w3.org/2000/svg';

/** 원본 요소의 computed style 전체를 복사한 div를 만든다 */
function cloneStyledBox(source: Element): HTMLDivElement {
  const cs = getComputedStyle(source);
  const box = document.createElement('div');
  for (const prop of Array.from(cs)) box.style.setProperty(prop, cs.getPropertyValue(prop));
  return box;
}

/** 체크박스용 체크 표시 (흰색 stroke) */
function createCheckMark(): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('width', '12');
  svg.setAttribute('height', '12');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', 'M20 6 9 17l-5-5');
  path.setAttribute('stroke', '#ffffff');
  path.setAttribute('stroke-width', '4');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  svg.appendChild(path);
  return svg;
}

/** 스피너 대체용 SVG 원호 (트랙 원 + 진한 헤드) */
function createSpinnerArc(size: number, trackColor: string, headColor: string): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('width', String(size));
  svg.setAttribute('height', String(size));
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  const track = document.createElementNS(SVG_NS, 'circle');
  track.setAttribute('cx', '12');
  track.setAttribute('cy', '12');
  track.setAttribute('r', '10');
  track.setAttribute('stroke', trackColor);
  track.setAttribute('stroke-width', '3');
  const head = document.createElementNS(SVG_NS, 'path');
  head.setAttribute('d', 'M12 2a10 10 0 0 1 10 10');
  head.setAttribute('stroke', headColor);
  head.setAttribute('stroke-width', '3');
  head.setAttribute('stroke-linecap', 'round');
  svg.appendChild(track);
  svg.appendChild(head);
  return svg;
}

/**
 * text-after-edge(글자 상자 바닥) 기준 y를 베이스라인 기준으로 바꾼다.
 * 폰트별 descent를 캔버스로 실측해서 y에서 빼고, Figma가 무시하는 속성은 제거한다.
 */
function fixTextBaselines(svgDocument: Document): void {
  const ctx = document.createElement('canvas').getContext('2d');
  if (!ctx) return;
  svgDocument.querySelectorAll('text[dominant-baseline="text-after-edge"]').forEach((text) => {
    const fontStyle = text.getAttribute('font-style') ?? 'normal';
    const fontWeight = text.getAttribute('font-weight') ?? '400';
    const fontSize = text.getAttribute('font-size') ?? '16px';
    const fontFamily = text.getAttribute('font-family') ?? 'sans-serif';
    ctx.font = `${fontStyle} ${fontWeight} ${fontSize} ${fontFamily}`;
    const descent = ctx.measureText('Mg').fontBoundingBoxDescent;
    text.removeAttribute('dominant-baseline');
    text.querySelectorAll('tspan[y]').forEach((tspan) => {
      const y = Number.parseFloat(tspan.getAttribute('y') ?? '0');
      tspan.setAttribute('y', String(Math.round((y - descent) * 100) / 100));
    });
  });
}

export async function copyElementAsFigmaSvg(target: HTMLElement): Promise<void> {
  const { elementToSVG, inlineResources } = await import('dom-to-svg');

  const clone = target.cloneNode(true) as HTMLElement;

  // 원본-클론을 같은 인덱스로 짝지어 순회한다 (제거·치환 전에 수집)
  const origAll = [target, ...Array.from(target.querySelectorAll<HTMLElement>('*'))];
  const cloneAll = [clone, ...Array.from(clone.querySelectorAll<HTMLElement>('*'))];
  const spinnerSwaps: Array<() => void> = [];

  origAll.forEach((source, index) => {
    const cloneEl = cloneAll[index];
    if (!cloneEl || !(cloneEl instanceof HTMLElement)) return;

    // 등장 애니메이션·트랜지션 재시작 방지
    cloneEl.style.animation = 'none';
    cloneEl.style.transition = 'none';

    // 폼 상태 복원 - cloneNode는 checked/value "속성"만 복사해서 실제 상태가 유실된다
    if (source instanceof HTMLInputElement && cloneEl instanceof HTMLInputElement) {
      cloneEl.checked = source.checked;
      cloneEl.value = source.value;
    }

    const cs = getComputedStyle(source);

    // 그림자로만 경계를 만드는 흰 패널은 얇은 테두리로 윤곽을 살린다
    if (cs.boxShadow !== 'none' && cs.borderTopWidth === '0px' && cs.backgroundColor === 'rgb(255, 255, 255)') {
      cloneEl.style.border = '1px solid #e5e5e5';
    }

    // 스피너 - border 트릭을 SVG 원호로
    if (source.classList.contains('vd-spinner')) {
      const size = source.getBoundingClientRect().width || 24;
      const arc = createSpinnerArc(size, cs.borderLeftColor, cs.borderTopColor);
      spinnerSwaps.push(() => cloneEl.replaceWith(arc));
    }
  });
  spinnerSwaps.forEach((swap) => swap());

  clone.querySelectorAll('.demo-figma-btn, [data-figma-exclude]').forEach((el) => el.remove());

  const FORM_CONTROLS = 'input, textarea, button';
  const originals = Array.from(target.querySelectorAll<HTMLElement>(FORM_CONTROLS));
  const cloned = Array.from(clone.querySelectorAll<HTMLElement>(FORM_CONTROLS));
  originals.forEach((source, index) => {
    const cloneEl = cloned[index];
    if (!cloneEl) return;

    // 버튼: 스타일을 복사한 div로 바꾸고 내용물(라벨·아이콘)은 그대로 옮긴다
    if (source instanceof HTMLButtonElement) {
      const box = cloneStyledBox(source);
      while (cloneEl.firstChild) box.appendChild(cloneEl.firstChild);
      cloneEl.replaceWith(box);
      return;
    }

    if (source instanceof HTMLInputElement && (source.type === 'checkbox' || source.type === 'radio')) {
      const cs = getComputedStyle(source);
      // 스위치처럼 시각적으로 숨겨진 input은 그대로 둔다 - 트랙·썸이 형제 요소로 그려진다
      if (cs.width === '0px' || cs.opacity === '0') return;

      const box = cloneStyledBox(source);
      box.style.display = 'flex';
      box.style.alignItems = 'center';
      box.style.justifyContent = 'center';
      if (source.checked) {
        if (source.type === 'radio') {
          const dot = document.createElement('div');
          dot.style.width = '8px';
          dot.style.height = '8px';
          dot.style.borderRadius = '50%';
          dot.style.background = '#ffffff';
          dot.style.flex = 'none';
          box.appendChild(dot);
        } else {
          box.appendChild(createCheckMark());
        }
      }
      cloneEl.replaceWith(box);
      return;
    }

    if (source instanceof HTMLInputElement && source.type === 'file') return;

    // 텍스트 계열 input/textarea
    const box = cloneStyledBox(source);
    box.style.display = 'flex';
    box.style.alignItems = 'center';
    box.style.overflow = 'hidden';

    const value = (source as HTMLInputElement | HTMLTextAreaElement).value;
    const isDate = source instanceof HTMLInputElement && source.type === 'date';
    const placeholder = source.getAttribute('placeholder') ?? (isDate ? '연도. 월. 일.' : '');
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
    fixTextBaselines(svgDocument);
    const svgText = new XMLSerializer().serializeToString(svgDocument);
    await navigator.clipboard.writeText(svgText);
  } finally {
    host.remove();
  }
}
