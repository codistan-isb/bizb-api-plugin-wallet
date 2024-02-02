import ReactionError from "@reactioncommerce/reaction-error";
export default async function createWallet(parent, args, context, info) {
  const { collections } = context;
  const { Wallets } = collections;

  if (!args.userId || !args.amount || !args.paymentProcessor) {
    throw new ReactionError(
      "Invalid Input",
      "Invalid input. Please provide userId, amount, and paymentProcessor."
    );
  }

  // Check if a wallet already exists for the specified user
  const existingWallet = await Wallets.findOne({ userId: args.userId });

  if (existingWallet) {
    // Wallet already exists, you may choose to throw an error or return the existing wallet
    throw new ReactionError(
      "wallet exist",
      "Wallet already exists for this user."
    );
    // Alternatively, you can return the existing wallet
    // return existingWallet;
  }

  // If no existing wallet found, create a new one
  const wallet = await Wallets.insert({
    ...args,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log("New wallet created:", wallet.ops[0]);

  return wallet.ops[0];
}
