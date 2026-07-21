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
 * - 텍스트 좌표: 변환기의 dominant-baseline·textLength를 Figma가 무시해 라벨이 우측 하단으로
 *   밀린다 - 베이스라인 y + 가운데 앵커 x로 재계산
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

type TextAnchor = 'start' | 'middle' | 'end';

/**
 * 마운트된 클론의 텍스트 노드를 문서 순서로 돌며 실제 정렬을 감지한다.
 * 텍스트보다 넓은 가장 가까운 컨테이너의 패딩 박스와 비교해서
 * 가운데면 middle, 오른쪽 끝이 맞으면 end, 그 외에는 start.
 * (패딩 박스 기준이라 버튼·배지처럼 내용에 맞춰 줄어드는 요소도 정렬 컨테이너로 잡힌다)
 */
function detectTextAnchors(clone: HTMLElement): TextAnchor[] {
  const anchors: TextAnchor[] = [];
  const walker = document.createTreeWalker(clone, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    const current = node;
    node = walker.nextNode();
    if (!current.textContent || !current.textContent.trim()) continue;

    const range = document.createRange();
    range.selectNodeContents(current);
    const rect = range.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) continue;

    let container: { left: number; right: number } | null = null;
    let el: HTMLElement | null = current.parentElement;
    while (el && el !== clone.parentElement) {
      const cs = getComputedStyle(el);
      const box = el.getBoundingClientRect();
      const left = box.left + Number.parseFloat(cs.borderLeftWidth);
      const right = box.right - Number.parseFloat(cs.borderRightWidth);
      if (right - left > rect.width + 2) {
        container = { left, right };
        break;
      }
      el = el.parentElement;
    }
    if (!container) {
      anchors.push('middle');
      continue;
    }
    const containerCenter = (container.left + container.right) / 2;
    const textCenter = rect.left + rect.width / 2;
    if (Math.abs(textCenter - containerCenter) <= 1.5) anchors.push('middle');
    else if (Math.abs(rect.right - container.right) <= 1.5) anchors.push('end');
    else anchors.push('start');
  }
  return anchors;
}

/**
 * 텍스트 좌표를 Figma가 그대로 해석할 수 있는 형태로 재계산한다.
 * - 세로: text-after-edge(글자 상자 바닥) 기준 y를 베이스라인 기준으로. 폰트별 descent를 캔버스로 실측
 * - 가로: 폭 맞춤(textLength)을 Figma가 무시해 글자 폭 차이가 생긴다 - 원본 정렬대로
 *   가운데 텍스트는 중심점 앵커, 오른쪽 정렬은 끝점 앵커, 왼쪽 정렬은 시작점 앵커로 바꿔서
 *   폭이 달라져도 정렬 기준선이 유지되게 한다
 */
function fixTextGeometry(svgDocument: Document, anchors: TextAnchor[]): void {
  const ctx = document.createElement('canvas').getContext('2d');
  if (!ctx) return;
  const texts = Array.from(svgDocument.querySelectorAll('text'));
  // 원본 텍스트 노드와 출력 text 요소는 문서 순서가 같다 - 개수가 어긋나면 전부 middle로 폴백
  const anchorFor = (index: number): TextAnchor =>
    anchors.length === texts.length ? anchors[index] : 'middle';
  texts.forEach((text, textIndex) => {
    const fontStyle = text.getAttribute('font-style') ?? 'normal';
    const fontWeight = text.getAttribute('font-weight') ?? '400';
    const fontSize = text.getAttribute('font-size') ?? '16px';
    const fontFamily = text.getAttribute('font-family') ?? 'sans-serif';
    ctx.font = `${fontStyle} ${fontWeight} ${fontSize} ${fontFamily}`;
    const descent = ctx.measureText('Mg').fontBoundingBoxDescent;

    const isAfterEdge = text.getAttribute('dominant-baseline') === 'text-after-edge';
    text.removeAttribute('dominant-baseline');
    const anchor = anchorFor(textIndex);
    text.setAttribute('text-anchor', anchor);
    // Figma에 Variable판이 없으면 엉뚱한 글꼴로 대체돼 세로 위치가 어긋난다 - static Pretendard 우선
    if (fontFamily.includes('Pretendard')) {
      text.setAttribute('font-family', "Pretendard, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif");
    }

    text.querySelectorAll('tspan').forEach((tspan) => {
      if (isAfterEdge && tspan.hasAttribute('y')) {
        const y = Number.parseFloat(tspan.getAttribute('y') ?? '0');
        tspan.setAttribute('y', String(Math.round((y - descent) * 100) / 100));
      }
      const width = Number.parseFloat(tspan.getAttribute('textLength') ?? '');
      if (tspan.hasAttribute('x') && Number.isFinite(width) && anchor !== 'start') {
        const x = Number.parseFloat(tspan.getAttribute('x') ?? '0');
        const anchored = anchor === 'middle' ? x + width / 2 : x + width;
        tspan.setAttribute('x', String(Math.round(anchored * 100) / 100));
      }
      tspan.removeAttribute('textLength');
      tspan.removeAttribute('lengthAdjust');
    });
  });
}

/**
 * overflow hidden이 만든 마스크를 보정한다.
 * 변환기의 마스크는 테두리 상자와 크기가 같고 모서리 둥글기가 없어서, 가운데 정렬된
 * 테두리 stroke의 바깥 절반과 둥근 모서리를 잘라먹는다 - 테두리 두께만큼 키우고 둥글기를 맞춘다.
 */
function fixOverflowMasks(svgDocument: Document): void {
  svgDocument.querySelectorAll('mask').forEach((mask) => {
    const maskRect = mask.querySelector('rect');
    if (!maskRect || mask.children.length !== 1) return;

    const id = mask.getAttribute('id');
    const owner = id ? svgDocument.querySelector(`g[mask="url(#${id})"]`) : null;
    const borderRect = owner?.querySelector('g[data-stacking-layer="rootBackgroundAndBorders"] > rect') ?? null;
    const strokeWidth = Number.parseFloat(borderRect?.getAttribute('stroke-width') ?? '') || 1;
    const grow = Math.ceil(strokeWidth);

    const x = Number.parseFloat(maskRect.getAttribute('x') ?? '0');
    const y = Number.parseFloat(maskRect.getAttribute('y') ?? '0');
    const w = Number.parseFloat(maskRect.getAttribute('width') ?? '0');
    const h = Number.parseFloat(maskRect.getAttribute('height') ?? '0');
    maskRect.setAttribute('x', String(x - grow));
    maskRect.setAttribute('y', String(y - grow));
    maskRect.setAttribute('width', String(w + grow * 2));
    maskRect.setAttribute('height', String(h + grow * 2));

    const rx = Number.parseFloat(borderRect?.getAttribute('rx') ?? '');
    if (Number.isFinite(rx) && rx > 0) {
      maskRect.setAttribute('rx', String(rx + grow));
      maskRect.setAttribute('ry', String(rx + grow));
    }
  });
}

/**
 * 테두리 stroke를 채움 도형 두 장으로 분해한다.
 * SVG stroke는 경계선에 반씩 걸치고 Figma는 정렬 해석이 또 달라서 모서리가 어긋나 보인다.
 * CSS처럼 "바깥 = 테두리색, 안쪽(테두리 두께만큼 축소, 반경도 축소) = 배경색"의 채움 2장으로
 * 바꾸면 해석 차이가 개입할 여지가 없다.
 */
function splitBorderStrokes(svgDocument: Document): void {
  svgDocument.querySelectorAll('g[data-stacking-layer="rootBackgroundAndBorders"] > rect[stroke]').forEach((rect) => {
    const stroke = rect.getAttribute('stroke') ?? '';
    if (!stroke || stroke === 'none') return;
    const strokeWidth = Number.parseFloat(rect.getAttribute('stroke-width') ?? '1') || 1;

    const x = Number.parseFloat(rect.getAttribute('x') ?? '0');
    const y = Number.parseFloat(rect.getAttribute('y') ?? '0');
    const width = Number.parseFloat(rect.getAttribute('width') ?? '0');
    const height = Number.parseFloat(rect.getAttribute('height') ?? '0');
    const rx = Number.parseFloat(rect.getAttribute('rx') ?? '0') || 0;
    const fill = rect.getAttribute('fill') ?? 'none';

    // 바깥 사각형 - 테두리색 채움
    rect.removeAttribute('stroke');
    rect.removeAttribute('stroke-width');
    rect.setAttribute('fill', stroke);

    // 안쪽 사각형 - 원래 배경색 채움
    const inner = rect.cloneNode(false) as Element;
    inner.removeAttribute('filter');
    inner.setAttribute('x', String(x + strokeWidth));
    inner.setAttribute('y', String(y + strokeWidth));
    inner.setAttribute('width', String(Math.max(0, width - strokeWidth * 2)));
    inner.setAttribute('height', String(Math.max(0, height - strokeWidth * 2)));
    const innerRadius = Math.max(0, rx - strokeWidth);
    inner.setAttribute('rx', String(innerRadius));
    inner.setAttribute('ry', String(innerRadius));
    inner.setAttribute('fill', fill);
    rect.parentNode?.insertBefore(inner, rect.nextSibling);
  });
}

interface ShadowTarget {
  tag: string;
  ordinal: number;
  shadow: string;
}

/** 마운트된 클론에서 box-shadow를 가진 요소를 태그별 순번과 함께 수집한다 */
function collectShadowTargets(clone: HTMLElement): ShadowTarget[] {
  const targets: ShadowTarget[] = [];
  const counters = new Map<string, number>();
  [clone, ...Array.from(clone.querySelectorAll<HTMLElement>('*'))].forEach((el) => {
    const tag = el.tagName.toLowerCase();
    const ordinal = (counters.get(tag) ?? 0) + 1;
    counters.set(tag, ordinal);
    if (!(el instanceof HTMLElement)) return;
    const shadow = getComputedStyle(el).boxShadow;
    if (shadow && shadow !== 'none') targets.push({ tag, ordinal, shadow });
  });
  return targets;
}

/** computed box-shadow 문자열을 색·오프셋·블러 목록으로 파싱한다 (inset 제외) */
function parseBoxShadows(value: string): Array<{ color: string; dx: number; dy: number; blur: number }> {
  const parts: string[] = [];
  let depth = 0;
  let current = '';
  for (const ch of value) {
    if (ch === '(') depth += 1;
    if (ch === ')') depth -= 1;
    if (ch === ',' && depth === 0) {
      parts.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  parts.push(current);

  const shadows: Array<{ color: string; dx: number; dy: number; blur: number }> = [];
  for (const part of parts) {
    if (!part.trim() || part.includes('inset')) continue;
    const color = part.match(/rgba?\([^)]*\)|#[0-9a-fA-F]+/)?.[0] ?? 'rgba(0,0,0,0.1)';
    const nums = (part.replace(color, '').match(/-?[\d.]+/g) ?? []).map(Number);
    const [dx = 0, dy = 0, blur = 0] = nums;
    shadows.push({ color, dx, dy, blur });
  }
  return shadows;
}

/**
 * box-shadow를 SVG 필터(feDropShadow)로 옮긴다 - Figma가 드롭 섀도 효과로 가져간다.
 * 변환기 출력의 g[data-tag]는 클론의 요소와 태그별 등장 순서가 같다는 점으로 짝을 찾는다.
 */
function applyBoxShadows(svgDocument: Document, targets: ShadowTarget[]): void {
  if (targets.length === 0) return;
  const root = svgDocument.documentElement;
  let defs = svgDocument.querySelector('defs');
  if (!defs) {
    defs = svgDocument.createElementNS(SVG_NS, 'defs');
    root.insertBefore(defs, root.firstChild);
  }

  const groupByKey = new Map<string, Element>();
  const counters = new Map<string, number>();
  svgDocument.querySelectorAll('g[data-tag]').forEach((group) => {
    const tag = group.getAttribute('data-tag') ?? '';
    const ordinal = (counters.get(tag) ?? 0) + 1;
    counters.set(tag, ordinal);
    groupByKey.set(`${tag}:${ordinal}`, group);
  });

  let filterId = 0;
  for (const target of targets) {
    const group = groupByKey.get(`${target.tag}:${target.ordinal}`);
    const rect = group?.querySelector(':scope > g[data-stacking-layer="rootBackgroundAndBorders"] > rect');
    if (!group || !rect) continue;
    const shadows = parseBoxShadows(target.shadow);
    if (shadows.length === 0) continue;

    filterId += 1;
    const filter = svgDocument.createElementNS(SVG_NS, 'filter');
    filter.setAttribute('id', `fig-shadow-${filterId}`);
    filter.setAttribute('x', '-100%');
    filter.setAttribute('y', '-100%');
    filter.setAttribute('width', '300%');
    filter.setAttribute('height', '300%');
    for (const s of shadows) {
      const drop = svgDocument.createElementNS(SVG_NS, 'feDropShadow');
      drop.setAttribute('dx', String(s.dx));
      drop.setAttribute('dy', String(s.dy));
      drop.setAttribute('stdDeviation', String(s.blur / 2));
      drop.setAttribute('flood-color', s.color);
      filter.appendChild(drop);
    }
    defs.appendChild(filter);

    if (group.hasAttribute('mask')) {
      // 마스크가 그림자를 잘라먹으므로, 그림자 전용 사각형을 마스크 밖 형제로 깐다
      const ghost = rect.cloneNode(false) as Element;
      ghost.setAttribute('filter', `url(#fig-shadow-${filterId})`);
      group.parentNode?.insertBefore(ghost, group);
    } else {
      rect.setAttribute('filter', `url(#fig-shadow-${filterId})`);
    }
  }
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
    // overflow hidden은 마스크로 변환되며 테두리 바깥 절반을 잘라먹는다 - 플레이스홀더는 넘칠 일이 없다
    box.style.overflow = 'visible';

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
    const shadowTargets = collectShadowTargets(clone);
    const textAnchors = detectTextAnchors(clone);
    const svgDocument = elementToSVG(clone);
    await inlineResources(svgDocument.documentElement);
    fixTextGeometry(svgDocument, textAnchors);
    fixOverflowMasks(svgDocument);
    splitBorderStrokes(svgDocument);
    applyBoxShadows(svgDocument, shadowTargets);
    const svgText = new XMLSerializer().serializeToString(svgDocument);
    await navigator.clipboard.writeText(svgText);
  } finally {
    host.remove();
  }
}
