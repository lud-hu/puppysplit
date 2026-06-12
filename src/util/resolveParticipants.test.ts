import { expect, test } from "bun:test";
import type { User } from "../db/schema";
import { resolveParticipantIds } from "./resolveParticipants";

const users: User[] = [
  { id: 1, name: "Alice", puppyId: "p", payPalHandle: null },
  { id: 2, name: "Bob", puppyId: "p", payPalHandle: null },
  { id: 3, name: "Carol", puppyId: "p", payPalHandle: null },
];

test("betweenAll selects every user", () => {
  expect(resolveParticipantIds("betweenAll", undefined, users)).toStrictEqual([
    1, 2, 3,
  ]);
});

test("betweenAll ignores explicitly passed participantIds", () => {
  expect(resolveParticipantIds("betweenAll", ["2"], users)).toStrictEqual([
    1, 2, 3,
  ]);
});

test("an array of ids selects those users", () => {
  expect(
    resolveParticipantIds("notBetweenAll", ["1", "3"], users)
  ).toStrictEqual([1, 3]);
});

test("a single id string selects that user", () => {
  expect(resolveParticipantIds("notBetweenAll", "2", users)).toStrictEqual([2]);
});

test("ids not belonging to the puppy are ignored", () => {
  expect(
    resolveParticipantIds("notBetweenAll", ["2", "999"], users)
  ).toStrictEqual([2]);
});

test("missing participantIds throws", () => {
  expect(() =>
    resolveParticipantIds("notBetweenAll", undefined, users)
  ).toThrow();
});

test("only unknown ids throws", () => {
  expect(() => resolveParticipantIds("notBetweenAll", ["999"], users)).toThrow(
    "No valid participants selected"
  );
});
