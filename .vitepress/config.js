import { defineConfig } from 'vitepress'

import lightbox from "vitepress-plugin-lightbox";

export default defineConfig({
  title: '孕期指南',
  description: '妈妈和宝宝的全面指南',
  srcDir: 'pages',
  outDir: 'dist',
  base: '/',
  head: [
    ['meta', { name: 'keywords', content: '孕期指南,妈妈宝宝,待产准备,产后恢复,新生儿护理,母婴用品,哺乳指南,婴儿护理,孕妇健康,宝宝成长,儿保疫苗,安全座椅,婴儿推车,新生儿注意事项,过敏症状,病症护理' }],
    ['meta', { name: 'author', content: 'MiyueFE' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
    ['meta', { property: 'og:title', content: '孕期指南 - 妈妈和宝宝的全面指南' }],
    ['meta', { property: 'og:description', content: '专业的孕期指南，涵盖待产准备、产后恢复、新生儿护理、母婴用品选择等全方位内容，为准妈妈和新手妈妈提供贴心指导。' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:image', content: '/images/logo.svg' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: '孕期指南 - 妈妈和宝宝的全面指南' }],
    ['meta', { name: 'twitter:description', content: '专业的孕期指南，涵盖待产准备、产后恢复、新生儿护理、母婴用品选择等全方位内容。' }],
    ['meta', { name: 'twitter:image', content: '/images/logo.svg' }],
    ['link', { rel: 'icon', href: '/pages/images/logo.png' }],
    ['link', { rel: 'canonical', href: 'https://miyuefe.cn/' }]
  ],
  themeConfig: {
    logo: '/pages/images/logo.png',
    nav: [
      { text: '首页', link: '/' },
      { text: '待产准备', link: '/00-待产证件资料' },
      { text: '产后指南', link: '/03-妈妈产后恢复和哺乳指南' },
      { text: '新生儿护理', link: '/06-新生儿常见过敏原与过敏症状' },
      { text: '母婴用品', link: '/11-0-奶粉' },
      { text: '参考资料', link: '/90-参考资料' },
    ],
    sidebar: [
      {
        text: '待产准备',
        items: [
          { text: '待产证件资料', link: '/00-待产证件资料' },
          { text: '妈妈待产&住院包', link: '/01-妈妈待产&住院包' },
          { text: '宝宝待产&住院包', link: '/02-宝宝待产&住院包' }
        ]
      },
      {
        text: '产后指南',
        items: [
          { text: '妈妈产后恢复和哺乳指南', link: '/03-妈妈产后恢复和哺乳指南' },
          { text: '宝宝居家成长指南', link: '/04-宝宝居家成长指南' },
          { text: '宝宝儿保与疫苗', link: '/05-宝宝儿保与疫苗' }
        ]
      },
      {
        text: '新生儿护理',
        items: [
          { text: '新生儿常见过敏原与过敏症状', link: '/06-新生儿常见过敏原与过敏症状' },
          { text: '新生儿常见病症及注意事项', link: '/07-新生儿常见病症及注意事项' },
          { text: '新生儿注意事项', link: '/10-新生儿注意事项' }
        ]
      },
      {
        text: '母婴用品',
        items: [
          { text: '婴幼儿奶粉', link: '/11-0-奶粉' },
          { text: '安全座椅', link: '/11-1-安全座椅' },
          { text: '婴儿推车', link: '/11-2-婴儿推车' },
          { text: '母婴用品相关资料', link: '/12-母婴用品相关资料' },
          { text: '常见品牌与价格', link: '/20-常见品牌与价格' }
        ]
      },
      {
        text: '参考资料',
        link: '/90-参考资料'
      }
    ],
    aside: true,
    outline: {
      level: [1, 4],
      label: '本页目录'
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/miyuesc/MomAndBabyForChina' }
    ]
  },
  markdown: {
    config: (md) => {
      // Use lightbox plugin
      md.use(lightbox, {});
    },
  },
})
