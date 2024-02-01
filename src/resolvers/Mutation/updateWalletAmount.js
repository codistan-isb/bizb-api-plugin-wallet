export default async function updateWalletAmount(parent, args, context, info) {
    const { userId } = context.request;
    if (!userId) {
        throw new Error('You must be signed in to update a wallet');
    }
    const walletUpdate = await context.mutations.updateWalletAmount(parent, args, context, info);
    return walletUpdate;
    }
    