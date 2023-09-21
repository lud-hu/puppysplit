import { db } from "../index";
import { creditorsToDebts, debts, puppies, users } from "../schema";

await db
  .insert(puppies)
  .values([
    {
      id: 1,
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
      puppyId: 1,
      id: 1,
    },
    {
      name: "Bob",
      puppyId: 1,
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
      puppyId: 1,
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
