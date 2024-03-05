import ReactionError from "@reactioncommerce/reaction-error";

export default async function makeTransaction(parent, args, context, info) {
  const { collections } = context;
  const { Wallets } = collections;
  const { userId, transactions, amount } = args;
  console.log("userId", userId);
  console.log("transactions", transactions);
  console.log("amount", amount);

  // Validate input
  if (!userId || !transactions || !amount) {
    throw new ReactionError(
      "Invalid Input",
      "Invalid input. Please provide userId, transactionType, and amount."
    );
  }

  try {
    // Find the wallet by user ID
    const wallet = await Wallets.findOne({ userId: userId });

    if (!wallet) {
      throw new ReactionError("Not found", "Wallet not found.");
    }

    // Update the wallet based on the transaction type
    if (transactions === "inBound") {
      wallet.amount += amount;
      wallet.transactions = "inBound";
    } else if (transactions === "outBound") {
      if (wallet.amount < amount) {
        throw new ReactionError("Insufficient funds for outbound transaction.");
      }
      wallet.amount -= amount;
      wallet.transactions = "outBound";
      
      // Move amount to escrow for outbound transaction
      if (!wallet.escrow) {
        wallet.escrow = amount;
      } else {
        wallet.escrow += amount;
      }
    } else {
      throw new ReactionError(
        "Invalid transaction type",
        'Invalid transaction type. Use "INBOUND" or "OUTBOUND".'
      );
    }

    // Save the updated wallet
    await Wallets.updateOne({ _id: wallet._id }, { $set: { ...wallet } });
    console.log("wallet", wallet);

    return wallet;
  } catch (error) {
    console.error("Error making transaction:", error);
    throw new ReactionError(
      "Failed to make transaction ",
      "Failed to make transaction."
    );
  }
}
