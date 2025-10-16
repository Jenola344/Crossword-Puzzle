import { useState, useCallback, useEffect } from 'react';

const CrosswordGrid = ({ puzzle, onSolve }) => {
  const [selectedCells, setSelectedCells] = useState(new Set());
  const [currentWord, setCurrentWord] = useState('');
  const [solvedWords, setSolvedWords] = useState(new Set());

  const handleCellSelect = useCallback((row, col) => {
    const cellId = `${row}-${col}`;
    const newSelected = new Set(selectedCells);
    
    if (newSelected.has(cellId)) {
      newSelected.delete(cellId);
    } else {
      newSelected.add(cellId);
    }
    
    setSelectedCells(newSelected);
    updateCurrentWord(newSelected);
  }, [selectedCells, puzzle]);

  const updateCurrentWord = useCallback((selected) => {
    const sortedCells = Array.from(selected)
      .map(id => id.split('-').map(Number))
      .sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    
    let word = '';
    sortedCells.forEach(([row, col]) => {
      word += puzzle.grid[row][col];
    });
    
    setCurrentWord(word);
    checkWordCompletion(word);
  }, [puzzle]);

  const checkWordCompletion = useCallback((word) => {
    puzzle.words.forEach(puzzleWord => {
      if (word.toLowerCase() === puzzleWord.word.toLowerCase() && !solvedWords.has(puzzleWord.word)) {
        const newSolved = new Set(solvedWords);
        newSolved.add(puzzleWord.word);
        setSolvedWords(newSolved);
        
        if (newSolved.size === puzzle.words.length) {
          onSolve();
        }
      }
    });
  }, [puzzle, solvedWords, onSolve]);

  return (
    <div className="crossword-grid">
      <div className="grid-container">
        {puzzle.grid.map((row, rowIndex) => (
          <div key={rowIndex} className="grid-row">
            {row.map((cell, colIndex) => {
              const cellId = `${rowIndex}-${colIndex}`;
              const isSelected = selectedCells.has(cellId);
              const isBlocked = cell === '#';
              
              return (
                <div
                  key={colIndex}
                  className={`grid-cell ${isSelected ? 'selected' : ''} ${isBlocked ? 'blocked' : ''}`}
                  onClick={() => !isBlocked && handleCellSelect(rowIndex, colIndex)}
                >
                  {!isBlocked && cell}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="word-display">
        <p>Current Word: {currentWord}</p>
        <div className="solved-words">
          Solved: {solvedWords.size}/{puzzle.words.length}
        </div>
      </div>
    </div>
  );
};

export default CrosswordGrid;