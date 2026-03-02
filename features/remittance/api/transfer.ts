interface TransferParams {
  fromAccount: string;
  toAccount: string;
  money: string;
  bankCode?: string;
  txt?: string;
}

const createRequestBody = ({ fromAccount, toAccount, money, bankCode, txt }: TransferParams) => {
  return {
    dataHeader: {
      UTZPE_CNCT_IPAD: '127.0.0.1',
    },
    dataBody: {
      WDR_ACNO: fromAccount,
      TRN_AM: money,
      RCV_BKCD: bankCode || '020',
      RCV_ACNO: toAccount,
      PTN_PBOK_PRNG_TXT: txt || '',
    },
  };
};

export const executeTransfer = async (params: TransferParams) => {
  try {
    const response = await fetch('/api/transfer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(createRequestBody(params)),
    });

    console.log('response', response);
    if (!response.ok) {
      throw new Error(`Server Error: ${response.status}`);
    }

    const data = await response.json();

    return {
      status: 200,
      data: data,
    };
  } catch (e) {
    console.error('Transfer Error:', e);
    return {
      status: 500,
      data: null,
    };
  }
};
