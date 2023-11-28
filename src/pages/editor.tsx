import React from 'react';
import {toast, Select, Button} from 'amis';
import {currentLocale} from 'i18n-runtime';
import {inject, observer} from 'mobx-react';
import {Editor, ShortcutKey} from 'amis-editor';
import {RouteComponentProps} from 'react-router-dom';
import {StoreType} from '@/store';
import {Icon} from '@/icons/index';
import { updatePageSchemaById } from '@/api/PageSchema';
import { injectContext, injectData } from '@/utils/inject';
import { env } from '@/utils';

const editorLanguages = [
  {
    label: '简体中文',
    value: 'zh-CN'
  },
  {
    label: 'English',
    value: 'en-US'
  }
];

export default inject('store')(
  observer(function ({
    store,
    location,
    history,
  }: {store: StoreType} & RouteComponentProps<{id: string}>) {
    const currentLanguage = currentLocale(); // 获取当前语料类型

    /** 保存当前schema到服务器 */
    async function saveSchema() {
      const res = await updatePageSchemaById({
        id: store.currentNodeId,
        schema: JSON.stringify(store.currentSchema),
      })
      if (res.code == 1) {
        store.updateHaveNotSave(false);
        toast.success('保存成功', '提示');
      }
    }

    /** 实时更新当前schema */
    function onSchemaChange(value: any) {
      store.updateHaveNotSave(true);
      store.updateCurrentSchema(value);
    }

    /** 语言切换 */
    function onLocaleChange(value: string) {
      localStorage.setItem('suda-i18n-locale', value);
      window.location.reload();
    }

    return (
      <div className="Editor-Demo">
        <div className="Editor-header">
          <div className="Editor-title">Amis 可视化编辑器</div>
          <div className="Editor-view-mode-group-container">
            <div className="Editor-view-mode-group">
              <div
                className={`Editor-view-mode-btn editor-header-icon ${
                  !store.isMobile ? 'is-active' : ''
                }`}
                onClick={() => {
                  store.setIsMobile(false);
                }}
              >
                <Icon icon="pc-preview" title="PC模式" />
              </div>
              <div
                className={`Editor-view-mode-btn editor-header-icon ${
                  store.isMobile ? 'is-active' : ''
                }`}
                onClick={() => {
                  store.setIsMobile(true);
                }}
              >
                <Icon icon="h5-preview" title="移动模式" />
              </div>
            </div>
          </div>

          <div className="Editor-header-actions">
            <ShortcutKey />
            <Select
              className="margin-left-space"
              options={editorLanguages}
              value={currentLanguage}
              clearable={false}
              onChange={(e: any) => onLocaleChange(e.value)}
            />
            <Button
              size="sm"
              className={`mr-1 ml-3 px-6`}
              level={store.haveNotSave? 'danger':''}
              disabled={!store.haveNotSave}
              onClick={saveSchema}
            >
              保存
            </Button>
            <div
              className={`header-action-btn m-1 ${
                store.isPreview ? 'primary' : ''
              }`}
              onClick={() => {
                store.setPreview(!store.isPreview);
              }}
            >
              {store.isPreview ? '编辑' : '预览'}
            </div>
            {!store.isPreview && (
              <div className={`header-action-btn exit-btn`} onClick={()=>history.push(location.pathname.replace(`/editor`, `/preview`) )}>
                退出
              </div>
            )}
          </div>
        </div>
        <div className="Editor-inner">
          <Editor
            className="is-fixed"
            theme={'cxd'}
            isMobile={store.isMobile}
            preview={store.isPreview}
            value={store.currentSchema}
            onChange={onSchemaChange}
            onPreview={() => {store.setPreview(true);}}
            onSave={saveSchema}
            showCustomRenderersPanel={true}
            amisEnv={{
              fetcher: store.fetcher,
              notify: store.notify,
              alert: store.alert,
              copy: store.copy,
              /** 显示调试工具 */
              enableAMISDebug: ['localhost', 'test'].includes(env),
              /** 页面交互行为追踪（调试） */
              tracker: ['localhost', 'test'].includes(env) ? (eventTrack, props) => {
                console.log('>>>', eventTrack, props);
              } : () => void 0,
            }}
            data={{
              /** //TODO context是这样注入吗？ */
              ...injectContext({store}),
              ...injectData({store, location}),
            }}
          />
        </div>
      </div>
    );
  })
);
