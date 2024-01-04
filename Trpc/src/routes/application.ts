import { z } from 'zod';
import { prisma } from '../../prisma/prisma.service';
import { procedure, router } from '../trpc';
import { ApplicationZod } from '../types/zod';

export const applicationRouter = router({
  /** 获取应用列表 */
  pageList: procedure
    .meta({
      description: "获取应用列表"
    })
    .output(z.array(ApplicationZod))
    .query(async () => {
      const list = await prisma.application.findMany({
        where: {
          isDeleted: false
        }
      });
      return list;
    }),
});
