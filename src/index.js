import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pkg = require("../package.json");
import schemas from "./schemas/index.js";
import resolvers from "./resolvers/index.js";
import queries from "./queries/index.js";
import mutations from "./mutations/index.js";
import {walletCreateAuthorizedPayment}  from "./util/walletCreateAuthorizedPayment.js";
import  {walletCreateRefund}  from "./util/walletCreateRefund.js";
import walletCapturePayment from "./util/walletCapturePayment.js";
import { walletListRefunds } from "./util/walletListRefunds.js";

/**
 * @summary Import and call this function to add this plugin to your API.
 * @param {Object} app The ReactionAPI instance
 * @returns {undefined}
 */
export default async function register(app) {
  console.log("plugin wallet");
  await app.registerPlugin({
    label: pkg.label,
    name: pkg.name,
    version: pkg.version,
    collections: {
      Wallets: {
        name: "Wallets",
      },
      TransactionIncrement:{
        name:"TransactionIncrement"
      },
      Transactions:{
        name:"Transactions"
      }
    },
    graphQL: {
      schemas,
      resolvers,
    },
    paymentMethods: [{
      name: "wallet",
      canRefund: true,
      displayName: "wallet",
      functions: {
        capturePayment: walletCapturePayment ,
        createAuthorizedPayment: walletCreateAuthorizedPayment,
        createRefund: walletCreateRefund,
        listRefunds: walletListRefunds

      }
    }],
    queries,
    mutations,
  });
}
