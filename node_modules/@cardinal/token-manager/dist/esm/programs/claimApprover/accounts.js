import { BorshAccountsCoder } from "@project-serum/anchor";
import { CLAIM_APPROVER_ADDRESS, CLAIM_APPROVER_IDL, claimApproverProgram, } from "./constants";
import { findClaimApproverAddress } from "./pda";
export const getClaimApprover = async (connection, tokenManagerId) => {
    const program = claimApproverProgram(connection);
    const claimApproverId = findClaimApproverAddress(tokenManagerId);
    const parsed = await program.account.paidClaimApprover.fetch(claimApproverId);
    return {
        parsed,
        pubkey: claimApproverId,
    };
};
export const getClaimApprovers = async (connection, claimApproverIds) => {
    const program = claimApproverProgram(connection);
    let claimApprovers = [];
    try {
        claimApprovers = (await program.account.paidClaimApprover.fetchMultiple(claimApproverIds));
    }
    catch (e) {
        console.log(e);
    }
    return claimApprovers.map((tm, i) => ({
        parsed: tm,
        pubkey: claimApproverIds[i],
    }));
};
export const getAllClaimApprovers = async (connection) => {
    const programAccounts = await connection.getProgramAccounts(CLAIM_APPROVER_ADDRESS);
    const claimApprovers = [];
    const coder = new BorshAccountsCoder(CLAIM_APPROVER_IDL);
    programAccounts.forEach((account) => {
        try {
            const claimApproverData = coder.decode("paidClaimApprover", account.account.data);
            claimApprovers.push({
                ...account,
                parsed: claimApproverData,
            });
        }
        catch (e) {
            console.log(`Failed to decode claim approver data`);
        }
    });
    return claimApprovers;
};
//# sourceMappingURL=accounts.js.map