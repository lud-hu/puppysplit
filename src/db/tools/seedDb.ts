import { db } from "../index";
import { expenseParticipants, expenses, puppies, users } from "../schema";

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
  .insert(expenses)
  .values([
    {
      id: 1,
      amount: 12,
      payerId: 1,
      puppyId: PUPPY_ID,
      title: "Beer",
      date: new Date(),
    },
  ])
  .onConflictDoNothing()
  .run();

await db
  .insert(expenseParticipants)
  .values([
    {
      expenseId: 1,
      userId: 1,
    },
    {
      expenseId: 1,
      userId: 2,
    },
  ])
  .onConflictDoNothing()
  .run();
