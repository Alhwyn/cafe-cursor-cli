import { useState, useEffect } from "react";
import { readdir } from "node:fs/promises";

export const useFileAutocomplete = (input: string) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  useEffect(() => {
    const loadFiles = async () => {
      // Trigger if input starts with / or is just empty (optional, but stick to / for "slash command")
      // Actually, let's treat "/" as the trigger for "list current directory CSVs"
      if (input.trim().startsWith("/")) {
        try {
          const files = await readdir(process.cwd());
          const csvFiles = files.filter(f => f.endsWith(".csv"));
          
          // Filter based on what's after the slash
          const search = input.trim().slice(1);
          const filtered = csvFiles.filter(f => f.toLowerCase().includes(search.toLowerCase()));
          
          setSuggestions(filtered);
        } catch (e) {
          console.error(e);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    };
    
    loadFiles();
  }, [input]);

  return suggestions;
};
