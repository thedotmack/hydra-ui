import type { Idl } from "@coral-xyz/anchor";
import { BorshAccountsCoder, utils } from "@coral-xyz/anchor";
import type {
  AllAccountsMap,
  IdlTypes,
  TypeDef,
} from "@coral-xyz/anchor/dist/cjs/program/namespace/types";
import type {
  AccountInfo,
  Commitment,
  Connection,
  GetAccountInfoConfig,
  GetMultipleAccountsConfig,
  GetProgramAccountsConfig,
  PublicKey,
} from "@solana/web3.js";

export type ParsedIdlAccountData<
  T extends keyof AllAccountsMap<IDL>,
  IDL extends Idl
> = TypeDef<AllAccountsMap<IDL>[T], IdlTypes<IDL>>;

export type ParsedIdlAccount<IDL extends Idl> = {
  [T in keyof AllAccountsMap<IDL>]: {
    type: T;
    parsed: ParsedIdlAccountData<T, IDL>;
  };
};

export type IdlAccountInfo<
  T extends keyof AllAccountsMap<IDL>,
  IDL extends Idl
> = AccountInfo<Buffer> & ParsedIdlAccount<IDL>[T];

export type IdlAccountData<
  T extends keyof AllAccountsMap<IDL>,
  IDL extends Idl
> = {
  pubkey: PublicKey;
} & IdlAccountInfo<T, IDL>;

export type NullableIdlAccountInfo<
  T extends keyof AllAccountsMap<IDL>,
  IDL extends Idl
> =
  | IdlAccountInfo<T, IDL>
  | (AccountInfo<Buffer> & {
      type: "unknown";
      parsed: null;
    });

export type NullableIdlAccountData<
  T extends keyof AllAccountsMap<IDL>,
  IDL extends Idl
> = {
  pubkey: PublicKey;
} & NullableIdlAccountInfo<T, IDL>;

/**
 * Fetch an account with idl types
 * @param connection
 * @param pubkey
 * @param accountType
 * @param config
 * @returns
 */
export const fetchIdlAccount = async <
  T extends keyof AllAccountsMap<IDL>,
  IDL extends Idl
>(
  connection: Connection,
  pubkey: PublicKey,
  accountType: T,
  idl: Idl,
  config?: GetAccountInfoConfig
) => {
  const account = await fetchIdlAccountNullable<T, IDL>(
    connection,
    pubkey,
    accountType,
    idl,
    config
  );
  if (!account) throw "Account info not found";
  return account;
};

/**
 * Fetch a possibly null account with idl types of a specific type
 * @param connection
 * @param pubkey
 * @param accountType
 * @param config
 * @param idl
 * @returns
 */
export const fetchIdlAccountNullable = async <
  T extends keyof AllAccountsMap<IDL>,
  IDL extends Idl
>(
  connection: Connection,
  pubkey: PublicKey,
  accountType: T,
  idl: Idl,
  config?: GetAccountInfoConfig
) => {
  const accountInfo = await connection.getAccountInfo(pubkey, config);
  if (!accountInfo) return null;
  try {
    const parsed: TypeDef<
      AllAccountsMap<IDL>[T],
      IdlTypes<IDL>
    > = new BorshAccountsCoder(idl).decode(accountType, accountInfo.data);
    return {
      ...accountInfo,
      pubkey,
      parsed,
      type: accountType,
    };
  } catch (e) {
    return null;
  }
};

/**
 * Decode an account with idl types of a specific type
 * @param accountInfo
 * @param accountType
 * @param idl
 * @returns
 */
export const decodeIdlAccount = <
  T extends keyof AllAccountsMap<IDL>,
  IDL extends Idl
>(
  accountInfo: AccountInfo<Buffer>,
  accountType: T,
  idl: Idl
) => {
  const parsed: TypeDef<
    AllAccountsMap<IDL>[T],
    IdlTypes<IDL>
  > = new BorshAccountsCoder(idl).decode(accountType, accountInfo.data);
  return {
    ...accountInfo,
    type: accountType,
    parsed,
  };
};

/**
 * Try to decode an account with idl types of specific type
 * @param accountInfo
 * @param accountType
 * @param idl
 * @returns
 */
export const tryDecodeIdlAccount = <
  T extends keyof AllAccountsMap<IDL>,
  IDL extends Idl
>(
  accountInfo: AccountInfo<Buffer>,
  accountType: T,
  idl: Idl
) => {
  try {
    return decodeIdlAccount<T, IDL>(accountInfo, accountType, idl);
  } catch (e) {
    return {
      ...accountInfo,
      type: "unknown",
      parsed: null,
    };
  }
};

/**
 * Decode an idl account of unknown type
 * @param accountInfo
 * @param idl
 * @returns
 */
export const decodeIdlAccountUnknown = <
  T extends keyof AllAccountsMap<IDL>,
  IDL extends Idl
>(
  accountInfo: AccountInfo<Buffer> | null,
  idl: Idl
): AccountInfo<Buffer> & ParsedIdlAccount<IDL>[T] => {
  if (!accountInfo) throw "No account found";
  // get idl accounts
  const idlAccounts = idl["accounts"];
  if (!idlAccounts) throw "No account definitions found in IDL";
  // find matching account name
  const accountTypes = idlAccounts.map((a) => a.name);
  const accountType = accountTypes?.find(
    (accountType) =>
      BorshAccountsCoder.accountDiscriminator(accountType).compare(
        accountInfo.data.subarray(0, 8)
      ) === 0
  );
  if (!accountType) throw "No account discriminator match found";

  // decode
  const parsed: TypeDef<
    AllAccountsMap<IDL>[T],
    IdlTypes<IDL>
  > = new BorshAccountsCoder(idl).decode(accountType, accountInfo.data);
  return {
    ...accountInfo,
    type: accountType as T,
    parsed,
  };
};

/**
 * Try to decode an account with idl types of unknown type
 * @param accountInfo
 * @param idl
 * @returns
 */
export const tryDecodeIdlAccountUnknown = <
  T extends keyof AllAccountsMap<IDL>,
  IDL extends Idl
>(
  accountInfo: AccountInfo<Buffer>,
  idl: Idl
): NullableIdlAccountInfo<T, IDL> => {
  try {
    return decodeIdlAccountUnknown<T, IDL>(accountInfo, idl);
  } catch (e) {
    return {
      ...accountInfo,
      type: "unknown",
      parsed: null,
    };
  }
};

/**
 * Get program accounts of a specific idl type
 * @param connection
 * @param accountType
 * @param config
 * @param programId
 * @param idl
 * @returns
 */
export const getProgramIdlAccounts = async <
  T extends keyof AllAccountsMap<IDL>,
  IDL extends Idl
>(
  connection: Connection,
  accountType: T,
  programId: PublicKey,
  idl: Idl,
  config?: GetProgramAccountsConfig
) => {
  const accountInfos = await connection.getProgramAccounts(programId, {
    filters: [
      {
        memcmp: {
          offset: 0,
          bytes: utils.bytes.bs58.encode(
            BorshAccountsCoder.accountDiscriminator(accountType)
          ),
        },
      },
      ...(config?.filters ?? []),
    ],
  });
  return accountInfos.map((accountInfo) => ({
    pubkey: accountInfo.pubkey,
    ...tryDecodeIdlAccount<T, IDL>(accountInfo.account, accountType, idl),
  }));
};

export type IdlAccountDataById<
  T extends keyof AllAccountsMap<IDL>,
  IDL extends Idl
> = {
  [accountId: string]: NullableIdlAccountData<T, IDL>;
};

/**
 * Decode account infos with corresponding ids
 * @param accountIds
 * @param accountInfos
 * @returns
 */
export const decodeIdlAccountInfos = <
  T extends keyof AllAccountsMap<IDL>,
  IDL extends Idl
>(
  accountIds: PublicKey[],
  accountInfos: (AccountInfo<Buffer> | null)[],
  programId: PublicKey,
  idl: IDL
): IdlAccountDataById<T, IDL> => {
  return accountInfos.reduce((acc, accountInfo, i) => {
    if (!accountInfo?.data) return acc;
    const accountId = accountIds[i];
    if (!accountId) return acc;
    const accoutIdString = accountId?.toString() ?? "";
    const ownerString = accountInfo.owner.toString();
    const baseData = {
      timestamp: Date.now(),
      pubkey: accountId,
    };
    switch (ownerString) {
      // stakePool
      case programId.toString(): {
        acc[accoutIdString] = {
          ...baseData,
          ...tryDecodeIdlAccountUnknown<T, IDL>(accountInfo, idl),
        };
        return acc;
      }
      // fallback
      default:
        acc[accoutIdString] = {
          ...baseData,
          ...accountInfo,
          type: "unknown",
          parsed: null,
        };
        return acc;
    }
  }, {} as IdlAccountDataById<T, IDL>);
};

export const fetchIdlAccountDataById = async <
  T extends keyof AllAccountsMap<IDL>,
  IDL extends Idl
>(
  connection: Connection,
  ids: (PublicKey | null)[],
  programId: PublicKey,
  idl: IDL
): Promise<IdlAccountDataById<T, IDL>> => {
  const filteredIds = ids.filter((id): id is PublicKey => id !== null);
  const accountInfos = await getBatchedMultipleAccounts(
    connection,
    filteredIds
  );
  return decodeIdlAccountInfos<T, IDL>(
    filteredIds,
    accountInfos,
    programId,
    idl
  );
};

/**
 * Fecthes multiple accounts in batches since there is a limit of
 * 100 accounts per connection.getMultipleAccountsInfo call
 * @param connection
 * @param ids
 * @param config
 * @param batchSize
 * @returns
 */
export const getBatchedMultipleAccounts = async (
  connection: Connection,
  ids: PublicKey[],
  config?: GetMultipleAccountsConfig | Commitment,
  batchSize = 100
) => {
  const batches: PublicKey[][] = [[]];
  ids.forEach((id) => {
    const batch = batches[batches.length - 1];
    if (batch) {
      if (batch.length >= batchSize) {
        batches.push([id]);
      } else {
        batch.push(id);
      }
    }
  });
  const batchAccounts = await Promise.all(
    batches.map((b) =>
      b.length > 0 ? connection.getMultipleAccountsInfo(b, config) : []
    )
  );
  return batchAccounts.flat();
};

/**
 * Batch fetch a map of accounts and their corresponding ids
 * @param connection
 * @param ids
 * @returns
 */
export const fetchAccountDataById = async (
  connection: Connection,
  ids: (PublicKey | null)[]
): Promise<{
  [accountId: string]: AccountInfo<Buffer> & { pubkey: PublicKey };
}> => {
  const filteredIds = ids.filter((id): id is PublicKey => id !== null);
  const accountInfos = await getBatchedMultipleAccounts(
    connection,
    filteredIds
  );
  return accountInfos.reduce((acc, accountInfo, i) => {
    if (!accountInfo?.data) return acc;
    const pubkey = ids[i];
    if (!pubkey) return acc;
    acc[pubkey.toString()] = {
      pubkey,
      ...accountInfo,
    };
    return acc;
  }, {} as { [accountId: string]: AccountInfo<Buffer> & { pubkey: PublicKey } });
};
