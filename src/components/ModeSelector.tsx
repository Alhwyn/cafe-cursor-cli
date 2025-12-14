import React from "react";
import { Box, Text, useInput } from "ink";
import SelectInput from "ink-select-input";
import type { StorageMode } from "../context/StorageContext.js";

interface ModeSelectorProps {
  onSelect: (mode: StorageMode) => void;
}

const ModeSelector = ({ onSelect }: ModeSelectorProps) => {

  const items = [
    { 
      label: "1. Cloud Mode (Convex Database)", 
      value: "cloud" as StorageMode,
    },
    { 
      label: "2. Local Mode (CSV Files)", 
      value: "local" as StorageMode,
    },
  ];

  useInput((input) => {
    if (input === "1") {
      onSelect("cloud");
    } else if (input === "2") {
      onSelect("local");
    }
  });

  const handleSelect = (item: { label: string; value: StorageMode }) => {
    onSelect(item.value);
  };

  return (
    <Box flexDirection="column" padding={1} borderStyle="round" borderColor="white">
      <Text bold color="white">Select Storage Mode:</Text>
      <Box marginTop={1}>
        <SelectInput items={items} onSelect={handleSelect} />
      </Box>
    </Box>
  );
};

export default ModeSelector;
