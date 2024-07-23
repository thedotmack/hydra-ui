import { fetchIdlAccount } from "@cardinal/common";
import { PAYMENT_MANAGER_IDL } from ".";
export const getPaymentManager = async (connection, paymentManagerId) => {
    return fetchIdlAccount(connection, paymentManagerId, "paymentManager", PAYMENT_MANAGER_IDL);
};
//# sourceMappingURL=accounts.js.map