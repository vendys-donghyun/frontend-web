import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    'intro',
    {
      type: 'category',
      label: '디자인 토큰',
      collapsed: false,
      items: ['tokens/colors', 'tokens/typography', 'tokens/spacing', 'tokens/motion'],
    },
    {
      type: 'category',
      label: '컴포넌트',
      collapsed: false,
      items: [
        'components/button',
        'components/input',
        'components/selection',
        'components/badge',
        'components/tabs',
        'components/card',
        'components/modal',
        'components/toast',
        'components/icon',
        'components/spinner',
        'components/switch',
        'components/tooltip',
        'components/menu',
        'components/pagination',
        'components/accordion',
        'components/datepicker',
        'components/upload',
        'components/form',
        'components/datagrid',
      ],
    },
  ],
};

export default sidebars;
