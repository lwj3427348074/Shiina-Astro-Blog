import _ from 'lodash'

// 外链配置
interface BasicLinkConfig {
  sitename: string,
  link: string,
  class: string
}

// 个人信息配置
interface BasicPersonalConfig {
  name: string
  introduction?: string,
  /** 头像路径，从项目根目录开始查找，如：`/source/avatar.jpg`，如果文件位于 `/public` 下可以将其省略 */
  avatar?: string,
  link?: BasicLinkConfig[]
}

/**
 * search 相关配置
 * @deprecated 将会在新版本中启用
 */
interface BasicSearchConfig {
  useRequest?: boolean
  requestURL?: string
}

// header 通用配置
interface BasicHeaderConfig {
  /** 当前网站标题，会用于 head 部分设置网站标题与大标题 */
  title?: string
  /** 隐藏 header，默认 `false` */
  hidden?: boolean
  /** 保持背景颜色，即取消透明模式，默认 `true` */
  keepBackgroundColor?: boolean
}

// 单个页面的 header 配置
type PageHeaderConfig = BasicHeaderConfig

export interface BasicBackgroundConfig {
  /** 
   * 背景类型，`photo` 为图片；`fade` 为渐变色，但只要是 `background-image` 可接受的参数即可；`purity` 为纯色
   */
  type: 'photo' | 'fade' | 'purity'
  /**
   * 填入内容，根据 `type` 选项决定
   * - `photo`，则填入图片路径
   * - `fade` 则填入 `background-image` 可接受参数，比如 `linear-gradient()`
   * - `purify` 则填入颜色代码，如 `#eee`
   */
  content: string
  /**
   * @deprecated 将会在新版本中启用
   */
  jsPlugin: boolean
  /** 为背景提供一个毛玻璃效果，默认 `false`，详见：[MDN filter](https://developer.mozilla.org/zh-CN/docs/Web/CSS/filter) */
  filter: boolean
  /** 为背景提供一个暗色效果，默认 `false`，详见：[MDN background-color](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-color)
   * 
   * 颜色透明度 0.6
   */
  mask: boolean
}

// footer 配置
interface BasicFooterConfig {
  /** 隐藏 footer，默认 `false` */
  hidden?: boolean
  /** 底部 footer，默认是 `Copyright © By {你的名字}`，会作为 HTML 插入到页尾 */
  content?: string[]
}

type PageFooterConfig = BasicFooterConfig

// 底色配置
interface BasicThemeColorConfig {
  /** 背景默认颜色，默认：`#f2f5f8`，夜间默认：`#222` */
  backgroundDefault: string
  /** 选择框激活 / 鼠标悬浮时的背景颜色，默认：`#ddd`，夜间默认：`#444` */
  backgroundActiveDefault: string
  /** 文字默认颜色，默认：`#fff`，夜间默认：`#000` */
  textDefault: string
  /** 文字按钮激活 / 鼠标悬浮时默认颜色，默认：`#ad7ffd`，夜间默认：`#4e3e6b` */
  tipsDefault: string
}

type LightThemeColorConfig = BasicThemeColorConfig

type DarkThemeColorConfig = BasicThemeColorConfig

// 页面配置
interface BasicPageConfig {
  header?: PageHeaderConfig
  background?: Partial<BasicBackgroundConfig>
  footer?: PageFooterConfig
  /** 给予页面中心部分最小高度，默认为 `true` */
  setMinHeight?: boolean
}

export type PageConfig = BasicPageConfig

// 网站配置
interface BasicWebsiteConfig {
  /** 网站默认标题，会被放入 head 标签内的 title 部分，header 处也会使用 */
  title: string
  /** 网站描述 */
  description: string
  /** 网站线上链接 */
  url: string
}

export type PageList = 'index' | 'blog' | 'tags' | 'about' | 'friends' | 'article' | 'custom' | 'search'

interface BlogConfig extends Record<any, any> {
  PageDefaultSettings: BasicPageConfig
  WebsiteSettings: BasicWebsiteConfig
  color: {
    light: LightThemeColorConfig
    dark: DarkThemeColorConfig
  }
  pages: Partial<Record<PageList, PageConfig>>
  UserInfo: BasicPersonalConfig
  /** 
   * 搜索配置
   * 
   * @deprecated 还在开发中
   */
  SearchConfig?: BasicSearchConfig
}

export default function defineBlogConfig(config: Partial<BlogConfig>): BlogConfig {
  const _DEFAULT_CONFIG_: BlogConfig = {
    PageDefaultSettings: {
      setMinHeight: true,
      header: {
        title: '',
        hidden: false,
        keepBackgroundColor: true
      },
      background: {
        filter: false,
        mask: false,
        type: "purity",
        content: "#ddd"
      },
      footer: {
        hidden: false,
        content: [
          '<div>Copyright © 2022</div>'
        ]
      }
    },
    WebsiteSettings: {
      title: `Shiina's Blog`,
      description: '',
      url: 'https://blog.shiinafan.top'
    },
    UserInfo: {
      name: 'Shiinafan',
      introduction: '有钱终成眷属，没钱亲眼目睹',
      avatar: '/source/avatar.jpg'
    },
    color: {
      light: {
        backgroundDefault: '#f5f5f5',
        backgroundActiveDefault: '#eee',
        textDefault: '#222',
        tipsDefault: '#3F5EFB'
      },
      dark: {
        backgroundDefault: '#121212',
        backgroundActiveDefault: '#444',
        textDefault: '#fff',
        tipsDefault: '#919edf'
      },
    },
    pages: {
      'index': {
        header: {
          title: '主页'
        }
      },
      'blog': {
        header: {
          title: '博客'
        }
      },
      'about': {},
      'article': {},
      'custom': {},
      'friends': {
        header: {
          title: '友链'
        }
      },
      'tags': {
        header: {
          title: '标签'
        }
      },
      'search': {
        header: {
          title: '搜索'
        }
      }
    }
  }

  const C = _.defaultsDeep(config, _DEFAULT_CONFIG_)

  for (const i in C.pages) {
    C.pages[i] = _.defaultsDeep(C.pages[i], C.PageDefaultSettings)
  }

  return C
}