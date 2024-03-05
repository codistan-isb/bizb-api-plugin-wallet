import ReactionError from "@reactioncommerce/reaction-error";

export default async function createWallet(parent, args, context, info) {
  const { collections } = context;
  const { Wallets } = collections;
  console.log("args", args);

  if (!args.userId || args.amount === undefined || args.amount === null || !args.paymentProcessor) {
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
      "Wallet exists",
      "Wallet already exists for this user."
    );
    // Alternatively, you can return the existing wallet
  }
  

  // If no existing wallet found, create a new one
  const wallet = await Wallets.insert({
    ...args,
    createdAt: new Date(),
    updatedAt: new Date(),
    escrow: 0 // Initialize escrow to zero
  });

  console.log("New wallet created:", wallet.ops[0]);

  return wallet.ops[0];
}
