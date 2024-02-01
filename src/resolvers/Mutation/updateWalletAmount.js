import ReactionError from "@reactioncommerce/reaction-error";
export default async function updateWalletAmount(parent, args, context, info) {
    let { account } = context;
    if (account === null || account === undefined) {
        throw new ReactionError("access-denied", "Access Denied");
    }
    const walletUpdate = await context.mutations.updateWalletAmount(parent, args, context, info);
    return walletUpdate;
    }
    