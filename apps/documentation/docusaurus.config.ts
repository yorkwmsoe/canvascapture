import { themes as prismThemes } from 'prism-react-renderer'
import type { Config } from '@docusaurus/types'
import type * as Preset from '@docusaurus/preset-classic'

const config: Config = {
    title: 'Canvas Capture',
    tagline: 'Capture and record work from Canvas',
    favicon: 'img/img.png',

    // Set the production url of your site here
    url: 'https://canvas-capture-project.example.com',
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: '/sdl/sdl/canvascapture/',

    onBrokenLinks: 'ignore',
    onBrokenMarkdownLinks: 'ignore',

    // Even if you don't use internationalization, you can use this field to set
    // useful metadata like html lang. For example, if your site is Chinese, you
    // may want to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: 'en',
        locales: ['en'],
    },

    presets: [
        [
            'classic',
            {
                docs: {
                    sidebarPath: './sidebars.ts',
                },
                theme: {
                    customCss: './src/css/custom.css',
                },
            } satisfies Preset.Options,
        ],
    ],

    themeConfig: {
        // Replace with your project's social card
        image: 'img/docusaurus-social-card.jpg',
        navbar: {
            title: 'Canvas Capture',
            logo: {
                alt: 'My Site Logo',
                src: 'img/img.png',
            },
            items: [
                {
                    type: 'docSidebar',
                    sidebarId: 'canvasDocSidebar',
                    position: 'left',
                    label: 'Docs',
                },
                {
                    type: 'docSidebar',
                    sidebarId: 'releaseSidebar',
                    label: 'Releases',
                    position: 'left',
                },
            ],
        },
        footer: {
            style: 'dark',
            links: [
                {
                    title: 'More',
                    items: [
                        {
                            label: 'GitLab',
                            href: 'https://gitlab.com/msoe.edu/sdl/sdl/canvascapture',
                        },
                    ],
                },
            ],
            copyright: `Copyright © ${new Date().getFullYear()} Canvas Capture Project. Built with Docusaurus.`,
        },
        prism: {
            theme: prismThemes.github,
            darkTheme: prismThemes.dracula,
        },
    } satisfies Preset.ThemeConfig,
}

export default config
