import { useState, useEffect, useCallback } from 'react';
import { useWeb3 } from './useWeb3';
import { getPuzzleContract, getTokenContract } from '../utils/contracts';

export const usePuzzle = () => {
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [solvingTime, setSolvingTime] = useState(0);
  const [isSolving, setIsSolving] = useState(false);
  const { account, provider } = useWeb3();

  const loadDailyPuzzle = useCallback(async () => {
    try {
      const response = await fetch('/api/puzzles/daily');
      const puzzle = await response.json();
      setCurrentPuzzle(puzzle);
    } catch (error) {
      console.error('Failed to load puzzle:', error);
    }
  }, []);

  const submitSolution = useCallback(async (solution, time) => {
    if (!account || !provider) throw new Error('Wallet not connected');
    
    setIsSolving(true);
    try {
      const signer = await provider.getSigner();
      const puzzleContract = getPuzzleContract(signer);
      
      const tx = await puzzleContract.submitSolution(
        currentPuzzle.id,
        solution,
        time
      );
      
      await tx.wait();
      setSolvingTime(time);
      
      return tx.hash;
    } catch (error) {
      throw new Error(`Solution submission failed: ${error.message}`);
    } finally {
      setIsSolving(false);
    }
  }, [account, provider, currentPuzzle]);

  const claimRewards = useCallback(async (puzzleId) => {
    if (!account || !provider) throw new Error('Wallet not connected');
    
    try {
      const signer = await provider.getSigner();
      const puzzleContract = getPuzzleContract(signer);
      
      const tx = await puzzleContract.claimRewards(puzzleId);
      await tx.wait();
      
      return tx.hash;
    } catch (error) {
      throw new Error(`Reward claim failed: ${error.message}`);
    }
  }, [account, provider]);

  useEffect(() => {
    loadDailyPuzzle();
  }, [loadDailyPuzzle]);

  return {
    currentPuzzle,
    solvingTime,
    isSolving,
    submitSolution,
    claimRewards,
    loadDailyPuzzle
  };
};