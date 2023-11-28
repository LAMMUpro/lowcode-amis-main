import * as React from 'react';
import { FormItem } from 'amis';

//@ts-ignore
@FormItem({
  type: 'my-formitem'
})
class MyFormItem extends React.Component {
  render() {
    const {value, onChange}:any = this.props;

    return (
      <div>
        <p>这个是个自定义组件</p>
        <p>当前值：{value}</p>
        <a
          className="btn btn-default"
          onClick={() => onChange(Math.round(Math.random() * 10000))}
        >
          随机修改
        </a>
      </div>
    );
  }
}