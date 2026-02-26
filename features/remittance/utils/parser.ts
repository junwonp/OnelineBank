const REGEX = {
  ACCOUNT: /\d{11,14}/,
  MONEY: /\d+(?=원)/,
  NAME_TO: /[가-힣]+(?=에게)/,
  NAME_FOR: /[가-힣]+(?=한테)/,
};

export const extractAccount = (text: string): string | null => {
  const match = text.match(REGEX.ACCOUNT);
  return match ? match[0] : null;
};

export const extractAmount = (text: string): string | null => {
  const match = text.match(REGEX.MONEY);
  return match ? match[0] : null;
};

export const extractReceiverName = (text: string): string | null => {
  const matchTo = text.match(REGEX.NAME_TO);
  const matchFor = text.match(REGEX.NAME_FOR);

  if (matchTo) return matchTo[0];
  if (matchFor) return matchFor[0];
  return null;
};
