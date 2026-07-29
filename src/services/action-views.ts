import { isPast, isToday, isThisWeek, parseISO } from "date-fns";

export interface ActionLike {
  id: string;
  status: string;
  dueDate: string | null;
  moduleSlug: string | null;
}

export type ActionView = "today" | "this-week" | "overdue" | "blocked" | "completed" | "all";

const OPEN_STATUSES = new Set(["not-started", "planned", "in-progress"]);

export function filterActionsByView<T extends ActionLike>(actions: T[], view: ActionView): T[] {
  switch (view) {
    case "today":
      return actions.filter(
        (a) => OPEN_STATUSES.has(a.status) && a.dueDate && isToday(parseISO(a.dueDate)),
      );
    case "this-week":
      return actions.filter(
        (a) =>
          OPEN_STATUSES.has(a.status) &&
          a.dueDate &&
          isThisWeek(parseISO(a.dueDate), { weekStartsOn: 1 }),
      );
    case "overdue":
      return actions.filter(
        (a) =>
          OPEN_STATUSES.has(a.status) &&
          a.dueDate &&
          isPast(parseISO(a.dueDate)) &&
          !isToday(parseISO(a.dueDate)),
      );
    case "blocked":
      return actions.filter((a) => a.status === "blocked");
    case "completed":
      return actions.filter((a) => a.status === "completed");
    case "all":
    default:
      return actions;
  }
}

export function groupActionsByModule<T extends ActionLike>(actions: T[]): Record<string, T[]> {
  return actions.reduce<Record<string, T[]>>((acc, action) => {
    const key = action.moduleSlug ?? "unassigned";
    acc[key] = acc[key] ?? [];
    acc[key].push(action);
    return acc;
  }, {});
}
