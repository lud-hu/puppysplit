import { Elysia, t } from "elysia";
import BaseHtml from "../../../components/BaseHtml";
import NotFoundPage from "../../../components/NotFoundPage";
import PuppyHeader from "../../../components/PuppyHeader";
import SettlementList from "../../../components/SettlementList";
import { getPuppyUsers, getPuppyWithExpenses } from "../../../db/queries";
import {
  expensesToTransfers,
  settleTransfers,
} from "../../../util/settleExpenses";

const puppySettleRoutes = new Elysia().get(
  "/puppies/:id/settle",
  async ({ params, set }) => {
    const puppy = await getPuppyWithExpenses(params.id);

    if (!puppy) {
      set.status = 404;
      return <NotFoundPage />;
    }

    const users = await getPuppyUsers(params.id);

    return (
      <BaseHtml pageTitle={puppy.title + " - Puppysplit"}>
        <PuppyHeader
          title={puppy.title}
          users={users}
          backLink={`/puppies/${puppy.id}`}
        />
        <SettlementList
          transfers={settleTransfers(expensesToTransfers(puppy.expenses))}
          users={users}
          puppyId={puppy.id}
        />
      </BaseHtml>
    );
  },
  {
    params: t.Object({
      id: t.String(),
    }),
  }
);

export default puppySettleRoutes;
