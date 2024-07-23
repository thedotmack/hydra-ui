import { useInvalidatorProgram } from "./constants";
export const getUseInvalidator = async (connection, useInvalidatorId) => {
    const program = useInvalidatorProgram(connection);
    const parsed = await program.account.useInvalidator.fetch(useInvalidatorId);
    return {
        parsed,
        pubkey: useInvalidatorId,
    };
};
export const getUseInvalidators = async (connection, useInvalidatorIds) => {
    const program = useInvalidatorProgram(connection);
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
//# sourceMappingURL=accounts.js.map