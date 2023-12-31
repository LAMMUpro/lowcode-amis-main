import * as React from 'react';
import { Renderer, OptionsControl } from 'amis';
import {BasePlugin} from 'amis-editor';
import {registerEditorPlugin} from 'amis-editor';
import { meta } from './meta';

//@ts-ignore
@Renderer({
  type: meta.type,
  autoVar: true // amis 1.8 之后新增的功能，自动解析出参数里的变量
})
class MyRenderer extends React.Component {
  render() {
    const {text, body, render}: any = this.props;
    return (
      <>
        <div>这是自定义组件：{text}</div>
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
  // 暂时只支持这个，配置后会开启代码编辑器
  $schema = '/schemas/UnkownSchema.json';
  rendererName = meta.type;
  name = meta.title;
  description = meta.preview.desc;
  tags = meta.tags;
  icon = meta.icon;
  previewSchema = meta.preview.schema;
  scaffold = meta.schema;
  panelBody = meta.setters;
}

registerEditorPlugin(MyRendererPlugin);