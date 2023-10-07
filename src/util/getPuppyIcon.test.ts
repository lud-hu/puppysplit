import { expect, test } from "bun:test";
import getPuppyIcon from "./getPuppyIcon";

test("get proper icon", () => {
  expect(getPuppyIcon("44a058d3-ef1b-4c42-9a27-d9405f58e6d6")).toStrictEqual(
    "🐕"
  );
  expect(getPuppyIcon("5f7a8b0e-1755-4382-a55b-4c076e597d99")).toStrictEqual(
    "🐶"
  );
  expect(getPuppyIcon("a037d690-d946-4b91-b685-cddffc830784")).toStrictEqual(
    "🐕"
  );
  expect(getPuppyIcon("5e9566de-77e3-468e-a6d1-93179dd6fcf9")).toStrictEqual(
    "🐩"
  );
  expect(getPuppyIcon("0e77ff72-f69c-40e5-b600-406da60a95ce")).toStrictEqual(
    "🐶"
  );
  expect(getPuppyIcon("d49097b5-eb5d-4953-860e-5ad6e061293d")).toStrictEqual(
    "🐩"
  );
  expect(getPuppyIcon("c25a6e77-fbc0-4ad9-b638-fff48bfa1ed5")).toStrictEqual(
    "🐩"
  );
});
