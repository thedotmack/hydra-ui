import { BN, BorshAccountsCoder } from "@project-serum/anchor";
import { TIME_INVALIDATOR_ADDRESS, TIME_INVALIDATOR_IDL, timeInvalidatorProgram, } from "./constants";
export const getTimeInvalidator = async (connection, timeInvalidatorId) => {
    const program = timeInvalidatorProgram(connection);
    const parsed = await program.account.timeInvalidator.fetch(timeInvalidatorId);
    return {
        parsed,
        pubkey: timeInvalidatorId,
    };
};
export const getTimeInvalidators = async (connection, timeInvalidatorIds) => {
    const program = timeInvalidatorProgram(connection);
    let timeInvalidators = [];
    try {
        timeInvalidators = (await program.account.timeInvalidator.fetchMultiple(timeInvalidatorIds));
    }
    catch (e) {
        console.log(e);
    }
    return timeInvalidators.map((data, i) => ({
        parsed: data,
        pubkey: timeInvalidatorIds[i],
    }));
};
export const getExpiredTimeInvalidators = async (connection) => {
    const programAccounts = await connection.getProgramAccounts(TIME_INVALIDATOR_ADDRESS);
    const expiredTimeInvalidators = [];
    const coder = new BorshAccountsCoder(TIME_INVALIDATOR_IDL);
    programAccounts.forEach((account) => {
        var _a;
        try {
            const timeInvalidatorData = coder.decode("timeInvalidator", account.account.data);
            if ((_a = timeInvalidatorData.expiration) === null || _a === void 0 ? void 0 : _a.lte(new BN(Date.now() / 1000))) {
                expiredTimeInvalidators.push({
                    ...account,
                    parsed: timeInvalidatorData,
                });
            }
        }
        catch (e) {
            console.log(`Failed to decode time invalidator data`);
        }
    });
    return expiredTimeInvalidators;
};
export const getAllTimeInvalidators = async (connection) => {
    const programAccounts = await connection.getProgramAccounts(TIME_INVALIDATOR_ADDRESS);
    const expiredTimeInvalidators = [];
    const coder = new BorshAccountsCoder(TIME_INVALIDATOR_IDL);
    programAccounts.forEach((account) => {
        try {
            const timeInvalidatorData = coder.decode("timeInvalidator", account.account.data);
            expiredTimeInvalidators.push({
                ...account,
                parsed: timeInvalidatorData,
            });
        }
        catch (e) {
            console.log(`Failed to decode time invalidator data`);
        }
    });
    return expiredTimeInvalidators;
};
//# sourceMappingURL=accounts.js.map