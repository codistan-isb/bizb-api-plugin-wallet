import ReactionError from "@reactioncommerce/reaction-error";

export default async function updateWalletAmount(parent, args, context, info) {
  const { collections } = context;
  const { Wallets } = collections;
  const { userId, newAmount, type } = args;

  // Validate input
  if (!userId || !newAmount) {
    throw new ReactionError(
      "Invalid input",
      "Invalid input. Please provide userId and newAmount."
    );
  }

  try {
    // Find the wallet by user ID
    const wallet = await Wallets.findOne({ userId: userId });

    if (!wallet) {
      throw new ReactionError("Wallet not found.", "Wallet not found.");
    }
if( type == "Refund"){
  console.log("type", type);
    // Validate if there's enough amount in escrow for refund
    if (!wallet.escrow || wallet.escrow < newAmount) {
      throw new ReactionError("Insufficient funds in escrow for refund.");
    }

    // Update wallet amount and escrow
    wallet.amount += newAmount;
    wallet.escrow -= newAmount;

    // Save the updated wallet
    const updatedWallet = await Wallets.updateOne(
      { _id: wallet._id },
      {transactions:"inBound"},
      { $set: { amount: wallet.amount, escrow: wallet.escrow } }
    );

    console.log("updatedWallet", updatedWallet);

    return wallet;}
    else {
      console.log("type", type);
      // Subtract the amount from the wallet escrow
      wallet.escrow -= newAmount;

      // Save the updated wallet
      const updatedWallet = await Wallets.updateOne(
        { _id: wallet._id },
        { transactions: "outBound" },
        { $set: { escrow: wallet.escrow } }
      );

      console.log("updatedWallet", updatedWallet);

      return wallet;
    }
  } catch (error) {
    console.error("Error updating wallet amount:", error);
    throw new ReactionError(
      "Failed to update wallet amount.",
      "Failed to update wallet amount."
    );
  }
}
