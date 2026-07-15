import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: '현대벤디스 디자인 시스템',
  tagline: '디자인 토큰과 공용 UI 컴포넌트',
  favicon: 'img/favicon.ico',
  url: 'https://design.vendys.co.kr',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  markdown: { hooks: { onBrokenMarkdownLinks: 'warn' } },
  i18n: { defaultLocale: 'ko', locales: ['ko'] },
  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/', // 문서를 루트로 (블로그 없음)
          sidebarPath: './sidebars.ts',
        },
        blog: false,
        theme: { customCss: './src/css/custom.css' },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    navbar: {
      title: '현대벤디스 디자인 시스템',
      items: [{ href: 'https://github.com/vendys', label: 'GitHub', position: 'right' }],
    },
    footer: {
      style: 'light',
      copyright: `© ${new Date().getFullYear()} 현대벤디스 제품개발실 프론트엔드팀`,
    },
    prism: { theme: prismThemes.github, darkTheme: prismThemes.dracula },
  } satisfies Preset.ThemeConfig,
};

export default config;
