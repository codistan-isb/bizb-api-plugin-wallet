export default  async function transactions(parent, args, context, info) {
    let { account } = context;
  if (account === null || account === undefined) {
    throw new ReactionError("access-denied", "Access Denied");
  }
  const transactions = await context.queries.transactions(parent, args, context, info);
    return transactions;
}