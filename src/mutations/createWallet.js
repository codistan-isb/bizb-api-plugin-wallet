export default async function createWallet(parent, args, context, info) {
    const {  collections } = context;
    const { Wallets } = collections;
    if (!args.userId || !args.amount || !args.paymentProcessor) {
        throw new Error('Invalid input. Please provide userId, amount, and paymentProcessor.');
      }
      console.log('args', args);
        const wallet = await Wallets.insert({
            ...args,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        console.log('wallet', wallet.ops[0]);  
        const wallets = wallet.ops[0];
        return wallets;
        

}