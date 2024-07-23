"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentManager = void 0;
const common_1 = require("@cardinal/common");
const _1 = require(".");
const getPaymentManager = async (connection, paymentManagerId) => {
    return (0, common_1.fetchIdlAccount)(connection, paymentManagerId, "paymentManager", _1.PAYMENT_MANAGER_IDL);
};
exports.getPaymentManager = getPaymentManager;
//# sourceMappingURL=accounts.js.map