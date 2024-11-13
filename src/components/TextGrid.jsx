import { MdOutlineRestartAlt } from "react-icons/md";
import { BiPlayCircle } from "react-icons/bi";
import { BiPauseCircle } from "react-icons/bi";
import React, { useState, useEffect, useCallback } from "react";

const SPRITE_STATES = {
  RUNNING: [
    // "/assets/images/Idle__000.png",
    "/assets/images/Run__000.png",
    "/assets/images/Run__000.png",
    "/assets/images/Run__001.png",
    "/assets/images/Run__007.png",
    "/assets/images/Run__008.png",
    "/assets/images/Run__009.png",
  ],
  JUMPING: [
    "/assets/images/Jump__005.png",
    "/assets/images/Jump__006.png",
    "/assets/images/Jump__007.png",
  ],
};

const TextGrid = () => {
  const ROWS = 15;
  const COLS = 20;
  const [grid, setGrid] = useState(
    Array(ROWS)
      .fill()
      .map(() => Array(COLS).fill(0))
  );
  const [color, setColor] = useState("#00ff00");
  const [position, setPosition] = useState(COLS);
  const [username, setUsername] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [playerY, setPlayerY] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [obstacles, setObstacles] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [spriteFrame, setSpriteFrame] = useState(0);
  const [buildingOffset, setBuildingOffset] = useState(0);
  const [groundOffset, setGroundOffset] = useState(0);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [displayText, setDisplayText] = useState("MATRIX");

  const restartGame = () => {
    setScore(0);
    setGameOver(false);
    setObstacles([]);
    setPlayerY(0);
    setIsJumping(false);
    setDisplayText(username.toUpperCase());
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const startGame = () => {
    if (username) {
      setGameStarted(true);
      setDisplayText(username.toUpperCase());
    }
  };

  const jump = useCallback(() => {
    if (!isJumping && !gameOver) {
      setIsJumping(true);
      setPlayerY(100);
      setTimeout(() => {
        setPlayerY(0);
        setIsJumping(false);
      }, 500);
    }
  }, [isJumping, gameOver]);

  useEffect(() => {
    if (gameStarted && !gameOver && !isPaused) {
      const animationInterval = setInterval(() => {
        setSpriteFrame((prev) => (prev + 1) % (isJumping ? 3 : 6));
        setBuildingOffset((prev) => (prev - 2) % 1200);
        setGroundOffset((prev) => (prev - 5) % 800);
      }, 150);
      return () => clearInterval(animationInterval);
    }
  }, [gameStarted, gameOver, isJumping, isPaused]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === "Space") {
        jump();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [jump]);

  // Inside your component, update the obstacle generation:
  useEffect(() => {
    if (gameStarted && !gameOver && !isPaused) {
      const obstacleInterval = setInterval(() => {
        setObstacles((prev) => {
          const newObstacles = prev
            .map((x) => ({ ...x, position: x.position - 5 }))
            .filter((x) => x.position > -20);

          if (Math.random() < 0.02) {
            newObstacles.push({
              position: 800,
              type: Math.random() > 0.5 ? "bat" : "cactus",
              height: Math.random() > 0.5 ? 40 : 30,
            });
          }
          return newObstacles;
        });

        setScore((prev) => prev + 1);
      }, 50);

      return () => clearInterval(obstacleInterval);
    }
  }, [gameStarted, gameOver, isPaused]);

  useEffect(() => {
    if (gameStarted) {
      const checkCollision = () => {
        const playerRect = {
          x: 50,
          y: 300 - playerY,
          width: 60, // Adjusted to match visible player size
          height: 80,
        };

        obstacles.forEach((obstacle) => {
          const obstacleRect = {
            x: obstacle.position,
            y: 300 - obstacle.height,
            width: 40,
            height: obstacle.height,
          };

          if (
            playerRect.x < obstacleRect.x + obstacleRect.width &&
            playerRect.x + playerRect.width > obstacleRect.x &&
            playerRect.y < obstacleRect.y + obstacleRect.height &&
            playerRect.y + playerRect.height > obstacleRect.y
          ) {
            setGameOver(true);
            setDisplayText(`GAME OVER ${username} - ${score}`);
          }
        });
      };

      const gameLoop = setInterval(checkCollision, 16); // More frequent checks
      return () => clearInterval(gameLoop);
    }
  }, [obstacles, playerY, username, score, gameStarted]);

  // Add touch controls for mobile
  useEffect(() => {
    const handleTouch = (e) => {
      e.preventDefault();
      jump();
    };

    if (gameStarted) {
      window.addEventListener("touchstart", handleTouch);
      return () => window.removeEventListener("touchstart", handleTouch);
    }
  }, [gameStarted, jump]);

  // Define horizontal character patterns (5x7 format for each letter)
  const characterPatterns = {
    A: [
      [0, 1, 1, 1, 0],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
    ],
    B: [
      [1, 1, 1, 1, 0],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 1, 1, 1, 0],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 1, 1, 1, 0],
    ],
    C: [
      [0, 1, 1, 1, 0],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 1],
      [0, 1, 1, 1, 0],
    ],
    D: [
      [1, 1, 1, 1, 0],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 1, 1, 1, 0],
    ],
    E: [
      [1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [1, 1, 1, 1, 0],
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [1, 1, 1, 1, 1],
    ],
    F: [
      [1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [1, 1, 1, 1, 0],
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
    ],
    G: [
      [0, 1, 1, 1, 0],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 0],
      [1, 0, 1, 1, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [0, 1, 1, 1, 0],
    ],
    H: [
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
    ],
    I: [
      [1, 1, 1, 1, 1],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [1, 1, 1, 1, 1],
    ],
    J: [
      [1, 1, 1, 1, 1],
      [0, 0, 0, 1, 0],
      [0, 0, 0, 1, 0],
      [0, 0, 0, 1, 0],
      [1, 0, 0, 1, 0],
      [1, 0, 0, 1, 0],
      [0, 1, 1, 0, 0],
    ],
    K: [
      [1, 0, 0, 0, 1],
      [1, 0, 0, 1, 0],
      [1, 0, 1, 0, 0],
      [1, 1, 0, 0, 0],
      [1, 0, 1, 0, 0],
      [1, 0, 0, 1, 0],
      [1, 0, 0, 0, 1],
    ],
    L: [
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [1, 1, 1, 1, 1],
    ],
    M: [
      [1, 0, 0, 0, 1],
      [1, 1, 0, 1, 1],
      [1, 0, 1, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
    ],
    N: [
      [1, 0, 0, 0, 1],
      [1, 1, 0, 0, 1],
      [1, 0, 1, 0, 1],
      [1, 0, 0, 1, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
    ],
    O: [
      [0, 1, 1, 1, 0],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [0, 1, 1, 1, 0],
    ],
    P: [
      [1, 1, 1, 1, 0],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 1, 1, 1, 0],
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
    ],
    Q: [
      [0, 1, 1, 1, 0],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 1, 0, 1],
      [1, 0, 0, 1, 0],
      [0, 1, 1, 0, 1],
    ],
    R: [
      [1, 1, 1, 1, 0],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 1, 1, 1, 0],
      [1, 0, 1, 0, 0],
      [1, 0, 0, 1, 0],
      [1, 0, 0, 0, 1],
    ],
    S: [
      [0, 1, 1, 1, 0],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [0, 1, 1, 1, 0],
    ],
    T: [
      [1, 1, 1, 1, 1],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
    ],
    U: [
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [0, 1, 1, 1, 0],
    ],
    V: [
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [0, 1, 0, 1, 0],
      [0, 0, 1, 0, 0],
    ],
    W: [
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1],
      [1, 1, 0, 1, 1],
      [1, 0, 0, 0, 1],
    ],
    X: [
      [1, 0, 0, 0, 1],
      [0, 1, 0, 1, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 1, 0, 1, 0],
      [1, 0, 0, 0, 1],
    ],
    Y: [
      [1, 0, 0, 0, 1],
      [0, 1, 0, 1, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
    ],
    Z: [
      [1, 1, 1, 1, 1],
      [0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0],
      [0, 1, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [1, 1, 1, 1, 1],
    ],
    0: [
      [0, 1, 1, 1, 0],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 1, 1],
      [1, 0, 1, 0, 1],
      [1, 1, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [0, 1, 1, 1, 0],
    ],
    1: [
      [0, 0, 1, 0, 0],
      [0, 1, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [1, 1, 1, 1, 1],
    ],
    2: [
      [0, 1, 1, 1, 0],
      [1, 0, 0, 0, 1],
      [0, 0, 0, 0, 1],
      [0, 0, 1, 1, 0],
      [0, 1, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [1, 1, 1, 1, 1],
    ],
    3: [
      [0, 1, 1, 1, 0],
      [1, 0, 0, 0, 1],
      [0, 0, 0, 0, 1],
      [0, 0, 1, 1, 0],
      [0, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [0, 1, 1, 1, 0],
    ],
    4: [
      [0, 0, 0, 1, 0],
      [0, 0, 1, 1, 0],
      [0, 1, 0, 1, 0],
      [1, 0, 0, 1, 0],
      [1, 1, 1, 1, 1],
      [0, 0, 0, 1, 0],
      [0, 0, 0, 1, 0],
    ],
    5: [
      [1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0],
      [1, 1, 1, 1, 0],
      [0, 0, 0, 0, 1],
      [0, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [0, 1, 1, 1, 0],
    ],
    6: [
      [0, 1, 1, 1, 0],
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [1, 1, 1, 1, 0],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [0, 1, 1, 1, 0],
    ],
    7: [
      [1, 1, 1, 1, 1],
      [0, 0, 0, 0, 1],
      [0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 1, 0, 0, 0],
    ],
    8: [
      [0, 1, 1, 1, 0],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [0, 1, 1, 1, 0],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [0, 1, 1, 1, 0],
    ],
    9: [
      [0, 1, 1, 1, 0],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [0, 1, 1, 1, 1],
      [0, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [0, 1, 1, 1, 0],
    ],
    " ": [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ],
  };

  useEffect(() => {
    const moveInterval = setInterval(() => {
      setPosition((prev) =>
        prev <= -displayText.length * 6 ? COLS : prev - 1
      );
    }, 100);
    return () => clearInterval(moveInterval);
  }, [displayText.length]);

  useEffect(() => {
    const newGrid = Array(ROWS)
      .fill()
      .map(() => Array(COLS).fill(0));
    let currentCol = position;

    displayText.split("").forEach((char) => {
      const pattern = characterPatterns[char];
      if (pattern) {
        const startRow = Math.floor((ROWS - 7) / 2);
        pattern.forEach((row, i) => {
          row.forEach((cell, j) => {
            const col = currentCol + j;
            if (col >= 0 && col < COLS) {
              newGrid[startRow + i][col] = cell;
            }
          });
        });
        currentCol += 6;
      }
    });

    setGrid(newGrid);
  }, [position, displayText]);

  useEffect(() => {
    const interval = setInterval(() => {
      setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black gap-4">
      {!gameStarted && (
        <>
          <h1 className="font-black pb-6">Ninja Run Game</h1>
          <div className="flex flex-col items-center gap-4 mb-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-green-500"
              placeholder="Enter username"
              maxLength={10}
            />
            <button
              onClick={startGame}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Start Game
            </button>
          </div>
        </>
      )}

      {gameStarted && (
        <div className="relative w-full h-[calc(100dvh)] border-t overflow-hidden bg-gray-900">
          {/* TV Display Box */}
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-20">
            <div className="w-[400px] h-[200px] bg-black border-4 border-gray-700 rounded-lg shadow-2xl overflow-hidden relative">
              {/* Game Controls */}
              <div className="text-green-500 absolute">Score</div>
              <div className="flex justify-between gap-4 items-center px-4 py-2 absolute top-20 -translate-x-14 z-20 rotate-90 left-0">
                <div className="text-green-500">{score}</div>
                <div className="flex gap-2 items-center">
                  <button
                    onClick={togglePause}
                    className="px-2 py-1 bg-transparent"
                  >
                    {isPaused ? (
                      <BiPlayCircle size={20} />
                    ) : (
                      <BiPauseCircle size={20} />
                    )}
                  </button>
                  <button
                    onClick={restartGame}
                    className="px-2 py-1 bg-transparent"
                  >
                    <MdOutlineRestartAlt />
                  </button>
                </div>
              </div>
              <div
                className="grid-container"
                style={{
                  transform: "scale(0.8)",
                  transformOrigin: "top center",
                }}
              >
                {/* Your existing grid content */}
                <div
                  className="grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${COLS}, 20px)`,
                    gap: "1px",
                    padding: "8px",
                  }}
                >
                  {grid.map((row, i) =>
                    row.map((cell, j) => (
                      <div
                        key={`${i}-${j}`}
                        style={{
                          backgroundColor: cell ? color : "#1a1a1a",
                          transition: "background-color 0.3s",
                          width: "20px",
                          height: "20px",
                        }}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Parallax Buildings Background */}
          <div
            className="absolute w-[2400px] h-[300px] mt-80"
            style={{
              background: 'url("/assets/background/buildings.png")',
              transform: `translateX(${buildingOffset}px)`,
              transition: "transform 0.1s linear",
            }}
          />

          {/* Ground with Parallax Effect */}
          <div
            className="absolute bottom-0 w-[1000px] h-[80px]"
            style={{
              background: 'url("/assets/background/road.png")',
              transform: `translateX(${groundOffset}px)`,
              transition: "transform 0.1s linear",
            }}
          />

          {/* Player Character */}
          <div
            className="absolute w-[350px] h-[430px]"
            style={{
              left: "50px",
              bottom: `${playerY}px`,
              transition: "bottom 0.5s",
              background: `url(${
                isJumping
                  ? SPRITE_STATES.JUMPING[spriteFrame]
                  : SPRITE_STATES.RUNNING[spriteFrame]
              })`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              willChange: "background",
              imageRendering: "pixelated",
              transform: "scale(0.3) translateY(400px)",
            }}
          />
          {/* Enhanced Obstacles */}
          {obstacles.map((obstacle, index) => (
            <div
              key={index}
              className="absolute w-[60px] h-[60px]"
              style={{
                left: `${obstacle.position}px`,
                bottom: "50px", // Adjusted to sit on ground
                background: `url(${
                  obstacle.type === "bat"
                    ? "/assets/obstacles/bat.png"
                    : "/assets/obstacles/cactus.png"
                })`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TextGrid;
