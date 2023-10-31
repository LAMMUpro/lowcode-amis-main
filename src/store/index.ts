import {types, getEnv, applySnapshot, getSnapshot, Instance, flow} from 'mobx-state-tree';
import {PageNodeStore} from './PageNode';
import {reaction} from 'mobx';
import { findManyPageNode } from '@/api/PageNode';

export const MainStore = types
  .model('MainStore', {
    /** 未知用途？？？ */
    offScreen: false,

    /** 菜单节点树 */
    pageNodes: types.optional(types.array(PageNodeStore), []),
    /** 菜单叶节点id */
    leafIds: types.optional(types.array(types.number), []),
    /** 主题（cxd-云舍 | antd） */
    theme: 'cxd',
    /** 新增页面弹窗是否显示 */
    isShowAddPageDialog: false,
    /** 编辑器中页面是否为预览态 */
    isPreview: false,
    /** 是否移动端 */
    isMobile: false,
    /** 当前选中的菜单叶节点id */
    currentNodeId: 0,
    /** 当前选中的schema */
    currentSchema: types.frozen(),
    /** schema加载中 */
    isSchemaLoading: false,
    /** 有可以保存的schema */
    haveNotSave: false,
  })
  .views(self => ({
    get fetcher() {
      return getEnv(self).fetcher;
    },
    get notify() {
      return getEnv(self).notify;
    },
    get alert() {
      return getEnv(self).alert;
    },
    get copy() {
      return getEnv(self).copy;
    }
  }))
  .actions(self => {
    function updateHaveNotSave(value: boolean) {
      self.haveNotSave = value;
    }
    
    function toggleOffScreen() {
      self.offScreen = !self.offScreen;
    }

    function toggleAddPageDialogShow(isShow: boolean) {
      self.isShowAddPageDialog = isShow;
    }

    /** 更新菜单节点 */
    const updatePageNodes = flow (function *() {
      const res = yield findManyPageNode({
        applicationId: 1,
        version: '1.0.0'
      });
      if (res.code == 1 && res.data?.[0]) {
        self.pageNodes.splice(0, 1, res.data[0]);
        self.leafIds = res.leafIds;
      }
    })

    function setPreview(value: boolean) {
      self.isPreview = value;
    }

    function setIsMobile(value: boolean) {
      self.isMobile = value;
    }

    function updateCurrentNodeId(value: number) {
      self.currentNodeId = value;
    }

    function updateCurrentSchema(value: number) {
      self.currentSchema = value;
    }

    function updateSchemaLoading(value: boolean) {
      self.isSchemaLoading = value;
    }

    return {
      updateHaveNotSave,
      updateCurrentNodeId,
      updateCurrentSchema,
      updateSchemaLoading,
      toggleOffScreen,
      toggleAddPageDialogShow,
      setPreview,
      setIsMobile,
      updatePageNodes,
      afterCreate() {
        if (typeof window !== 'undefined' && window.localStorage) {
          const storeData = window.localStorage.getItem('store');
          if (storeData) applySnapshot(self, JSON.parse(storeData));

          reaction(
            () => getSnapshot(self),
            json => {
              window.localStorage.setItem('store', JSON.stringify(json));
            }
          );
        }
      }
    };
  });

export type StoreType = Instance<typeof MainStore>;
