import * as React from 'react';
import ReactDOM from 'react-dom';
import {setDefaultTheme} from 'amis';
import App from '@/App';
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/css/v4-shims.css';
import 'amis/lib/themes/cxd.css';
import 'amis/lib/helper.css';
import 'amis/sdk/iconfont.css';
import 'amis-editor-core/lib/style.css';
import '@/scss/style.scss';
/** 修改组件默认样式 */
import '@/scss/fix-amis.scss';
/** 加载自定义组件 */
import './custom-components';

setDefaultTheme('cxd');

// react < 18
ReactDOM.render(<App />, document.getElementById('root'));
