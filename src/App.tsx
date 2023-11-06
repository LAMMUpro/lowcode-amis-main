import React from 'react';
import axios from 'axios';
import copy from 'copy-to-clipboard';
import {Provider} from 'mobx-react';
import {observer} from 'mobx-react';
import {toast, alert, confirm} from 'amis';
import {ToastComponent, AlertComponent, Spinner} from 'amis';
import {Route, Switch, Redirect, BrowserRouter as Router} from 'react-router-dom';
import {MainStore} from '@/store/index';
import {StoreType} from '@/store/index';
import SchemaRender from "@/components/SchemaRender";
import loginSchema from "@/schema/login.json";
import registerSchema from "@/schema/register.json";
import resetPswSchema from "@/schema/resetPsw.json";
import indexSchema from "@/schema/index.json";
import Page404 from '@/pages/404';
import PreviewRoute from '@/pages/components/PreviewRoute';
const Preview = React.lazy(() => import('@/pages/preview'));
const Editor = React.lazy(() => import('@/pages/editor'));
const Home = React.lazy(() => import('@/pages/home'));

export default function (): JSX.Element {
  const store = ((window as any).store = MainStore.create(
    {},
    {
      fetcher: ({url, method, data, config, headers}: any) => {
        config = config || {};
        config.headers = config.headers || headers || {};
        config.withCredentials = true;

        if (method !== 'post' && method !== 'put' && method !== 'patch') {
          if (data) {
            config.params = data;
          }
          return (axios as any)[method](url, config);
        } else if (data && data instanceof FormData) {
          // config.headers = config.headers || {};
          // config.headers['Content-Type'] = 'multipart/form-data';
        } else if (
          data &&
          typeof data !== 'string' &&
          !(data instanceof Blob) &&
          !(data instanceof ArrayBuffer)
        ) {
          // data = JSON.stringify(data);
          config.headers['Content-Type'] = 'application/json';
        }

        return (axios as any)[method](url, data, config);
      },
      isCancel: (e: any) => axios.isCancel(e),
      notify: (type: 'success' | 'error' | 'info', msg: string) => {
        toast[type]
          ? toast[type](msg, type === 'error' ? '系统错误' : '系统消息')
          : console.warn('[Notify]', type, msg);
        console.log('[notify]', type, msg);
      },
      alert,
      confirm,
      copy: (contents: string, options: any = {}) => {
        const ret = copy(contents, options);
        ret &&
          (!options || options.shutup !== true) &&
          toast.info('内容已拷贝到剪切板');
        return ret;
      }
    }
  ));

  return (
    <Provider store={store}>
      <RootRoute store={store} />
    </Provider>
  );
}

const RootRoute = observer(function ({store}: {store: StoreType}) {
  return (
    <Router>
      <div className="routes-wrapper">
        <ToastComponent key="toast" position={'top-right'} />
        <AlertComponent key="alert" />
        <React.Suspense
          fallback={<Spinner overlay className="m-t-lg" size="lg" />}
        >
          <Switch>
            {/* 登录/注册/重置 */}
            <Route path="/login" exact component={() => <SchemaRender schema={loginSchema}/>} />
            <Route path="/register" exact component={() => <SchemaRender schema={registerSchema}/>} />
            <Route path="/resetPsw" exact component={() => <SchemaRender schema={resetPswSchema}/>} />

            {/* 应用列表 */}
            <Route path="/home" exact component={Home} />

            {/* 预览/编辑 */}
            <Route path="/preview" exact component={Preview} />
            <PreviewRoute path="/preview/:id" component={Preview}></PreviewRoute>
            <Route path="/editor/:path" component={Editor} />

            {/* 首页 */}
            <Route path="/" exact component={() => <SchemaRender schema={indexSchema}/>} />

            {/* 路径不存在 */}
            <Route component={Page404} />
          </Switch>
        </React.Suspense>
      </div>
    </Router>
  );
})