import { z } from 'zod';
import { procedure, router } from '../trpc';
import { ApplicationZod } from '../types/zod';
import { addApplication, deleteApplicationById, getApplicationList, updateApplicationById } from '../service/application';
import { ApplicationCreateZod, ApplicationUpdateZod } from '../types/zodExt/Application';
import { getDefaultFailResponse, getDefaultPageResponse, getDefaultResponse } from '../utils';
import { ApiPageResponseZod, ApiResponseZod, PageInfoQueryZod } from '../types';

export const applicationRouter = router({
  /** 新增应用 */
  addRecord: procedure
    .meta({
      description: "新增应用"
    })
    .input(ApplicationCreateZod)
    .mutation(async ({ input }) => {
      const res = await addApplication(input);
      if (res?.id) return getDefaultResponse();
      return getDefaultFailResponse();
    }),
  /** 根据id删除应用 */
  deleteRecodeById: procedure
    .meta({
      description: "删除应用"
    })
    .input(ApplicationZod.pick({ id: true }))
    .mutation(async ({ input }) => {
      const res = await deleteApplicationById(input.id);
      if (res.id === input.id) return getDefaultResponse();
      return getDefaultFailResponse();
    }),
  /** 获取全部应用列表 */
  getList: procedure
    .meta({
      description: "获取全部应用列表"
    })
    .output(ApiResponseZod(z.array(ApplicationZod)))
    .query(async () => {
      const list = await getApplicationList();
      return getDefaultResponse(list);
    }),
  /** 分页获取应用列表 */
  getListByPage: procedure
    .meta({
      description: "分页获取应用列表"
    })
    .input(PageInfoQueryZod)
    .output(ApiPageResponseZod(ApplicationZod))
    .query(async ({ input }) => {
      const list = await getApplicationList();
      return getDefaultPageResponse(input, list, 1000);
    }),
  /** 更新应用信息 */
  updateRecord: procedure
    .meta({
      description: '更新应用信息'
    })
    .input(ApplicationUpdateZod)
    .output(ApiResponseZod())
    .mutation(async ({ input }) => {
      const res = await updateApplicationById(input);
      if (res.id == input.id) return getDefaultResponse();
      return getDefaultFailResponse();
    }),
});
