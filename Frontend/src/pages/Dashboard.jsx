import { useState, useEffect } from 'react';
import { useWeb3 } from '../hooks/useWeb3';
import { usePuzzle } from '../hooks/usePuzzle';
import WalletConnect from '../components/Web3/WalletConnect';
import DailyRewards from '../components/UI/DailyRewards';
import CrosswordGrid from '../components/Game/CrosswordGrid';
import Timer from '../components/Game/Timer';

const Dashboard = () => {
  const { account } = useWeb3();
  const { currentPuzzle, submitSolution, isSolving } = usePuzzle();
  const [solveTime, setSolveTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const handlePuzzleSolve = async () => {
    setIsTimerRunning(false);
    try {
      await submitSolution(currentPuzzle.id, solveTime);
    } catch (error) {
      console.error('Failed to submit solution:', error);
    }
  };

  const startPuzzle = () => {
    setSolveTime(0);
    setIsTimerRunning(true);
  };

  if (!account) {
    return (
      <div className="dashboard">
        <div className="welcome-section">
          <h1>Crossword Quest</h1>
          <p>Solve. Earn. Own.</p>
          <WalletConnect />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <WalletConnect />
        <DailyRewards />
      </header>

      <main className="game-section">
        {currentPuzzle && (
          <div className="puzzle-container">
            <div className="puzzle-info">
              <h2>Daily Puzzle</h2>
              <p>Theme: {currentPuzzle.theme}</p>
              <p>Difficulty: {currentPuzzle.difficulty}</p>
              <p>Reward: {currentPuzzle.reward} $CROSS</p>
            </div>
            
            <Timer 
              isRunning={isTimerRunning} 
              onTimeUpdate={setSolveTime}
            />
            
            <CrosswordGrid 
              puzzle={currentPuzzle}
              onSolve={handlePuzzleSolve}
            />
            
            <button 
              onClick={startPuzzle}
              disabled={isSolving}
              className="start-puzzle-btn"
            >
              {isSolving ? 'Submitting...' : 'Start Puzzle'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;