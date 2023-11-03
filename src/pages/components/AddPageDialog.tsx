/**
 * 添加页面（节点）弹窗
 */
import {schema2component} from '@/components/SchemaRender';
import { injectContext } from '@/utils/inject';

export default schema2component(
  {
    type: 'page',
    body: [
      {
        type: 'dialog',
        title: '新增菜单',
        body: {
          type: 'form',
          controls: [
            {
              type: 'input-text',
              label: '菜单英文名',
              name: 'name',
              validations: {
                maxLength: 20
              },
              required: true
            },
            {
              type: 'input-text',
              label: '菜单中文名',
              name: 'nameCh',
              validations: {
                maxLength: 20
              },
              required: true
            },
            {
              type: "tree-select",
              label: "父节点",
              name: "parentId",
              required: false,
              source: '/api/page-node?applicationId=${store.currentApplicationId}&version=${store.currentApplicationVersion}',
            },
            //TODO图标扩展
            // {
            //   type: 'icon-picker',
            //   label: '菜单图标',
            //   name: 'icon'
            // },
          ]
        }
      }
    ]
  },
  ({onConfirm, pages, ...rest}: any) => {
    const context = injectContext({
      store: window.store
    })
    return {
      ...rest,
      data: {
        pages,
        /** 需要手动注入context */
        ...context,
      },
      onConfirm: (values: Array<any>) => onConfirm && onConfirm(values[0])
    };
  }
);
