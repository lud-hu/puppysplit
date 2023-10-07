import { db } from "../index";
import { creditorsToDebts, debts, puppies, users } from "../schema";

const PUPPY_ID = "41e09908-ae42-4136-b0a9-ab8eb96fa9bb";
await db
  .insert(puppies)
  .values([
    {
      id: PUPPY_ID,
      title: "Test Puppy",
    },
  ])
  .onConflictDoNothing()
  .run();

await db
  .insert(users)
  .values([
    {
      name: "Alice",
      puppyId: PUPPY_ID,
      id: 1,
    },
    {
      name: "Bob",
      puppyId: PUPPY_ID,
      id: 2,
    },
  ])
  .onConflictDoNothing()
  .run();

await db
  .insert(debts)
  .values([
    {
      id: 1,
      amount: 12,
      debtorId: 1,
      puppyId: PUPPY_ID,
      title: "Beer",
      date: new Date(),
    },
  ])
  .onConflictDoNothing()
  .run();

await db
  .insert(creditorsToDebts)
  .values([
    {
      debtId: 1,
      userId: 1,
    },
    {
      debtId: 1,
      userId: 2,
    },
  ])
  .onConflictDoNothing()
  .run();
