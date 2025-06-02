import { db } from "@/modules/database/lib/db";
import { Profile, profiles } from "@/modules/database/lib/schema";

export async function upsertProfile(profile: Profile) {
  try {
    // Perform upsert and get the result in one operation
    const [result] = await db
      .insert(profiles)
      .values(profile)
      .onConflictDoUpdate({
        target: profiles.id,
        set: {
          email: profile.email,
          username: profile.username,
          avatarUrl: profile.avatarUrl,
        },
      })
      .returning();

    return { data: result, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
