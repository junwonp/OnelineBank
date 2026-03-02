import { useRef, useState } from 'react';
import { authenticateAsync } from 'expo-local-authentication';
import { useQueryClient } from '@tanstack/react-query';

import { useSnackbar } from '@/components/providers/snackbar-provider';
import { useAccounts } from '@/features/accounts/api';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { messagesKeys, useSendMessage } from '@/features/messages/api';
import { useProfile } from '@/features/profile/api';
import { executeTransfer } from '@/features/remittance/api/transfer';
import { findUserAccount } from '@/features/remittance/utils/account';
import { findBankInText } from '@/features/remittance/utils/bank';
import {
  extractAccount,
  extractAmount,
  extractReceiverName,
} from '@/features/remittance/utils/parser';

interface PendingTransfer {
  bankCode: string;
  toAccount: string;
  amount: string;
}

const AFFIRMATIVE = new Set(['네', '예', 'ㅇㅇ', 'ㅇ', '그래']);
const NEGATIVE = new Set(['아니오', 'ㄴㄴ', 'ㄴ', '싫어']);

const HELP_TEXT = '현재 계좌이체 기능이 있습니다.\n(추천 대화: 계좌이체는 어떻게 해?)';
const HOW_TO_TEXT = '[은행 계좌번호]/[이름]에게 [이체금액]원 보내줘 라고 입력해보세요.';

export const useChat = () => {
  const uid = useAuthStore((state) => state.user?.uid);
  const { setSnackbarMessage } = useSnackbar();
  const queryClient = useQueryClient();

  const { data: accounts } = useAccounts();
  const { data: profile } = useProfile();
  const sendMessage = useSendMessage();

  const [isLoading, setIsLoading] = useState(false);

  const isAwaitingConfirmationRef = useRef(false);
  const pendingTransferRef = useRef<PendingTransfer | null>(null);

  const sendUserMessage = async (text: string) =>
    await sendMessage.mutateAsync({ text, isBot: false });

  const sendBotMessage = async (text: string) =>
    await sendMessage.mutateAsync({ text, isBot: true });

  const refreshMessages = () => queryClient.invalidateQueries({ queryKey: messagesKeys.all });

  const parseTransferRequest = (text: string): { reply: string; transfer?: PendingTransfer } => {
    const receiverName = extractReceiverName(text);
    let bankCode: string | null = null;
    let toAccount: string | null = null;
    let recipientLabel = '';

    if (receiverName) {
      if (!accounts || !uid) return { reply: '계좌 정보를 불러오는 중입니다.' };

      const found = findUserAccount(receiverName, accounts, uid);
      if (!found) return { reply: '이름을 찾을 수가 없어요.\n주소록에서 새로 추가해주세요.' };

      bankCode = found.bankName;
      toAccount = found.accountNumber;
      recipientLabel = `${receiverName}(${found.bankName} ${found.accountNumber})에게`;
    } else {
      const bank = findBankInText(text);
      if (!bank) return { reply: '은행을 인식하지 못했어요.' };

      bankCode = bank.code;
      recipientLabel = bank.name;

      const account = extractAccount(text);
      if (!account) return { reply: '계좌를 인식하지 못했어요.\n-를 빼고 입력해보세요.' };

      toAccount = account;
      recipientLabel += ` ${account}에게`;
    }

    const amount = extractAmount(text);
    if (!amount) return { reply: '금액을 인식하지 못했어요.' };

    const confirmMessage = `${recipientLabel} ${amount}원을 보내시겠습니까?`;
    return { reply: confirmMessage, transfer: { bankCode, toAccount, amount } };
  };

  const handleConfirmation = async (text: string): Promise<string> => {
    const pending = pendingTransferRef.current;

    if (!pending || !profile) {
      isAwaitingConfirmationRef.current = false;
      return '오류가 발생했습니다. 다시 시도해주세요.';
    }

    if (AFFIRMATIVE.has(text)) {
      const authResult = await authenticateAsync();
      if (!authResult.success) {
        isAwaitingConfirmationRef.current = false;
        pendingTransferRef.current = null;
        return '인증에 실패하였습니다.';
      }

      const response = await executeTransfer({
        fromAccount: profile.account,
        toAccount: pending.toAccount,
        bankCode: pending.bankCode,
        money: pending.amount,
      });

      isAwaitingConfirmationRef.current = false;
      pendingTransferRef.current = null;

      if (response.status === 200 && response.data) {
        const { OWAC_FNM, RNPE_FNM, BFTR_AF_BAL, FEE_Am } = response.data.dataBody;
        return `이체를 완료하였습니다.\n계좌: ${profile.account}\n예금주: ${OWAC_FNM}\n수취인: ${RNPE_FNM}\n잔액: ${BFTR_AF_BAL}\n수수료금액: ${FEE_Am}`;
      }
      return '이체에 실패했습니다.';
    }

    if (NEGATIVE.has(text)) {
      isAwaitingConfirmationRef.current = false;
      pendingTransferRef.current = null;
      return '이체를 취소합니다.';
    }

    return '알아듣지 못했어요. 예/아니오로 대답해주세요.';
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    setIsLoading(true);
    try {
      await sendUserMessage(text);

      let botReply: string;

      if (!isAwaitingConfirmationRef.current) {
        if (text === '도움말') {
          botReply = HELP_TEXT;
        } else if (text === '계좌이체는 어떻게 해?') {
          botReply = HOW_TO_TEXT;
        } else {
          const result = parseTransferRequest(text);
          botReply = result.reply;
          if (result.transfer) {
            pendingTransferRef.current = result.transfer;
            isAwaitingConfirmationRef.current = true;
          }
        }
      } else {
        botReply = await handleConfirmation(text);
      }

      await sendBotMessage(botReply);
      refreshMessages();
    } catch {
      setSnackbarMessage('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSend, isLoading };
};
