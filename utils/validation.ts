import { BANK_LIST } from '@/constants/bank';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const ACCOUNT_REGEX = /^[\d-]{10,20}$/;

export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

export const validateAccount = (account: string): boolean => {
  return ACCOUNT_REGEX.test(account);
};

export const validateBankCode = (bank: string): boolean => {
  const cleanBank = bank.replace(/\s/g, '');
  return BANK_LIST.some((b) => cleanBank === b.name);
};
