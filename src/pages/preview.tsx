import React from 'react';
import {Link} from 'react-router-dom';
import {observer, inject} from 'mobx-react';
import {Button, AsideNav, Layout, confirm} from 'amis';
import {RouteComponentProps, matchPath, Switch, Route} from 'react-router';
import {StoreType} from '@/store';
import NotFound from '@/pages/404';
import defaultSchema from '@/schema/default.json';
import SchemaRender from '@/components/SchemaRender';
import AddPageDialog from '@/pages/components/AddPageDialog';

function isActive(link: any, location: any) {
  const ret = matchPath(location?.pathname, {
    path: link ? '/preview' + link.replace(/\?.*$/, '') : '',
    exact: true,
    strict: true
  });

  return !!ret;
}

export default inject('store')(
  observer(function ({
    store,
    location,
    history
  }: {store: StoreType} & RouteComponentProps) {
    /** 预览页头部 */
    function renderHeader() {
      return (
        <>
          <div className="preview header">
            <div className="cxd-Layout-brand text-ellipsis">
              <i className="fa fa-tv"></i>
              <span className="hidden-folded m-l-sm">应用名称</span>
            </div>
            <div className="">
              <div className="hidden-xs p-t-sm ml-auto px-2">
                <Button
                  size="sm"
                  level="info"
                  onClick={() => store.setAddPageIsOpen(true)}
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
      const navigations = store.pages.map(item => ({
        label: item.label,
        path: `/${item.path}`,
        icon: item.icon
      }));
      const paths = navigations.map(item => item.path);

      return (
        <AsideNav
          key={store.asideFolded ? 'folded-aside' : 'aside'}
          navigations={[
            {
              label: '导航菜单',
              children: navigations
            }
          ]}
          renderLink={({link, toggleExpand, classnames: cx, depth}: any) => {
            if (link.hidden) {
              return null;
            }

            let children = [];

            if (link.children) {
              children.push(
                <span
                  key="expand-toggle"
                  className={cx('AsideNav-itemArrow')}
                  onClick={e => toggleExpand(link, e)}
                ></span>
              );
            }

            link.badge &&
              children.push(
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

            if (link.icon) {
              children.push(
                <i key="icon" className={cx(`AsideNav-itemIcon`, link.icon)} />
              );
            } else if (store.asideFolded && depth === 1) {
              children.push(
                <i
                  key="icon"
                  className={cx(
                    `AsideNav-itemIcon`,
                    link.children ? 'fa fa-folder' : 'fa fa-info'
                  )}
                />
              );
            }

            link.active ||
              children.push(
                <i
                  key="delete"
                  data-tooltip="删除"
                  data-position="bottom"
                  className={'navbtn fa fa-times'}
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    confirm('确认要删除').then(confirmed => {
                      confirmed && store.removePageAt(paths.indexOf(link.path));
                    });
                  }}
                />
              );

            children.push(
              <i
                key="edit"
                data-tooltip="编辑"
                data-position="bottom"
                className={'navbtn fa fa-pencil'}
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  history.push(`/edit/${paths.indexOf(link.path)}`);
                }}
              />
            );

            children.push(
              <span key="label" className={cx('AsideNav-itemLabel')}>
                {link.label}
              </span>
            );

            return link.path ? (
              link.active ? (
                <a>{children}</a>
              ) : (
                <Link to={`/preview${link.path}`}>
                  {children}
                </Link>
              )
            ) : (
              <a
                onClick={
                  link.onClick
                    ? link.onClick
                    : link.children
                    ? () => toggleExpand(link)
                    : undefined
                }
              >
                {children}
              </a>
            );
          }}
          isActive={(link: any) =>
            isActive(
              link.path && link.path[0] === '/' ? link.path : `${link.path}`,
              location
            )
          }
        />
      );
    }

    /** 新增页面, 确定 */
    function handleConfirm(value: {label: string; icon: string; path: string}) {
      store.addPage({
        ...value,
        schema: defaultSchema
      });
      store.setAddPageIsOpen(false);
    }

    return (
      <Layout
        aside={renderAside()}
        header={renderHeader()}
        folded={store.asideFolded}
        offScreen={store.offScreen}
      >
        {/* 预览区 */}
        <Switch>
          {store.pages.map((item: any) => (
            <Route
              key={item.id}
              path={`/preview/${item.path}`}
              render={() => <SchemaRender schema={item.schema} />}
            />
          ))}
          <Route component={NotFound} />
        </Switch>
        {/* 新增页面弹窗 */}
        <AddPageDialog
          show={store.addPageIsOpen}
          onClose={() => store.setAddPageIsOpen(false)}
          onConfirm={handleConfirm}
          pages={store.pages.concat()}
        />
      </Layout>
    );
  })
);
