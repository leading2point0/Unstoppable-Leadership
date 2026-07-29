"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth-guard";
import { saveWeeklyReview } from "@/repositories/weekly-reviews";
import { weeklyReviewSchema, type WeeklyReviewInput } from "@/schemas/weekly-review";

export async function saveWeeklyReviewAction(input: WeeklyReviewInput) {
  const user = await requireUser();
  const parsed = weeklyReviewSchema.parse(input);
  const review = await saveWeeklyReview(user.id, parsed);
  revalidatePath(`/program/${input.programId}/weekly-review`);
  revalidatePath(`/program/${input.programId}/scorecard`);
  revalidatePath("/dashboard");
  return review;
}
