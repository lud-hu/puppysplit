import { db } from "../index";
import { expenseParticipants, expenses, puppies, users } from "../schema";

await db.delete(expenseParticipants).run();
await db.delete(expenses).run();
await db.delete(users).run();
await db.delete(puppies).run();
