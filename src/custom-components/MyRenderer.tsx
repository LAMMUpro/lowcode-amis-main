import * as React from 'react';
import { Renderer, OptionsControl } from 'amis';
import {BasePlugin} from 'amis-editor';
import {registerEditorPlugin} from 'amis-editor';

//@ts-ignore
@Renderer({
  type: 'my-renderer',
  autoVar: true // amis 1.8 之后新增的功能，自动解析出参数里的变量
})
class MyRenderer extends React.Component {
  render() {
    const {tip, body, render}: any = this.props;
    return (
      <>
        <div>这是自定义组件：{tip}</div>
        {
          body ? 
            <div className="container" style={{backgroundColor: 'red'}}>
              {/* 渲染schema */}
              { render('body', body, {}) }
            </div>
            : null
        }
      </>
    )
  }
}

export class MyRendererPlugin extends BasePlugin {
  // 这里要跟对应的渲染器名字对应上
  // 注册渲染器的时候会要求指定渲染器名字
  rendererName = 'my-renderer';

  // 暂时只支持这个，配置后会开启代码编辑器
  $schema = '/schemas/UnkownSchema.json';

  // 用来配置名称和描述
  name = '自定义渲染器';
  description = '这只是个示例';

  // tag，决定会在哪个 tab 下面显示的
  tags = ['自定义', '表单项'];

  // 图标
  icon = 'fa fa-user';

  // 用来生成预览图的
  previewSchema = {
    type: 'my-renderer',
    target: 'demo'
  };

  // 拖入组件里面时的初始数据
  scaffold = {
    type: 'my-renderer',
    target: '233'
  };

  // 右侧面板相关
  panelTitle = '自定义组件';
  panelBody = [
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
              name: 'target',
              label: 'Target',
              type: 'input-text'
            }
          ]
        },

        {
          title: '外观',
          body: []
        }
      ]
    }
  ];
}

registerEditorPlugin(MyRendererPlugin);