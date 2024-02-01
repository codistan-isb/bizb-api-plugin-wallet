import ReactionError from "@reactioncommerce/reaction-error";
export default async function getWalletsByUserId(parent, args, context, info) {
    let { account } = context;
    if (account === null || account === undefined) {
        throw new ReactionError("access-denied", "Access Denied");
    }
    
    const wallet = await context.queries.getWalletsByUserId(parent, args, context, info);
    
    return wallet;

 }