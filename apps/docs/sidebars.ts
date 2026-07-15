import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    'intro',
    'ai-prompt',
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
        {
          type: 'category',
          label: 'Form',
          collapsible: false,
          items: [
            'components/input',
            'components/select',
            'components/checkbox',
            'components/radio',
            'components/switch',
            'components/datepicker',
            'components/upload',
            'components/form',
          ],
        },
        {
          type: 'category',
          label: 'Button',
          collapsible: false,
          items: ['components/button'],
        },
        {
          type: 'category',
          label: 'Data',
          collapsible: false,
          items: ['components/datagrid', 'components/pagination'],
        },
        {
          type: 'category',
          label: 'Panel',
          collapsible: false,
          items: ['components/card', 'components/tabs', 'components/accordion'],
        },
        {
          type: 'category',
          label: 'Overlay',
          collapsible: false,
          items: ['components/modal', 'components/drawer', 'components/menu', 'components/tooltip'],
        },
        {
          type: 'category',
          label: 'Feedback',
          collapsible: false,
          items: ['components/toast', 'components/spinner'],
        },
        {
          type: 'category',
          label: 'Misc',
          collapsible: false,
          items: ['components/icon', 'components/badge'],
        },
      ],
    },
  ],
};

export default sidebars;
