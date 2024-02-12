import ReactionError from "@reactioncommerce/reaction-error";
export default async function createWallet(parent, args, context, info) {
  let { account } = context;
  if (account === null || account === undefined) {
    throw new ReactionError("access-denied", "Access Denied");
  }

  const wallet = await context.mutations.createWallet(
    parent,
    args,
    context,
    info
  );

  return wallet;
}
