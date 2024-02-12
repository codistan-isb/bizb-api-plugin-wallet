import ReactionError from "@reactioncommerce/reaction-error";
export default async function makeTransaction(parent, args, context, info) {
  let { account } = context;
  if (account === null || account === undefined) {
    throw new ReactionError("access-denied", "Access Denied");
  }
  const transaction = await context.mutations.makeTransaction(
    parent,
    args,
    context,
    info
  );
  return transaction;
}
