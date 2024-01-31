export default async function createWallet(parent, args, context, info) {
    const {  collections } = context;
    const { Wallet } = collections;
    if (!args.userId || !args.amount || !args.paymentProcessor) {
        throw new Error('Invalid input. Please provide userId, amount, and paymentProcessor.');
      }
      console.log('args', args);
        const wallet = await Wallet.insert({
            ...args,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        console.log('wallet', wallet);  
        return wallet;
        

}