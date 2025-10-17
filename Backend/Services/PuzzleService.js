const puzzles = [
  {
    id: 1,
    theme: "Web3 Basics",
    difficulty: "Easy",
    reward: 100,
    grid: [
      ['B', 'L', 'O', 'C', 'K', 'C', 'H', 'A', 'I', 'N'],
      ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
      ['W', 'A', 'L', 'L', 'E', 'T', '#', '#', '#', '#'],
      ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
      ['S', 'M', 'A', 'R', 'T', 'C', 'O', 'N', 'T', 'R'],
      ['A', 'C', 'T', '#', '#', '#', '#', '#', '#', '#'],
      ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#']
    ],
    words: [
      { word: "BLOCKCHAIN", clue: "Distributed ledger technology" },
      { word: "WALLET", clue: "Stores your crypto assets" },
      { word: "SMARTCONTRACT", clue: "Self-executing contracts" }
    ]
  }
];

class PuzzleService {
  async getDailyPuzzle() {
    const today = new Date().toDateString();
    const puzzleIndex = Math.abs(this.hashCode(today)) % puzzles.length;
    return puzzles[puzzleIndex];
  }

  async validateSolution(puzzleId, solution) {
    const puzzle = puzzles.find(p => p.id === puzzleId);
    if (!puzzle) throw new Error('Puzzle not found');
    
    return puzzle.words.every(word => 
      solution.includes(word.word.toLowerCase())
    );
  }

  hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }
}

module.exports = new PuzzleService();