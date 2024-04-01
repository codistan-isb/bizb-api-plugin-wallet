export default async function requestRedemption(parent,args,context,info){
    let { account } = context;
  if (account === null || account === undefined) {
    throw new ReactionError("access-denied", "Access Denied");
  }
  const Redemption = await context.mutations.requestRedemption(
    parent,
    args,
    context,
    info
  );
  return Redemption;
}