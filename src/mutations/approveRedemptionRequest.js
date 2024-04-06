import ReactionError from "@reactioncommerce/reaction-error";
import pkg from 'mongodb'; // or ObjectID 
const {ObjectId}=pkg;
export default async function approveRedemptionRequest(parent, args, context) {

    const { collections } = context;
    const { Redemption, Wallets } = collections;
    const _id = args._id;
    const userId = args.userId
    console.log("args", args);
    console.log("_id", _id);
    // var o_id = new ObjectId(_id);
    const redemption = await Redemption.findOne({ _id: new ObjectId(_id)});
    console.log("redemption", redemption);
    
    if (!redemption) {
        throw new Error("Redemption request not found");
    }
   if(redemption.status === "APPROVED"|| redemption.status === "REJECTED"){
         throw new Error("Redemption request already " + redemption.status);
    }
   const updateRedemption =  await Redemption.updateOne(
    { _id: new ObjectId(_id) },
    { $set: { status: "APPROVED" } }
)
   console.log("updateRedemption", updateRedemption);
   if (updateRedemption.nModified === 0) {
    throw new Error("Failed to update redemption request");
}

const redemptionUser =  await Redemption.findOne({ _id: new ObjectId(_id)});
    // Deduct the redeemed amount from the user's wallet
    const WalletuserId = redemption.userId;
    const amount = redemption.RedemptionAmount;
    console.log("amount", amount);

    // Find the user's wallet
    const userWallet = await Wallets.findOne({ userId: WalletuserId });

    // Check if the user's wallet exists
    if (!userWallet) {
        throw new Error("User's wallet not found");
    }

    const updateWallet =await Wallets.updateOne(
        { userId },
        { $inc: { escrow: -amount } } // Decrease the amount by the redeemed amount
    );
    console.log("updateWallet", updateWallet);
    if (updateWallet.nModified === 0) {
        throw new Error("Failed to update user's wallet");
    }

    return redemptionUser;
}
