import ReactionError from "@reactioncommerce/reaction-error";
 export default async function approveRedemptionRequest(parent, args, context) {
        let { account } = context;
      if (account === null || account === undefined) {
        throw new ReactionError("access-denied", "Access Denied");
      }
      const Redemption = await context.mutations.approveRedemptionRequest(
        parent,
        args,
        context,
      );
      return Redemption;
    }