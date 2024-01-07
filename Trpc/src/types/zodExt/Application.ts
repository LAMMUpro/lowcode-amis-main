import { z } from "zod";
import { ApplicationZod } from "../zod/Application";

export const ApplicationCreateZod = ApplicationZod.pick({
  name: true,
  describe: true,
});

export type ApplicationCreateDto = z.infer<typeof ApplicationCreateZod>;

export const ApplicationUpdateZod = ApplicationZod.pick({
  id: true,
  name: true,
  describe: true,
});

export type ApplicationUpdateDto = z.infer<typeof ApplicationUpdateZod>;

