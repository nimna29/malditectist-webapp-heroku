import { useState, useEffect, RefObject } from 'react';
import { MlResult } from '../types/MlResult';

interface UseUIInteractionsProps {
    uploadProgress: number;
    mlResult: MlResult | null;
    resultId: string | null;
    errorMessage: string | null;
    resultAreaRef: RefObject<HTMLDivElement>;
  }

const useUIInteractions = ({
    uploadProgress,
    mlResult,
    resultId,
    errorMessage,
    resultAreaRef,
  }: UseUIInteractionsProps) => {
    const [isHovering, setIsHovering] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => {
      setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    if (uploadProgress !== 0 || mlResult || resultId || errorMessage) {
      resultAreaRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [uploadProgress, mlResult, resultId, errorMessage, resultAreaRef]);

  return { isHovering, setIsHovering, menuOpen, setMenuOpen, toggleMenu };
};

export default useUIInteractions;