import { expect, test } from "bun:test";
import getPuppyIcon from "./getPuppyIcon";

test("get proper icon", () => {
  expect(getPuppyIcon(1)).toStrictEqual("🐕");
  expect(getPuppyIcon(2)).toStrictEqual("🦮");
  expect(getPuppyIcon(3)).toStrictEqual("🐩");
  expect(getPuppyIcon(4)).toStrictEqual("🐾");
  expect(getPuppyIcon(5)).toStrictEqual("🐶");
  expect(getPuppyIcon(6)).toStrictEqual("🦴");
  expect(getPuppyIcon(7)).toStrictEqual("🐕");
  expect(getPuppyIcon(8)).toStrictEqual("🦮");
  expect(getPuppyIcon(9)).toStrictEqual("🐩");
  expect(getPuppyIcon(10)).toStrictEqual("🐾");
  expect(getPuppyIcon(11)).toStrictEqual("🐶");
  expect(getPuppyIcon(12)).toStrictEqual("🦴");
  expect(getPuppyIcon(13)).toStrictEqual("🐕");
  expect(getPuppyIcon(14)).toStrictEqual("🦮");
  expect(getPuppyIcon(15)).toStrictEqual("🐩");
  expect(getPuppyIcon(16)).toStrictEqual("🐾");
  expect(getPuppyIcon(17)).toStrictEqual("🐶");
  expect(getPuppyIcon(18)).toStrictEqual("🦴");
});
