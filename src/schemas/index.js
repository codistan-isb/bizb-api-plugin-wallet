import importAsString from "@reactioncommerce/api-utils/importAsString.js";

const wallet = importAsString("./wallet.graphql");
const transaction = importAsString("./transaction.graphql");

export default [wallet, transaction];
