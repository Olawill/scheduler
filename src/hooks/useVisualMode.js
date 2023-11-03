import { useState } from "react";


const useVisualMode = (initial) => {
  const [history, setHistory] = useState([initial]);

  const transition = (newMode, replaceBool = false) => {
    if (replaceBool) {
      return setHistory(prev => [...prev.slice(0, prev.length - 1), newMode]);
    }
    setHistory(prev => [...prev, newMode]);
  };

  const back = () => {
    setHistory(prev => {
      if (prev.length > 1) {
        return [...prev.slice(0, prev.length - 1)]
      }
      return [...prev];
    });
  };

  return { mode: history[history.length - 1], transition, back };
};

export default useVisualMode;