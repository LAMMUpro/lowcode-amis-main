import React from 'react';
import {observer, inject} from 'mobx-react';
import {Button, AsideNav, Layout, confirm, Spinner, toast} from 'amis';
import {RouteComponentProps, matchPath} from 'react-router';
import {StoreType} from '@/store';
import NotFound from '@/pages/404';
import SchemaRender from '@/components/SchemaRender';
import AddPageDialog from '@/pages/components/AddPageDialog';
import { createPageNode } from '@/api/PageNode';
import { findPageSchemaByNodeId } from '@/api/PageSchema';
import { findNode } from '@/utils';

function isActive(link: any, location: any) {
  const ret = matchPath(location?.pathname, {
    path: link ? '/preview' + link.replace(/\?.*$/, '') : '',
    exact: true,
    strict: true
  });
  return !!ret;
}

/** 首次进入/preview页面，初始化一下数据 */
let initFlag = false;
async function initData(history: any) {
  if (!window.store.currentApplicationId) {
    history.push(`/home`);
    return toast.warning('请先选择应用');
  }
  await window.store.updatePageNodes();
  /** 当前选中节点存在 -> 更新schema -> 跳转到对应路径 */
  if (window.store.currentNodeId && window.store.leafIds.includes(window.store.currentNodeId)) {
    const res = await findPageSchemaByNodeId({ nodeId: window.store.currentNodeId });
    setTimeout(()=> window.store.updateSchemaLoading(false), 250);
    if (res.code == 1) {
      window.store.updateCurrentSchema(res.data.schema);
      window.store.updateHaveNotSave(false);
      const node = findNode(window.store.pageNodes.concat(), (node: any) => node.value == window.store.currentNodeId);
      if (node) history.push(`/preview${node.path}`);
    }
  } else { /** 当前选中节点不存在 */
    const node = findNode(window.store.pageNodes.concat(), (node: any) => window.store.leafIds.includes(node.value));
    if (node) {
      const res = await findPageSchemaByNodeId({ nodeId: node.value });
      setTimeout(()=> window.store.updateSchemaLoading(false), 250);
      if (res.code == 1) {
        window.store.updateCurrentSchema(res.data.schema);
        window.store.updateHaveNotSave(false);
        window.store.updateCurrentNodeId(node.value);
        history.push(`/preview${node.path}`);
      }
    }
  }
}

export default inject('store')(
  observer(function ({
    store,
    location,
    history
  }: {store: StoreType} & RouteComponentProps) {
    if (!initFlag) {
      initData(history);
      initFlag = true;
    }
    
    /** 预览页头部 */
    function renderHeader() {
      return (
        <>
          <div className="preview header">
            <div className="cxd-Layout-brand text-ellipsis">
              <i className="fa fa-tv"></i>
              <span className="hidden-folded m-l-sm">{store.currentApplicationName || '-'}</span>
            </div>
            <div className="">
              <div className="hidden-xs p-t-sm ml-auto px-2">
                <Button
                  size="sm mr-2"
                  level="normal"
                  onClick={() => history.push('/home') }
                >
                  工作台
                </Button>
                <Button
                  size="sm"
                  level="info"
                  onClick={() => store.toggleAddPageDialogShow(true)}
                >
                  新增页面
                </Button>
              </div>
            </div>
          </div>
        </>
      );
    }

    /** 预览页侧边栏菜单 */
    function renderAside() {
      /** 菜单节点切换，获取schema并预览 */
      async function schemaChange(link: any) {
        store.updateSchemaLoading(true);
        const res = await findPageSchemaByNodeId({ nodeId: link.value });
        setTimeout(()=> store.updateSchemaLoading(false), 250);
        if (res.code == 1) {
          store.updateCurrentNodeId(res.data.nodeId);
          store.updateCurrentSchema(res.data.schema);
          store.updateHaveNotSave(false);
          history.push(`/preview${link.path}`);
        } else {
          throw '获取节点schema失败';
        }
        return `/preview${link.path}`;
      }

      /** 点击菜单节点编辑按钮 */
      function handleEdit(link: any) {
        /** 是当前预览节点 */
        if (link.value === store.currentNodeId) {
          history.push(location.pathname.replace(`/preview`, `/editor`) );
        } else { /** 不是当前预览节点 */
          schemaChange(link).then((pathname: string)=>{
            history.push(pathname.replace(`/preview`, `/editor`) );
          })
        }
      }

      return (
        <AsideNav
          // 导航菜单数据列表
          navigations={store.pageNodes}
          renderLink={({link, toggleExpand, classnames: cx, depth}: any) => {
            if (link.hidden) return null;

            let children = [];

            if (link.children?.length) {
              children.push(
                <i
                  key="icon"
                  className={cx(
                    `AsideNav-itemIcon`,
                    'fa fa-angle-down'
                  )}
                />
              );
            }

            /** 徽标 */
            if (link.badge) children.push(
              <b
                key="badge"
                className={cx(
                  `AsideNav-itemBadge`,
                  link.badgeClassName || 'bg-info'
                )}
              >
                {link.badge}
              </b>
            );

            /** 菜单图标 */
            if (link.icon) {
              children.push(
                <i key="icon" className={cx(`AsideNav-itemIcon`, link.icon)} />
              );
            }

            /** 删除图标 */
            children.push(
              <i
                key="delete"
                data-tooltip="删除"
                data-position="bottom"
                className={'navbtn fa fa-times'}
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  confirm('确认要删除').then(confirmed => {
                    confirmed && { /** TODO */};
                  });
                }}
              />
            );
            
            /** 编辑图标 */
            if (store.leafIds.includes(link.value)) children.push(
              <i
                key="edit"
                data-tooltip="编辑"
                data-position="bottom"
                className={'navbtn fa fa-pencil'}
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  handleEdit(link);
                }}
              />
            );

            /** 菜单名称 */
            children.push(
              <span key="label" className={cx('AsideNav-itemLabel')}>
                {link.nameCh}
              </span>
            );

            return (link.active || link.children?.length) ? 
              <a onClick={e => toggleExpand(link, e)}>{children}</a> : 
              <a onClick={()=>schemaChange(link)} >
                {children}
              </a>
          }}
          isActive={ (link: any) => isActive(link.path, location) }
        />
      );
    }

    /** 新增页面, 确定 */
    async function handleConfirm(value: {parentId: number; name: string; nameCh: string}) {
      const res = await createPageNode({
        ...value,
        applicationId: store.currentApplicationId,
        version: store.currentApplicationVersion,
        /** //TODO描述和图标先不要了 */
        "describe": "",
        "icon": ""
      })
      if (res.code == 1) {
        await store.updatePageNodes();
        store.toggleAddPageDialogShow(false);
      }
    }

    return (
      <Layout
        aside={renderAside()}
        header={renderHeader()}
        offScreen={store.offScreen}
        // 强制刷新视图标志
        reRenderFlag={store.leafIds.join(',')}
      >
        {/* 预览区, //TODO加载遮罩 */}
        {
          store.isSchemaLoading ? 
            <Spinner overlay size="lg" show={store.isSchemaLoading} /> :
            store.currentSchema ? 
              <SchemaRender schema={store.currentSchema} /> : 
              <NotFound />
        }
        {/* 新增页面弹窗 */}
        <AddPageDialog
          show={store.isShowAddPageDialog}
          onClose={() => store.toggleAddPageDialogShow(false)}
          onConfirm={handleConfirm}
          disabled={!store.currentApplicationId || !store.currentApplicationVersion}
        />
      </Layout>
    );
  })
);
