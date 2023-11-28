import { AmisSpace } from "../type";

const componentName = 'my-renderer';
const componentNameCh = '自定义渲染器';

export const meta: AmisSpace.Meta = {
  type: componentName,
  title: componentNameCh,
  icon: 'fa fa-tag',
  tags: ['业务组件'],
  preview: {
    desc: '自定义渲染: 这是第一个测试用例!',
    schema: {
      type: componentName,
      target: 'demo'
    }
  },
  schema: {
    type: componentName,
    target: 'demo'
  },
  setters: [
    {
      type: 'tabs',
      tabsMode: 'line',
      className: 'm-t-n-xs',
      contentClassName: 'no-border p-l-none p-r-none',
      tabs: [
        {
          title: '常规',
          body: [
            {
              type: 'input-text',
              name: 'text',
              label: '内容',
              labelAlign: "left"
            }
          ]
        },

        {
          title: '外观',
          body: []
        }
      ]
    }
  ]
}