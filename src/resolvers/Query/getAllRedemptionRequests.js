import ReactionError from "@reactioncommerce/reaction-error";
export default async function getAllRedemptionRequests(parent, args, context, info) {
  let { account } = context;
  if (account === null || account === undefined) {
    throw new ReactionError("access-denied", "Access Denied");
  }

const request = await context.queries.getAllRedemptionRequests(parent, args, context, info);
    return request;
}
