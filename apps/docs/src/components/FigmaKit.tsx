import { useRef, useState } from 'react';
import {
  Accordion,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  DataGrid,
  DatePicker,
  Icon,
  ICON_NAMES,
  Input,
  Pagination,
  Radio,
  Select,
  Skeleton,
  Spinner,
  Switch,
  Tabs,
  Toast,
  type DataGridColumn,
  Logo,
} from '@vendys/ui';
import { copyElementAsFigmaSvg } from '../lib/figmaSvg';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="figma-kit__section">
      <div className="figma-kit__label">{title}</div>
      <div className="figma-kit__row">{children}</div>
    </div>
  );
}

type KitRow = { id: number; store: string; status: string; amount: number };
const KIT_ROWS: KitRow[] = [
  { id: 1, store: '본죽 역삼점', status: '정산 완료', amount: 1216000 },
  { id: 2, store: '맘스터치 선릉점', status: '정산 대기', amount: 1075200 },
  { id: 3, store: '샐러디 테헤란점', status: '실패', amount: 118800 },
];
const KIT_TONE: Record<string, 'success' | 'neutral' | 'error'> = {
  '정산 완료': 'success',
  '정산 대기': 'neutral',
  실패: 'error',
};
const KIT_COLUMNS: DataGridColumn<KitRow>[] = [
  { field: 'store', headerName: '가맹점' },
  {
    field: 'status',
    headerName: '상태',
    width: 110,
    align: 'center',
    render: (value) => <Badge tone={KIT_TONE[String(value)] ?? 'neutral'}>{String(value)}</Badge>,
  },
  { field: 'amount', headerName: '금액(원)', type: 'number', width: 130 },
];

/** 모든 컴포넌트를 한 보드에 모아 한 번에 Figma로 복사하는 킷 */
export function FigmaKit() {
  const boardRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'error'>('idle');

  const copyAll = async () => {
    if (!boardRef.current) return;
    setState('busy');
    try {
      await copyElementAsFigmaSvg(boardRef.current);
      setState('done');
    } catch {
      setState('error');
    }
    window.setTimeout(() => setState('idle'), 2500);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <Button onClick={copyAll} loading={state === 'busy'}>
          {state === 'done' ? '복사됨' : state === 'error' ? '복사 실패' : '전체 Figma로 복사'}
        </Button>
      </div>
      <div ref={boardRef} className="figma-kit">
        <Section title="Logo">
          <Logo size={16} />
          <Logo size={24} />
          <Logo size={32} />
          <Logo size={24} wordmark />
        </Section>

        <Section title="Button">
          <Button>저장</Button>
          <Button variant="weak">더 보기</Button>
          <Button variant="secondary">취소</Button>
          <Button variant="ghost">건너뛰기</Button>
          <Button variant="danger">삭제</Button>
          <Button disabled>비활성</Button>
          <Button size="sm">작게</Button>
          <Button size="lg">크게</Button>
        </Section>

        <Section title="Input">
          <div style={{ width: 240 }}>
            <Input label="이메일" placeholder="name@vendys.co.kr" help="회사 이메일을 입력해 주세요" />
          </div>
          <div style={{ width: 240 }}>
            <Input label="사업자등록번호" defaultValue="123-45-678" error="10자리 숫자를 확인해 주세요" />
          </div>
          <div style={{ width: 200 }}>
            <DatePicker label="정산 시작일" defaultValue="2026-07-01" />
          </div>
        </Section>

        <Section title="Select">
          <div style={{ width: 220 }}>
            <Select
              label="정산 주기"
              options={[
                { value: 'week', label: '매주' },
                { value: 'month', label: '매월' },
              ]}
            />
          </div>
          <div className="vd-select-panel figma-kit__panel" style={{ width: 200 }}>
            <button type="button" className="vd-select-option vd-select-option--single vd-select-option--selected">
              <span>매월</span>
              <Icon name="check" size={16} />
            </button>
            <button type="button" className="vd-select-option vd-select-option--single">
              <span>매주</span>
            </button>
          </div>
        </Section>

        <Section title="Checkbox · Radio · Switch">
          <Checkbox defaultChecked>이용약관 동의</Checkbox>
          <Checkbox>선택 항목</Checkbox>
          <Radio name="figma-kit-cycle" defaultChecked>
            매월
          </Radio>
          <Radio name="figma-kit-cycle">매주</Radio>
          <Switch defaultChecked>알림 받기</Switch>
          <Switch>자동 정산</Switch>
        </Section>

        <Section title="Badge">
          <Badge tone="success">정산 완료</Badge>
          <Badge>대기</Badge>
          <Badge tone="warning">확인 필요</Badge>
          <Badge tone="error">실패</Badge>
        </Section>

        <Section title="Tabs">
          <Tabs
            items={[
              { value: 'all', label: '전체' },
              { value: 'wait', label: '정산 대기' },
              { value: 'done', label: '정산 완료' },
            ]}
            value="all"
            onChange={() => undefined}
          />
        </Section>

        <Section title="Card">
          <Card style={{ width: 220 }}>
            <div style={{ fontSize: 13, color: 'var(--vd-text-sub)', marginBottom: 4 }}>이번 달 정산</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>1,240,000원</div>
          </Card>
          <Card elevated style={{ width: 220 }}>
            <div style={{ fontWeight: 600 }}>elevated 카드</div>
            <div style={{ fontSize: 13.5, color: 'var(--vd-text-sub)' }}>떠 있는 패널</div>
          </Card>
        </Section>

        <Section title="Modal">
          <div className="vd-modal figma-kit__modal" style={{ width: 400 }}>
            <h2 className="vd-modal__title">정산을 확정할까요?</h2>
            <div className="vd-modal__body">확정 후에는 되돌릴 수 없습니다.</div>
            <div className="vd-modal__actions">
              <Button variant="secondary">취소</Button>
              <Button>확정</Button>
            </div>
          </div>
        </Section>

        <Section title="Drawer">
          <div className="vd-drawer figma-kit__drawer" style={{ width: 360 }}>
            <div className="vd-drawer__header">
              <h2 className="vd-drawer__title">본죽 역삼점 정산 상세</h2>
              <span className="vd-drawer__close">
                <Icon name="close" size={18} />
              </span>
            </div>
            <div className="vd-drawer__body">
              정산 기간 2026-07-01 ~ 2026-07-10
              <br />
              결제 128건 · 1,216,000원
            </div>
            <div className="vd-drawer__actions">
              <Button variant="secondary">닫기</Button>
              <Button>정산 확정</Button>
            </div>
          </div>
        </Section>

        <Section title="Menu · Tooltip">
          <div className="vd-menu__list figma-kit__panel" style={{ width: 160 }}>
            <button type="button" className="vd-menu__item">
              수정
            </button>
            <button type="button" className="vd-menu__item">
              복제
            </button>
            <button type="button" className="vd-menu__item vd-menu__item--danger">
              삭제
            </button>
          </div>
          <span className="vd-tooltip__bubble figma-kit__bubble">정산 내역을 내려받습니다</span>
        </Section>

        <Section title="Toast">
          <Toast>저장되었습니다</Toast>
          <Toast tone="error">저장하지 못했습니다</Toast>
          <Toast tone="warning">3건은 확인이 필요합니다</Toast>
          <Toast tone="info">새 정산 내역이 있습니다</Toast>
        </Section>

        <Section title="Spinner · Skeleton">
          <Spinner size="sm" />
          <Spinner />
          <Spinner size="lg" />
          <div style={{ width: 200, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Skeleton width="60%" />
            <Skeleton width="40%" />
            <Skeleton variant="rect" height={48} />
          </div>
          <Skeleton variant="circle" width={40} height={40} />
        </Section>

        <Section title="DataGrid">
          <div style={{ width: '100%' }}>
            <DataGrid columns={KIT_COLUMNS} rows={KIT_ROWS} rowKey={(row) => row.id} selectable="multi" />
          </div>
        </Section>

        <Section title="Pagination · Breadcrumb">
          <Pagination page={3} totalPages={8} onChange={() => undefined} />
          <Breadcrumb items={[{ label: '홈' }, { label: '정산 관리' }, { label: '본죽 역삼점' }]} />
        </Section>

        <Section title="Accordion">
          <div style={{ width: 360 }}>
            <Accordion
              defaultOpen={[0]}
              items={[
                { title: '정산은 언제 되나요?', content: '매월 말일 기준으로 익월 10일에 정산됩니다.' },
                { title: '세금계산서 발행', content: '정산 완료 후 자동 발행됩니다.' },
              ]}
            />
          </div>
        </Section>

        <Section title="Icon">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, color: 'var(--vd-text)' }}>
            {ICON_NAMES.map((name) => (
              <Icon key={name} name={name} />
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
