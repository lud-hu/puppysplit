import type { User } from "../db/schema";

/**
 * Resolves the user ids an expense is split between, from the raw
 * form values of the add-expense form.
 *
 * With splitSetting "betweenAll" every user of the puppy participates.
 * Otherwise `participantIds` holds the selected user ids — a single
 * string when one checkbox is ticked, an array when several are.
 */
export function resolveParticipantIds(
  splitSetting: "betweenAll" | "notBetweenAll",
  participantIds: string | string[] | undefined,
  users: User[]
): number[] {
  if (splitSetting === "betweenAll") {
    if (users.length === 0) {
      throw new Error("No members to split the expense between");
    }
    return users.map((u) => u.id);
  }

  if (!participantIds) {
    throw new Error(
      'Either splitSetting="betweenAll" or participantIds must be set'
    );
  }

  const selected = Array.isArray(participantIds)
    ? participantIds
    : [participantIds];
  if (
    new Set(selected).size !== selected.length ||
    selected.some((id) => !users.some((user) => user.id.toString() === id))
  ) {
    throw new Error("Select unique participants belonging to this puppy");
  }
  const resolved = users
    .filter((u) => selected.includes(u.id.toString()))
    .map((u) => u.id);

  if (resolved.length === 0) {
    throw new Error("No valid participants selected");
  }

  return resolved;
}
