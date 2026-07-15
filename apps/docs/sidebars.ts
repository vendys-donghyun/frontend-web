import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    'intro',
    {
      type: 'category',
      label: '디자인 토큰',
      collapsed: false,
      items: ['tokens/colors', 'tokens/typography', 'tokens/spacing'],
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
        'components/table',
        'components/modal',
        'components/toast',
      ],
    },
  ],
};

export default sidebars;
