import * as React from 'react';
import { Renderer, OptionsControl } from 'amis';

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