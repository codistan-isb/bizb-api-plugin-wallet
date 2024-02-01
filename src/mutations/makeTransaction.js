export default async function makeTransaction(parent, args, context, info) {
    const { collections } = context;
    const { Wallets } = collections;
    const { userId, transactions, amount } = args;
    console.log('userId', userId);
    console.log('transactions', transactions);
    console.log('amount', amount);
  
    // Validate input
    if (!userId || !transactions || !amount) {
      throw new Error('Invalid input. Please provide userId, transactionType, and amount.');
    }
  
    try {
      // Find the wallet by user ID
      const wallet = await Wallets.findOne({ userId: userId });
  
      if (!wallet) {
        throw new Error('Wallet not found.');
      }
  
      // Update the wallet based on the transaction type
      if (transactions === 'inBound') {
        wallet.amount += amount;
        wallet.transactions = 'inBound';
      } else if (transactions === 'outBound') {
        if (wallet.amount < amount) {
          throw new Error('Insufficient funds for outbound transaction.');
        }
        wallet.amount -= amount;
        wallet.transactions = 'outBound';
      } else {
        throw new Error('Invalid transaction type. Use "INBOUND" or "OUTBOUND".');
      }
  
      // Save the updated wallet
        await Wallets.updateOne({ _id: wallet._id }, { $set: { ...wallet } });
        console.log('wallet', wallet);
  
      return wallet;
    } catch (error) {
      console.error('Error making transaction:', error);
      throw new Error('Failed to make transaction.');
    }
  }
  