import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: '현대벤디스',
  tagline: '디자인 토큰과 공용 UI 컴포넌트',
  favicon: 'img/favicon.ico',
  // GitHub Pages 초안 배포 기준. 커스텀 도메인이 정해지면 url만 바꾼다
  url: 'https://vendys-donghyun.github.io',
  // 로컬은 '/', Pages 빌드는 워크플로가 '/frontend-web/' 주입
  baseUrl: process.env.DOCS_BASE_URL ?? '/',
  onBrokenLinks: 'throw',
  markdown: { hooks: { onBrokenMarkdownLinks: 'warn' } },
  clientModules: ['./src/clientModules/figmaCopy.ts'],
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
      title: '현대벤디스',
      logo: { alt: '현대벤디스', src: 'img/simbol.svg' },
      items: [{ href: 'https://github.com/vendys', label: 'GitHub', position: 'right' }],
    },
    footer: {
      style: 'light',
      copyright: `© ${new Date().getFullYear()} 현대벤디스`,
    },
    prism: { theme: prismThemes.github, darkTheme: prismThemes.dracula },
  } satisfies Preset.ThemeConfig,
};

export default config;
