import React from "react";
import { Box, Text } from "ink";

export interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
}

export const ProgressBar = ({ current, total, label = "completed" }: ProgressBarProps) => {
  const terminalWidth = process.stdout.columns || 80;
  const statusText = ` ${Math.round((total > 0 ? current / total : 1) * 100)}% (${current}/${total} ${label})`;
  const reservedSpace = statusText.length + 4;
  const width = Math.max(20, terminalWidth - reservedSpace);
  const progress = total > 0 ? current / total : 1;
  const filled = Math.round(width * progress);
  const empty = width - filled;
  const percentage = Math.round(progress * 100);

  return (
    <Box>
      <Text color="gray">[</Text>
      <Text backgroundColor="green">{" ".repeat(filled)}</Text>
      <Text>{" ".repeat(empty)}</Text>
      <Text color="gray">]</Text>
      <Text> {percentage}%</Text>
      <Text dimColor> ({current}/{total} {label})</Text>
    </Box>
  );
};
