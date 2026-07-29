import type { ModuleDefinition } from "./types";
import { module01 } from "./module-01";
import { module02 } from "./module-02";
import { module03 } from "./module-03";
import { module04 } from "./module-04";
import { module05 } from "./module-05";
import { module06 } from "./module-06";
import { module07 } from "./module-07";
import { module08 } from "./module-08";
import { module09 } from "./module-09";
import { module10 } from "./module-10";

export const PROGRAM_MODULES: ModuleDefinition[] = [
  module01,
  module02,
  module03,
  module04,
  module05,
  module06,
  module07,
  module08,
  module09,
  module10,
];

export function getModuleBySlug(slug: string): ModuleDefinition | undefined {
  return PROGRAM_MODULES.find((module) => module.slug === slug);
}

export function getModuleByWeek(week: number): ModuleDefinition | undefined {
  return PROGRAM_MODULES.find((module) => module.week === week);
}

export * from "./types";
