"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUseInvalidators = exports.getUseInvalidator = void 0;
const constants_1 = require("./constants");
const getUseInvalidator = async (connection, useInvalidatorId) => {
    const program = (0, constants_1.useInvalidatorProgram)(connection);
    const parsed = await program.account.useInvalidator.fetch(useInvalidatorId);
    return {
        parsed,
        pubkey: useInvalidatorId,
    };
};
exports.getUseInvalidator = getUseInvalidator;
const getUseInvalidators = async (connection, useInvalidatorIds) => {
    const program = (0, constants_1.useInvalidatorProgram)(connection);
    let useInvalidators = [];
    try {
        useInvalidators = (await program.account.useInvalidator.fetchMultiple(useInvalidatorIds));
    }
    catch (e) {
        console.log(e);
    }
    return useInvalidators.map((parsed, i) => ({
        parsed,
        pubkey: useInvalidatorIds[i],
    }));
};
exports.getUseInvalidators = getUseInvalidators;
//# sourceMappingURL=accounts.js.map