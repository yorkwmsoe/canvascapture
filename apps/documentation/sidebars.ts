import type { SidebarsConfig } from '@docusaurus/plugin-content-docs'

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
    // By default, Docusaurus generates a sidebar from the docs folder structure
    //canvasDocSidebar: [{ type: 'autogenerated', dirName: '.' }],

    // But you can create a sidebar manually

    canvasDocSidebar: [
        {
            type: 'category',
            label: 'Getting Started',
            items: [
                {
                    type: 'autogenerated',
                    dirName: 'Getting Started',
                },
            ],
        },
        {
            type: 'category',
            label: 'Desktop',
            items: [
                {
                    type: 'autogenerated',
                    dirName: 'Desktop',
                },
            ],
        },
        {
            type: 'category',
            label: 'Private Module',
            items: [
                {
                    type: 'autogenerated',
                    dirName: 'Private Module',
                },
            ],
        },
        {
            type: 'category',
            label: 'Docs Site',
            items: [
                {
                    type: 'autogenerated',
                    dirName: 'Docs',
                },
            ],
        },
    ],

    releaseSidebar: [
        {
            type: 'category',
            label: 'Releases',
            items: [
                {
                    type: 'autogenerated',
                    dirName: 'Releases',
                },
            ],
        },
    ],
}

export default sidebars
