import {types, getEnv, Instance} from 'mobx-state-tree';
export const PageNodeStore = types
  .model('PageNode', {
    applicationId: types.number,
    children: types.array(types.frozen({})),
    describe: types.string,
    hasSchema: types.boolean,
    icon: types.string,
    id: types.number,
    isDeleted: types.boolean,
    label: types.string,
    name: types.string,
    nameCh: types.string,
    parentId: types.number,
    path: types.string,
    value: types.number,
    version: types.string
  })
  .views(self => ({}))
  .actions(self => {
    return {

    };
  });

export type IPageNodeStore = Instance<typeof PageNodeStore>;
