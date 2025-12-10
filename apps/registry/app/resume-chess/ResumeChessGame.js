'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Crown,
  Sword,
  Castle,
  Zap,
  Trophy,
  RotateCcw,
  Info,
  Star,
  Briefcase,
  Code,
} from 'lucide-react';

// Chess piece types mapped to job roles
const PIECE_ROLES = {
  king: {
    icon: Crown,
    role: 'CEO',
    color: '#FFD700',
    description: 'The ultimate leader',
  },
  queen: {
    icon: Star,
    role: 'CTO',
    color: '#E6E6FA',
    description: 'Most versatile and powerful',
  },
  rook: {
    icon: Castle,
    role: 'DevOps',
    color: '#8B4513',
    description: 'Infrastructure specialist',
  },
  bishop: {
    icon: Zap,
    role: 'Architect',
    color: '#9370DB',
    description: 'Strategic diagonal thinker',
  },
  knight: {
    icon: Sword,
    role: 'Consultant',
    color: '#32CD32',
    description: 'Unique problem solver',
  },
  pawn: {
    icon: Code,
    role: 'Developer',
    color: '#696969',
    description: 'The foundation of any team',
  },
};

// Initial chess board setup
const INITIAL_BOARD = [
  ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'],
  ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'],
  ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'],
];

// Chess piece movement patterns
const PIECE_MOVES = {
  pawn: (row, col, board, isWhite, hasMoved) => {
    const moves = [];
    const direction = isWhite ? -1 : 1;
    const startRow = isWhite ? 6 : 1;

    // Forward move
    if (board[row + direction] && board[row + direction][col] === null) {
      moves.push([row + direction, col]);

      // Double move from starting position
      if (row === startRow && board[row + 2 * direction][col] === null) {
        moves.push([row + 2 * direction, col]);
      }
    }

    // Diagonal captures
    [-1, 1].forEach((dc) => {
      if (board[row + direction] && board[row + direction][col + dc] !== null) {
        const targetPiece = board[row + direction][col + dc];
        if (targetPiece && targetPiece.isWhite !== isWhite) {
          moves.push([row + direction, col + dc]);
        }
      }
    });

    return moves;
  },

  rook: (row, col, board) => {
    const moves = [];
    const directions = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ];

    directions.forEach(([dr, dc]) => {
      for (let i = 1; i < 8; i++) {
        const newRow = row + dr * i;
        const newCol = col + dc * i;

        if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break;

        if (board[newRow][newCol] === null) {
          moves.push([newRow, newCol]);
        } else {
          const targetPiece = board[newRow][newCol];
          const currentPiece = board[row][col];
          if (
            targetPiece &&
            currentPiece &&
            targetPiece.isWhite !== currentPiece.isWhite
          ) {
            moves.push([newRow, newCol]);
          }
          break;
        }
      }
    });

    return moves;
  },

  bishop: (row, col, board) => {
    const moves = [];
    const directions = [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ];

    directions.forEach(([dr, dc]) => {
      for (let i = 1; i < 8; i++) {
        const newRow = row + dr * i;
        const newCol = col + dc * i;

        if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break;

        if (board[newRow][newCol] === null) {
          moves.push([newRow, newCol]);
        } else {
          const targetPiece = board[newRow][newCol];
          const currentPiece = board[row][col];
          if (
            targetPiece &&
            currentPiece &&
            targetPiece.isWhite !== currentPiece.isWhite
          ) {
            moves.push([newRow, newCol]);
          }
          break;
        }
      }
    });

    return moves;
  },

  knight: (row, col, board) => {
    const moves = [];
    const knightMoves = [
      [-2, -1],
      [-2, 1],
      [-1, -2],
      [-1, 2],
      [1, -2],
      [1, 2],
      [2, -1],
      [2, 1],
    ];

    knightMoves.forEach(([dr, dc]) => {
      const newRow = row + dr;
      const newCol = col + dc;

      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
        const targetPiece = board[newRow][newCol];
        const currentPiece = board[row][col];
        if (
          targetPiece === null ||
          (targetPiece &&
            currentPiece &&
            targetPiece.isWhite !== currentPiece.isWhite)
        ) {
          moves.push([newRow, newCol]);
        }
      }
    });

    return moves;
  },

  queen: (row, col, board) => {
    // Queen combines rook and bishop moves
    return [
      ...PIECE_MOVES.rook(row, col, board),
      ...PIECE_MOVES.bishop(row, col, board),
    ];
  },

  king: (row, col, board) => {
    const moves = [];
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    directions.forEach(([dr, dc]) => {
      const newRow = row + dr;
      const newCol = col + dc;

      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
        if (
          board[newRow][newCol] === null ||
          board[newRow][newCol].isWhite !== board[row][col].isWhite
        ) {
          moves.push([newRow, newCol]);
        }
      }
    });

    return moves;
  },
};

export default function ResumeChessGame({ resumes = [], jobs = [] }) {
  const [board, setBoard] = useState([]);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState('white');
  const [gameStatus, setGameStatus] = useState('playing');
  const [capturedPieces, setCapturedPieces] = useState({
    white: [],
    black: [],
  });
  const [moveHistory, setMoveHistory] = useState([]);
  const [selectedPieceInfo, setSelectedPieceInfo] = useState(null);

  // Initialize board with resume data
  const initializeBoard = useCallback(() => {
    const newBoard = INITIAL_BOARD.map((row, rowIndex) =>
      row.map((piece, colIndex) => {
        if (piece === null) return null;

        const isWhite = rowIndex >= 6;
        const pieceIndex = rowIndex * 8 + colIndex;
        const resumeData = resumes[pieceIndex % resumes.length] || {};

        return {
          type: piece,
          isWhite,
          hasMoved: false,
          resumeData,
          id: `${piece}-${rowIndex}-${colIndex}`,
          experience: resumeData.experience?.length || 0,
          skills: resumeData.skills?.length || 0,
        };
      })
    );

    setBoard(newBoard);
    setSelectedSquare(null);
    setValidMoves([]);
    setCurrentPlayer('white');
    setGameStatus('playing');
    setCapturedPieces({ white: [], black: [] });
    setMoveHistory([]);
  }, [resumes]);

  useEffect(() => {
    initializeBoard();
  }, [initializeBoard]);

  // Get valid moves for a piece
  const getValidMoves = (row, col) => {
    const piece = board[row][col];
    if (!piece) return [];

    const moves = PIECE_MOVES[piece.type](
      row,
      col,
      board,
      piece.isWhite,
      piece.hasMoved
    );

    // Filter out moves that would put own king in check
    return moves.filter(([newRow, newCol]) => {
      const newBoard = board.map((r) => [...r]);
      // Store captured piece for simulation (unused but part of game logic)
      const _capturedPiece = newBoard[newRow][newCol];
      void _capturedPiece; // Acknowledge unused variable
      newBoard[newRow][newCol] = newBoard[row][col];
      newBoard[row][col] = null;

      return !isInCheck(newBoard, piece.isWhite);
    });
  };

  // Check if king is in check
  const isInCheck = (testBoard, isWhite) => {
    // Find king position
    let kingPos = null;
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = testBoard[row][col];
        if (piece && piece.type === 'king' && piece.isWhite === isWhite) {
          kingPos = [row, col];
          break;
        }
      }
    }

    if (!kingPos) return false;

    // Check if any opponent piece can attack the king
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = testBoard[row][col];
        if (piece && piece.isWhite !== isWhite) {
          const moves = PIECE_MOVES[piece.type](
            row,
            col,
            testBoard,
            piece.isWhite,
            piece.hasMoved
          );
          if (moves.some(([r, c]) => r === kingPos[0] && c === kingPos[1])) {
            return true;
          }
        }
      }
    }

    return false;
  };

  // Handle square click
  const handleSquareClick = (row, col) => {
    if (gameStatus !== 'playing') return;

    const piece = board[row][col];

    if (selectedSquare) {
      const [selectedRow, selectedCol] = selectedSquare;
      const selectedPiece = board[selectedRow][selectedCol];

      // Check if this is a valid move
      if (validMoves.some(([r, c]) => r === row && c === col)) {
        // Make the move
        const newBoard = board.map((r) => [...r]);
        const capturedPiece = newBoard[row][col];

        // Update captured pieces
        if (capturedPiece) {
          setCapturedPieces((prev) => ({
            ...prev,
            [capturedPiece.isWhite ? 'white' : 'black']: [
              ...prev[capturedPiece.isWhite ? 'white' : 'black'],
              capturedPiece,
            ],
          }));
        }

        // Move piece
        newBoard[row][col] = { ...selectedPiece, hasMoved: true };
        newBoard[selectedRow][selectedCol] = null;

        // Add to move history
        setMoveHistory((prev) => [
          ...prev,
          {
            from: [selectedRow, selectedCol],
            to: [row, col],
            piece: selectedPiece,
            captured: capturedPiece,
            player: currentPlayer,
          },
        ]);

        setBoard(newBoard);
        setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');

        // Check for checkmate/stalemate
        setTimeout(() => {
          const nextPlayer = currentPlayer === 'white' ? 'black' : 'white';
          const nextPlayerIsWhite = nextPlayer === 'white';

          if (isInCheck(newBoard, nextPlayerIsWhite)) {
            // Check if it's checkmate
            let hasValidMoves = false;
            for (let r = 0; r < 8 && !hasValidMoves; r++) {
              for (let c = 0; c < 8 && !hasValidMoves; c++) {
                const p = newBoard[r][c];
                if (p && p.isWhite === nextPlayerIsWhite) {
                  const moves = getValidMoves(r, c);
                  if (moves.length > 0) hasValidMoves = true;
                }
              }
            }

            if (!hasValidMoves) {
              setGameStatus(`checkmate-${currentPlayer}`);
            }
          }
        }, 100);
      }

      setSelectedSquare(null);
      setValidMoves([]);
      setSelectedPieceInfo(null);
    } else if (piece && piece.isWhite === (currentPlayer === 'white')) {
      // Select piece
      setSelectedSquare([row, col]);
      setValidMoves(getValidMoves(row, col));
      setSelectedPieceInfo(piece);
    }
  };

  const resetGame = () => {
    initializeBoard();
  };

  const getPieceIcon = (piece) => {
    const IconComponent = PIECE_ROLES[piece.type].icon;
    return <IconComponent className="w-6 h-6" />;
  };

  const getSquareColor = (row, col) => {
    const isLight = (row + col) % 2 === 0;
    const isSelected =
      selectedSquare && selectedSquare[0] === row && selectedSquare[1] === col;
    const isValidMove = validMoves.some(([r, c]) => r === row && c === col);

    if (isSelected) return 'bg-yellow-400';
    if (isValidMove) return 'bg-green-300';
    return isLight ? 'bg-amber-100' : 'bg-amber-800';
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-amber-900 mb-2 flex items-center justify-center gap-2">
            <Trophy className="w-8 h-8" />
            Resume Chess
          </h1>
          <p className="text-amber-700">
            Strategic career moves where each piece represents a different
            professional role!
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Game Board */}
          <div className="flex-1 flex justify-center">
            <div className="bg-amber-900 p-4 rounded-lg shadow-2xl">
              <div className="grid grid-cols-8 gap-0 border-2 border-amber-900">
                {board.map((row, rowIndex) =>
                  row.map((piece, colIndex) => (
                    <motion.div
                      key={`${rowIndex}-${colIndex}`}
                      className={`w-16 h-16 flex items-center justify-center cursor-pointer relative ${getSquareColor(
                        rowIndex,
                        colIndex
                      )}`}
                      onClick={() => handleSquareClick(rowIndex, colIndex)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {piece && (
                        <motion.div
                          className={`text-2xl ${
                            piece.isWhite ? 'text-white' : 'text-black'
                          } drop-shadow-lg`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          {getPieceIcon(piece)}
                        </motion.div>
                      )}

                      {/* Coordinate labels */}
                      {rowIndex === 7 && (
                        <div className="absolute bottom-0 right-0 text-xs text-amber-600 font-bold">
                          {String.fromCharCode(97 + colIndex)}
                        </div>
                      )}
                      {colIndex === 0 && (
                        <div className="absolute top-0 left-0 text-xs text-amber-600 font-bold">
                          {8 - rowIndex}
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Game Info Panel */}
          <div className="lg:w-80 space-y-4">
            {/* Game Status */}
            <div className="bg-white rounded-lg p-4 shadow-lg border border-amber-200">
              <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                <Info className="w-5 h-5" />
                Game Status
              </h3>
              <div className="space-y-2">
                <div
                  className={`p-2 rounded ${
                    currentPlayer === 'white'
                      ? 'bg-gray-100'
                      : 'bg-gray-800 text-white'
                  }`}
                >
                  Current Player:{' '}
                  {currentPlayer === 'white' ? 'White Team' : 'Black Team'}
                </div>
                {gameStatus.startsWith('checkmate') && (
                  <div className="p-2 bg-red-100 text-red-800 rounded">
                    Checkmate! {gameStatus.split('-')[1]} wins!
                  </div>
                )}
                <button
                  onClick={resetGame}
                  className="w-full bg-amber-600 text-white p-2 rounded hover:bg-amber-700 transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  New Game
                </button>
              </div>
            </div>

            {/* Selected Piece Info */}
            {selectedPieceInfo && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg p-4 shadow-lg border border-amber-200"
              >
                <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Selected Professional
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {getPieceIcon(selectedPieceInfo)}
                    <span className="font-semibold">
                      {PIECE_ROLES[selectedPieceInfo.type].role}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {PIECE_ROLES[selectedPieceInfo.type].description}
                  </p>
                  {selectedPieceInfo.resumeData.name && (
                    <div className="border-t pt-2">
                      <p className="font-medium">
                        {selectedPieceInfo.resumeData.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedPieceInfo.resumeData.label}
                      </p>
                      <div className="flex gap-4 mt-1 text-xs">
                        <span>
                          Experience: {selectedPieceInfo.experience} roles
                        </span>
                        <span>Skills: {selectedPieceInfo.skills} listed</span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Captured Pieces */}
            <div className="bg-white rounded-lg p-4 shadow-lg border border-amber-200">
              <h3 className="font-bold text-amber-900 mb-2">
                Captured Professionals
              </h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium">White Team Lost:</p>
                  <div className="flex flex-wrap gap-1">
                    {capturedPieces.white.map((piece, index) => (
                      <div key={index} className="text-gray-400 text-sm">
                        {getPieceIcon(piece)}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Black Team Lost:</p>
                  <div className="flex flex-wrap gap-1">
                    {capturedPieces.black.map((piece, index) => (
                      <div key={index} className="text-gray-400 text-sm">
                        {getPieceIcon(piece)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Piece Legend */}
            <div className="bg-white rounded-lg p-4 shadow-lg border border-amber-200">
              <h3 className="font-bold text-amber-900 mb-2">Career Roles</h3>
              <div className="space-y-1 text-sm">
                {Object.entries(PIECE_ROLES).map(([piece, data]) => (
                  <div key={piece} className="flex items-center gap-2">
                    <data.icon
                      className="w-4 h-4"
                      style={{ color: data.color }}
                    />
                    <span className="font-medium">{data.role}</span>
                    <span className="text-gray-500">({piece})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Move History */}
        {moveHistory.length > 0 && (
          <div className="mt-6 bg-white rounded-lg p-4 shadow-lg border border-amber-200">
            <h3 className="font-bold text-amber-900 mb-2">
              Career Moves History
            </h3>
            <div className="max-h-32 overflow-y-auto">
              <div className="grid grid-cols-2 gap-2 text-sm">
                {moveHistory.map((move, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-gray-500">{index + 1}.</span>
                    {getPieceIcon(move.piece)}
                    <span>
                      {String.fromCharCode(97 + move.from[1])}
                      {8 - move.from[0]} →{' '}
                      {String.fromCharCode(97 + move.to[1])}
                      {8 - move.to[0]}
                    </span>
                    {move.captured && <span className="text-red-500">×</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
