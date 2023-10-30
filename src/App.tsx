import React from 'react';
import {Provider} from 'mobx-react';
import {toast, alert, confirm} from 'amis';
import axios from 'axios';
import {MainStore} from '@/store/index';
import copy from 'copy-to-clipboard';
import {ToastComponent, AlertComponent, Spinner} from 'amis';
import {Route, Switch, Redirect, BrowserRouter as Router} from 'react-router-dom';
import {observer} from 'mobx-react';
import {IMainStore} from '@/store/index';
import SchemaRender from "@/components/SchemaRender";
import loginSchema from "@/schema/login.json";
import registerSchema from "@/schema/register.json";
import resetPswSchema from "@/schema/resetPsw.json";
import Page404 from '@/pages/404';
const Preview = React.lazy(() => import('@/pages/preview'));
const Editor = React.lazy(() => import('@/pages/editor'));

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
          data = JSON.stringify(data);
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

const RootRoute = observer(function ({store}: {store: IMainStore}) {
  return (
    <Router>
      <div className="routes-wrapper">
        <ToastComponent key="toast" position={'top-right'} />
        <AlertComponent key="alert" />
        <React.Suspense
          fallback={<Spinner overlay className="m-t-lg" size="lg" />}
        >
          <Switch>
            <Route path="/login" component={() => <SchemaRender schema={loginSchema}/>} />
            <Route path="/register" component={() => <SchemaRender schema={registerSchema}/>} />
            <Route path="/resetPsw" component={() => <SchemaRender schema={resetPswSchema}/>} />

            <Route path="/preview/:id" component={Preview} />
            <Route path="/edit/:id" component={Editor} />
            
            <Redirect to={`/preview/404`} from={`/`} exact />
            <Route component={Page404} />
          </Switch>
        </React.Suspense>
      </div>
    </Router>
  );
})