export default async function updateWalletAmount(parent, args, context, info) {
    const { collections } = context;
    const { Wallets } = collections;
    const { userId, newAmount } = args;
  
    // Validate input
    if (!userId || !newAmount) {
      throw new Error('Invalid input. Please provide userId and newAmount.');
    }
  
    try {
      // Find the wallet by user ID and update the amount
      const updatedWallet = await Wallets.findOneAndUpdate(
        { userId: userId },
        { $set: { amount: newAmount } },
        { new: true } // Return the updated document
      );
  
      if (!updatedWallet) {
        throw new Error('Wallet not found.');
      }
  
      return updatedWallet;
    } catch (error) {
      console.error('Error updating wallet amount:', error);
      throw new Error('Failed to update wallet amount.');
    }
  }
  