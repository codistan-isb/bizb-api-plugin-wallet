import ReactionError from "@reactioncommerce/reaction-error";
export default async function updateWalletAmount(parent, args, context, info) {
  const { collections } = context;
  const { Wallets } = collections;
  const { userId, newAmount } = args;

  // Validate input
  if (!userId || !newAmount) {
    throw new ReactionError(
      "Invalid input",
      "Invalid input. Please provide userId and newAmount."
    );
  }

  try {
    // Find the wallet by user ID and update the amount
    const updatedWallet = await Wallets.findOneAndUpdate(
      { userId: userId },
      { $set: { amount: newAmount } },
      { new: true } // Return the updated document
    );
    console.log("updatedWallet", updatedWallet);
    if (!updatedWallet) {
      throw new ReactionError("Wallet not found.", "Wallet not found.");
    }

    return updatedWallet.value;
  } catch (error) {
    console.error("Error updating wallet amount:", error);
    throw new ReactionError(
      "Failed to update wallet amount.",
      "Failed to update wallet amount."
    );
  }
}
