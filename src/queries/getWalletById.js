export default async function getWalletById(parent, args, context, info) {
    const { userId } = args;
    if (!userId) {
        throw new Error('You must be signed in to get a wallet');
    }
    
    const wallet = await context.mutations.getWalletById(parent, args, context, info);
    
    return wallet;

 }