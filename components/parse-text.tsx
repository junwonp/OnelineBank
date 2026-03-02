import React from 'react';
import { setStringAsync } from 'expo-clipboard';

import { useSnackbar } from '@/components/providers/snackbar-provider';
import Text from '@/components/ui/text';

import { cn } from '../utils/style';

const PATTERNS: { regex: RegExp; label: string }[] = [
  { regex: /[가-힣]+(?=에게)/g, label: 'name' },
  { regex: /\d{11,14}/g, label: 'account' },
  { regex: /\d+(?=원)/g, label: 'money' },
  { regex: /0\d{1,2}[-\s]?\d{3,4}[-\s]?\d{4}/g, label: 'phone' },
];

type MatchEntry = {
  start: number;
  end: number;
  content: string;
};

const ParseTextWithPatterns = ({
  children,
  className,
}: {
  children: string;
  className?: string;
}) => {
  const { setSnackbarMessage } = useSnackbar();

  const text = children;

  const matches: MatchEntry[] = [];

  for (const { regex } of PATTERNS) {
    const r = new RegExp(regex.source, 'g');
    let match: RegExpExecArray | null;
    while ((match = r.exec(text)) !== null) {
      matches.push({ start: match.index, end: match.index + match[0].length, content: match[0] });
    }
  }

  matches.sort((a, b) => a.start - b.start);

  const deduped: MatchEntry[] = [];
  let lastEnd = 0;
  for (const match of matches) {
    if (match.start >= lastEnd) {
      deduped.push(match);
      lastEnd = match.end;
    }
  }

  const nodes: React.ReactNode[] = [];
  let cursor = 0;

  for (const match of deduped) {
    if (match.start > cursor) {
      nodes.push(
        <Text key={`plain-${cursor}`} className={className}>
          {text.slice(cursor, match.start)}
        </Text>,
      );
    }

    nodes.push(
      <Text
        key={`match-${match.start}`}
        className={cn('underline', className)}
        onPress={async () => {
          await setStringAsync(match.content);
          setSnackbarMessage('클립보드에 복사되었습니다.', { mode: 'success' });
        }}
      >
        {match.content}
      </Text>,
    );

    cursor = match.end;
  }

  if (cursor < text.length) {
    nodes.push(
      <Text key={`plain-${cursor}`} className={className}>
        {text.slice(cursor)}
      </Text>,
    );
  }

  return nodes;
};

export default ParseTextWithPatterns;
