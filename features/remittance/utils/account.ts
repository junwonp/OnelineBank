interface AccountItem {
  name: string;
  uid: string;
  bank: string;
  account: string;
}

interface FoundAccount {
  bankName: string;
  accountNumber: string;
}

export const findUserAccount = (
  targetName: string,
  accountList: AccountItem[],
  currentUid: string,
): FoundAccount | null => {
  const found = accountList.find((item) => item.name === targetName && item.uid === currentUid);

  if (!found) return null;

  return {
    bankName: found.bank,
    accountNumber: found.account,
  };
};
