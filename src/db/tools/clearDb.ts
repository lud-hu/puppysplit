import { db } from "../index";
import { creditorsToDebts, debts, puppies, users } from "../schema";

await db.delete(creditorsToDebts).run();
await db.delete(debts).run();
await db.delete(users).run();
await db.delete(puppies).run();
