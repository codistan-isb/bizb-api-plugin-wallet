import ReactionError from "@reactioncommerce/reaction-error";
 export default async function rejectRedemptionRequest(parent, args, context) {
        let { account } = context;
      if (account === null || account === undefined) {
        throw new ReactionError("access-denied", "Access Denied");
      }
      const Redemption = await context.mutations.rejectRedemptionRequest(
        parent,
        args,
        context,
      );
      return Redemption;
    }