import {types, getEnv, applySnapshot, getSnapshot, Instance, flow} from 'mobx-state-tree';
import {PageNodeStore} from './PageNode';
import {reaction} from 'mobx';
import { findManyPageNode } from '@/api/PageNode';
import { findAllApplication } from '@/api/Application';
import noPageSchema from '@/schema/noPage.json';

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
    /** 环境管理弹窗是否显示 */
    isShowEnvDialog: false,
    /** 编辑器中页面是否为预览态 */
    isPreview: false,
    /** 是否移动端 */
    isMobile: false,
    /** 当前应用id */
    currentApplicationId: 0,
    /** 当前应用版本 */
    currentApplicationVersion: '',
    /** 当前应用名称 */
    currentApplicationName: '',
    /** 当前选中的菜单叶节点id */
    currentNodeId: 0,
    /** 当前选中的schema */
    currentSchema: types.frozen(),
    /** schema加载中 */
    isSchemaLoading: false,
    /** 有可以保存的schema */
    haveNotSave: false,

    /** 当前正在编辑的app的Id */
    currentEditAppId: 0,
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

    function toggleEnvDialogShow(isShow: boolean) {
      self.isShowEnvDialog = isShow;
    }

    /** 更新菜单节点 */
    const updatePageNodes = flow (function *() {
      const res = yield findManyPageNode({
        applicationId: self.currentApplicationId,
        version: self.currentApplicationVersion,
      });
      if (res.code == 1 && res.data?.[0]) {
        self.pageNodes = res.data;
        self.leafIds = res.leafIds;
      }
    })

    /** 清除应用菜单及叶节点数据 */
    function clearPageNodes() {
      self.pageNodes = [] as any;
      self.leafIds = [] as any;
    }

    function setPreview(value: boolean) {
      self.isPreview = value;
    }

    function setIsMobile(value: boolean) {
      self.isMobile = value;
    }

    function updateCurrentNodeId(value: number) {
      self.currentNodeId = value;
    }

    /** 无页面提示 */
    function setSchemaNopage() {
      self.currentSchema = noPageSchema;
    }

    function updateCurrentSchema(value: number) {
      self.currentSchema = value;
    }

    function updateSchemaLoading(value: boolean) {
      self.isSchemaLoading = value;
    }

    function updateApplicationId(value: number) {
      self.currentApplicationId = value;
    }

    function updateApplicationVersion(value: string) {
      self.currentApplicationVersion = value;
    }

    function updateApplicationName(value: string) {
      self.currentApplicationName = value;
    }

    function updateCurrentEditAppId(value: number) {
      self.currentEditAppId = value;
    }

    return {
      updateHaveNotSave,
      updateCurrentNodeId,
      updateCurrentSchema,
      updateSchemaLoading,
      updateApplicationId,
      updateApplicationVersion,
      updateApplicationName,
      toggleOffScreen,
      toggleAddPageDialogShow,
      toggleEnvDialogShow,
      setPreview,
      setSchemaNopage,
      setIsMobile,
      updatePageNodes,
      clearPageNodes,
      updateCurrentEditAppId,
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
