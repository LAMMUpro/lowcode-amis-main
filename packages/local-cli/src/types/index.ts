import { z } from 'zod';

/** 链接配置 */
const linkZod = z.object({
  /** 源目录 */
  from: z.string(),
  /** 目标目录 */
  to: z.string(),
})

export const ConfigZod = z.object({
  /** 软链接配置 */
  symlink: z.array(linkZod).optional(),
  /** 硬链接配置 */
  hardlink: z.array(linkZod).optional(),
})
export type ConfigDto = z.infer<typeof ConfigZod>;

