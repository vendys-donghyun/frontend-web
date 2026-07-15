import { useState } from 'react';
import { Badge, Button, DataGrid, Drawer, Icon, ICON_NAMES, Modal, Pagination, Tabs, Toast, type DataGridColumn } from '@vendys/ui';
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
      저장
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
  { key: 'display', label: 'Display', usage: '화면 최상단의 가장 큰 제목' },
  { key: 'title', label: 'Title', usage: '페이지 제목' },
  { key: 'section', label: 'Section', usage: '섹션 제목' },
  { key: 'cardTitle', label: 'Card title', usage: '카드·모달 제목' },
  { key: 'bodyLg', label: 'Body large', usage: '강조하고 싶은 본문' },
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
          <span
            style={{
              width: 130,
              flexShrink: 0,
              fontFamily: 'var(--ifm-font-family-monospace, monospace)',
              fontSize: 12.5,
              color: 'var(--vd-text)',
            }}
          >
            {token}
          </span>
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

/** 모션 토큰 견본 - key 리마운트로 등장 애니메이션을 다시 재생한다 */
export function MotionDemo() {
  const [round, setRound] = useState(0);
  return (
    <div style={{ width: '100%' }}>
      <Button variant="secondary" size="sm" onClick={() => setRound((r) => r + 1)}>
        다시 재생
      </Button>
      <div key={round} style={{ display: 'flex', gap: 24, marginTop: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--vd-text-sub)', marginBottom: 8 }}>fast · 150ms - 토스트 등장</div>
          <Toast>저장되었습니다</Toast>
        </div>
        <div>
          <div style={{ fontSize: 12, color: 'var(--vd-text-sub)', marginBottom: 8 }}>base · 250ms - 모달 등장</div>
          <div
            style={{
              width: 230,
              padding: 16,
              background: '#fff',
              borderRadius: 'var(--vd-radius-lg)',
              boxShadow: 'var(--vd-shadow-prominent)',
              animation: 'vd-modal-in var(--vd-motion-base) var(--vd-ease-out)',
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700 }}>정산을 확정할까요?</div>
            <div style={{ fontSize: 12.5, color: 'var(--vd-text-sub)', marginTop: 4 }}>0.97 → 1 스케일 + 페이드</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** 아이콘 전체 견본 - ICON_NAMES를 그대로 렌더링 */
export function IconGallery() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, width: '100%' }}>
      {ICON_NAMES.map((name) => (
        <div
          key={name}
          style={{
            width: 104,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            padding: '12px 4px',
            border: '1px solid var(--vd-border-subtle)',
            borderRadius: 8,
          }}
        >
          <Icon name={name} />
          <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--vd-text-sub)' }}>{name}</span>
        </div>
      ))}
    </div>
  );
}

export function PaginationDemo() {
  const [page, setPage] = useState(5);
  return <Pagination page={page} totalPages={12} onChange={setPage} />;
}

type SettlementRow = {
  id: number;
  store: string;
  status: string;
  settledAt: string;
  count: number;
  amount: number;
};

const GRID_ROWS: SettlementRow[] = [
  { id: 1, store: '본죽 역삼점', status: '정산 완료', settledAt: '2026-07-10', count: 128, amount: 1216000 },
  { id: 2, store: '맘스터치 선릉점', status: '정산 대기', settledAt: '2026-07-12', count: 96, amount: 1075200 },
  { id: 3, store: '서브웨이 삼성점', status: '정산 완료', settledAt: '2026-07-09', count: 210, amount: 1869000 },
  { id: 4, store: '한솥도시락 대치점', status: '확인 필요', settledAt: '2026-07-11', count: 54, amount: 486000 },
  { id: 5, store: '김밥천국 역삼2호점', status: '정산 완료', settledAt: '2026-07-08', count: 302, amount: 2114000 },
  { id: 6, store: '샐러디 테헤란점', status: '실패', settledAt: '2026-07-12', count: 12, amount: 118800 },
];

const GRID_STATUS_TONE: Record<string, 'success' | 'neutral' | 'warning' | 'error'> = {
  '정산 완료': 'success',
  '정산 대기': 'neutral',
  '확인 필요': 'warning',
  실패: 'error',
};

/** DataGrid 데모 - 선택/정렬/로딩/페이지네이션 조합 */
export function DataGridDemo() {
  const [selected, setSelected] = useState<(string | number)[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const columns: DataGridColumn<SettlementRow>[] = [
    { field: 'store', headerName: '가맹점' },
    {
      field: 'status',
      headerName: '상태',
      width: 110,
      align: 'center',
      render: (value) => <Badge tone={GRID_STATUS_TONE[String(value)] ?? 'neutral'}>{String(value)}</Badge>,
    },
    { field: 'settledAt', headerName: '정산일', type: 'date', width: 120 },
    { field: 'count', headerName: '건수', type: 'number', width: 90 },
    { field: 'amount', headerName: '금액(원)', type: 'number', width: 130 },
  ];

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontSize: 13, color: 'var(--vd-text-sub)' }}>
          전체 {GRID_ROWS.length}건 · 선택 {selected.length}건
        </span>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 1200);
          }}
        >
          로딩 재현
        </Button>
      </div>
      <DataGrid
        columns={columns}
        rows={GRID_ROWS}
        rowKey={(row) => row.id}
        selectable="multi"
        selectedKeys={selected}
        onSelectionChange={(keys) => setSelected(keys)}
        loading={loading}
      />
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
        <Pagination page={page} totalPages={5} onChange={setPage} />
      </div>
    </div>
  );
}

/** compact 밀도 + 빈 상태 데모 */
export function DataGridEmptyDemo() {
  return (
    <DataGrid
      density="compact"
      columns={[
        { field: 'store', headerName: '가맹점' },
        { field: 'amount', headerName: '금액(원)', type: 'number', width: 130 },
      ]}
      rows={[]}
      rowKey={(row: { id: number }) => row.id}
    />
  );
}

/** 컬럼 고정(pinned) + 가로 스크롤 데모 */
export function DataGridPinnedDemo() {
  const columns: DataGridColumn<SettlementRow>[] = [
    { field: 'store', headerName: '가맹점', width: 150, pinned: 'left' },
    {
      field: 'status',
      headerName: '상태',
      width: 100,
      align: 'center',
      render: (value) => <Badge tone={GRID_STATUS_TONE[String(value)] ?? 'neutral'}>{String(value)}</Badge>,
    },
    { field: 'settledAt', headerName: '정산일', type: 'date', width: 120 },
    { field: 'count', headerName: '건수', type: 'number', width: 90 },
    { field: 'amount', headerName: '금액(원)', type: 'number', width: 130 },
    {
      field: 'fee',
      headerName: '수수료(원)',
      type: 'number',
      width: 110,
      valueGetter: (row) => Math.round(row.amount * 0.033),
    },
    {
      field: 'payout',
      headerName: '지급액(원)',
      type: 'number',
      width: 120,
      valueGetter: (row) => row.amount - Math.round(row.amount * 0.033),
    },
    { field: 'memo', headerName: '비고', width: 160, valueGetter: () => null },
    {
      field: 'actions',
      headerName: '액션',
      width: 90,
      align: 'center',
      sortable: false,
      pinned: 'right',
      render: () => (
        <Button variant="ghost" size="sm">
          상세
        </Button>
      ),
    },
  ];
  return (
    <DataGrid columns={columns} rows={GRID_ROWS} rowKey={(row) => row.id} selectable="multi" minWidth={1240} />
  );
}

/** AI 프롬프트 페이지 좌측용 - 데스크톱 크기만 보여주는 컴팩트 타이포 견본 */
export function TypeScaleMini() {
  const roles = [
    { key: 'display', label: 'Display' },
    { key: 'title', label: 'Title' },
    { key: 'section', label: 'Section' },
    { key: 'body', label: 'Body' },
    { key: 'caption', label: 'Caption' },
  ] as const;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%' }}>
      {roles.map(({ key, label }) => {
        const t = typography.scale[key];
        return (
          <div key={key}>
            <div style={{ fontSize: 11.5, color: 'var(--vd-text-sub)', marginBottom: 2 }}>
              {label} · {t.desktop}px · {t.weight}
            </div>
            <div
              style={{
                fontFamily: typography.fontFamily,
                fontSize: t.desktop,
                fontWeight: t.weight,
                lineHeight: 1.3,
                letterSpacing: typography.letterSpacing,
                color: 'var(--vd-text)',
              }}
            >
              맛있는 식사, 간편한 정산
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function DrawerDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        상세 열기
      </Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="본죽 역삼점 정산 상세"
        actions={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              닫기
            </Button>
            <Button onClick={() => setOpen(false)}>정산 확정</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <div style={{ fontSize: 12.5, color: 'var(--vd-text-sub)' }}>정산 기간</div>
            <div style={{ color: 'var(--vd-text)' }}>2026-07-01 ~ 2026-07-10</div>
          </div>
          <div>
            <div style={{ fontSize: 12.5, color: 'var(--vd-text-sub)' }}>결제 건수</div>
            <div style={{ color: 'var(--vd-text)' }}>128건</div>
          </div>
          <div>
            <div style={{ fontSize: 12.5, color: 'var(--vd-text-sub)' }}>정산 금액</div>
            <div style={{ color: 'var(--vd-text)', fontWeight: 700 }}>1,216,000원</div>
          </div>
        </div>
      </Drawer>
    </>
  );
}
