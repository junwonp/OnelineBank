const INITIAL_BALANCE = 5000000;

const determineReceiverName = (accountNumber: string): string => {
  if (accountNumber === '1002987654321') return '김우리';
  if (accountNumber.endsWith('777')) return '이행운';
  return '김우리';
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { dataBody } = body;

    const { TRN_AM, RCV_ACNO, PTN_PBOK_PRNG_TXT } = dataBody;

    const amount = parseInt(String(TRN_AM).replace(/,/g, ''), 10);

    const balanceAfterTransfer = INITIAL_BALANCE - amount;

    const receiverName = determineReceiverName(RCV_ACNO);

    const responseData = {
      dataHeader: {
        successCode: '000',
        resultMessage: '정상 처리되었습니다.',
      },
      dataBody: {
        OWAC_FNM: '홍길동',
        RNPE_FNM: receiverName,

        BFTR_AF_BAL: balanceAfterTransfer.toLocaleString(),

        FEE_Am: '0',

        TRN_AM: TRN_AM,
        RCV_ACNO: RCV_ACNO,
        MEMO: PTN_PBOK_PRNG_TXT,
      },
    };

    await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000 + 500));

    return Response.json(responseData);
  } catch (error) {
    console.error('Mock API Error:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
