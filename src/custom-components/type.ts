export namespace AmisSpace {
  /** 自定义组件meta */
  export interface Meta {
    /** 组件英文名 */
    type: string,
    /** 组件中文名 */
    title: string,
    /** 组件icon */
    icon: string,
    /** 所属分类 */
    tags: string[],
    /** 移入后预览配置 */
    preview: {
      /** 组件描述 */
      desc: '自定义渲染: 这是第一个测试用例!',
      /** 预览时的schema */
      schema: {
        type: string,
        [key: string]: any
      }
    },
    /** 拖入组件里面时的初始数据 */
    schema: {
      type: string,
      [key: string]: any
    },
    /** 右侧setter设置 */
    setters: Array<{
      type: 'tabs',
      tabsMode: 'line',
      className: 'm-t-n-xs',
      contentClassName: 'no-border p-l-none p-r-none',
      tabs: Array<{
        /** tab的name */
        title: string,
        /** setters */
        body: Array<Schema>
      }>
    }>
  }

  /** amis的组件schema类型 */
  export interface Schema {
    type: string
    name?: string
    label?: string
    id?: string
    [key: string]: any
  }
}