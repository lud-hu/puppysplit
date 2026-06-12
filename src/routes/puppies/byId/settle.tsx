import { Elysia, t } from "elysia";
import BaseHtml from "../../../components/BaseHtml";
import DebtSettlementList from "../../../components/DebtSettlementList";
import PuppyHeader from "../../../components/PuppyHeader";
import { getPuppyUsers, getPuppyWithDebts } from "../../../db/queries";
import { settleDebts, unifyDebts } from "../../../util/settleDebts";

const puppiesByIndexSettleRoutes = new Elysia().get(
  "/puppies/:id/settle",
  async ({ params }) => {
    const puppy = await getPuppyWithDebts(params.id);

    if (!puppy) {
      return <div>Not found</div>;
    }

    const users = await getPuppyUsers(params.id);

    return (
      <BaseHtml pageTitle={puppy.title + " - Puppysplit"}>
        <PuppyHeader
          title={puppy.title}
          users={users}
          backLink={`/puppies/${puppy.id}`}
        />
        <DebtSettlementList
          settleDebts={settleDebts(unifyDebts(puppy.debts))}
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

export default puppiesByIndexSettleRoutes;
