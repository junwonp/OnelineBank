import { BANK_LIST, BankType } from '@/constants/bank';

export const findBankInText = (text: string): BankType | undefined => {
  const cleanText = text.replace(/\s/g, '');

  return BANK_LIST.find((bank) => cleanText.includes(bank.name));
};
