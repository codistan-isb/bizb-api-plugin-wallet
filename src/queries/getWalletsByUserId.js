import ReactionError from "@reactioncommerce/reaction-error";
export default async function getWalletsByUserId(parent, args, context, info) {
  const { collections } = context;
  const { Wallets } = collections;
  const { userId } = args;

  // Validate input
  if (!userId) {
    throw new ReactionError(
      "Invalid input",
      "Invalid input. Please provide userId."
    );
  }
  console.log("userId", userId);
  try {
    // Find wallets by user ID
    const wallet = await Wallets.find({ userId: userId }).toArray();
    console.log("wallet", wallet);

    return wallet;
  } catch (error) {
    console.error("Error fetching wallets by user ID:", error);
    throw new ReactionError("Failed", "Failed to fetch wallets by user ID.");
  }
}
