export default async function createWallet(parent, args, context, info) {
    const { userId } = context.request;
    if (!userId) {
        throw new Error('You must be signed in to create a wallet');
    }
    
    const wallet = await context.db.mutation.createWallet(parent, args, context, info);
    
    return wallet;
    }