import { router } from "../trpc";
import { ApplicationRouter, applicationRouter } from './application';
import { UserRouter, userRouter } from "./user";

export const appRouter = router<{
  /** 用户 */
  user: UserRouter
  /** 应用 */
  application: ApplicationRouter
}>({
  user: userRouter,
  application: applicationRouter,
})

export type AppRouter = typeof appRouter;