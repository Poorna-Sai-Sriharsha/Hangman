// ----- GAME DATA -----
// Word list for different difficulty levels
const wordList = {
    easy: [
        { word: "cat", hint: "A small pet" },
        { word: "sun", hint: "Shines during the day" },
        { word: "dog", hint: "Man's best friend" },
        { word: "hat", hint: "Worn on your head" },
        { word: "run", hint: "Move quickly on foot" },
        { word: "pen", hint: "Used for writing" },
        { word: "cup", hint: "Holds your drink" },
        { word: "map", hint: "Shows directions" },
        { word: "box", hint: "Square container" },
        { word: "key", hint: "Opens doors" },
        { word: "book", hint: "Contains stories" },
        { word: "fish", hint: "Lives in water" },
        { word: "tree", hint: "Has leaves and branches" },
        { word: "bird", hint: "Flies in the sky" },
        { word: "star", hint: "Shines at night" },
        { word: "moon", hint: "Visible at night" },
        { word: "rain", hint: "Falls from clouds" },
        { word: "snow", hint: "White and cold" },
        { word: "wind", hint: "Moves the leaves" },
        { word: "fire", hint: "Provides warmth" }
    ],
    medium: [
        { word: "guitar", hint: "A musical instrument" },
        { word: "python", hint: "Programming language" },
        { word: "basket", hint: "Used for carrying items" },
        { word: "window", hint: "Lets light into a room" },
        { word: "pencil", hint: "Writing tool with graphite" },
        { word: "camera", hint: "Takes photographs" },
        { word: "dragon", hint: "Mythical flying creature" },
        { word: "puzzle", hint: "Game with pieces to fit" },
        { word: "rocket", hint: "Flies to space" },
        { word: "garden", hint: "Where plants grow" },
        { word: "castle", hint: "Home of kings and queens" },
        { word: "bridge", hint: "Crosses over water" },
        { word: "tunnel", hint: "Path under ground" },
        { word: "forest", hint: "Many trees together" },
        { word: "island", hint: "Land surrounded by water" },
        { word: "desert", hint: "Hot and sandy place" },
        { word: "volcano", hint: "Mountain that erupts" },
        { word: "diamond", hint: "Precious gemstone" },
        { word: "whistle", hint: "Makes a high sound" },
        { word: "bicycle", hint: "Two-wheeled vehicle" }
    ],
    hard: [
        { word: "chocolate", hint: "Made from cocoa beans" },
        { word: "elephant", hint: "The largest land animal" },
        { word: "butterfly", hint: "Insect with colorful wings" },
        { word: "computer", hint: "Electronic device for processing data" },
        { word: "umbrella", hint: "Protects from rain" },
        { word: "dinosaur", hint: "Prehistoric reptile" },
        { word: "mountain", hint: "Very tall landform" },
        { word: "rainbow", hint: "Colorful arc in sky" },
        { word: "octopus", hint: "Sea creature with eight arms" },
        { word: "penguin", hint: "Bird that can't fly" },
        { word: "dolphin", hint: "Intelligent sea mammal" },
        { word: "giraffe", hint: "Animal with long neck" },
        { word: "kangaroo", hint: "Jumps with its tail" },
        { word: "pineapple", hint: "Spiky tropical fruit" },
        { word: "waterfall", hint: "Falling water" },
        { word: "tornado", hint: "Spinning wind storm" },
        { word: "volcano", hint: "Mountain that erupts" },
        { word: "diamond", hint: "Precious gemstone" },
        { word: "whistle", hint: "Makes a high sound" },
        { word: "bicycle", hint: "Two-wheeled vehicle" }
    ]
};
// ----- DOM ELEMENTS -----
// Get all necessary HTML elements
const hangmanImage = document.getElementById("hangman-image");
const wordDisplay = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses-text b");
const keyboardDiv = document.querySelector(".keyboard");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = document.querySelector(".play-again");
const hintText = document.querySelector(".hint-text b");
const timerText = document.getElementById("timer");
const scoreText = document.getElementById("score");
const currentDifficultyText = document.getElementById("current-difficulty");
// ----- GAME VARIABLES -----
let currentWord = "";          
let correctLetters = [];       
let wrongGuessCount = 0;       
let timer;                     
let timeLeft = 60;            
let score = 0;                
let keyboardButtons = {};     
const maxGuesses = 6;         
// Initialize score display
scoreText.innerText = score;
// ----- GAME FUNCTIONS -----
// Function to get random difficulty level
function getRandomDifficulty() {
    const difficulties = ['easy', 'medium', 'hard'];
    return difficulties[Math.floor(Math.random() * difficulties.length)];
}
// Function to start the game timer
const startTimer = () => {
    clearInterval(timer);
    timeLeft = 60;
    timerText.innerText = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        timerText.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            gameOver(false);
        }
    }, 1000);
};
// Function to reset game state
const resetGame = () => {
    correctLetters = [];
    wrongGuessCount = 0;
    hangmanImage.src = `Hangman_Assets/hangman-0.svg`;
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
    wordDisplay.innerHTML = currentWord.split("").map(() => `<div class="letter"></div>`).join("");
    gameModal.classList.remove("show");
    startTimer();
};
// Function to get random word from word list
const getRandomWord = () => {
    const level = getRandomDifficulty();
    currentDifficultyText.textContent = level.charAt(0).toUpperCase() + level.slice(1);
    const { word, hint } = wordList[level][Math.floor(Math.random() * wordList[level].length)];
    currentWord = word;
    hintText.innerText = hint;
    document.querySelector(".hint-text").style.visibility = "visible";
    resetGame();
};
// Function to handle game over
const gameOver = (won) => {
    clearInterval(timer);
    gameModal.querySelector("img").src = `Hangman_Assets/${won ? "victory" : "lost"}.gif`;
    gameModal.querySelector("h4").innerText = won ? "Congrats!" : "Game Over!";
    gameModal.querySelector("p").innerHTML = `${won ? "You found the word:" : "The correct word was:"} <b>${currentWord}</b>`;
    gameModal.classList.add("show");
    if (won) {
        score++;
        scoreText.innerText = score;
    }
};
// Function to initialize game with letter guess
const initGame = (btn, letter) => {
    if (currentWord.includes(letter)) {
        // Handle correct guess
        [...currentWord].forEach((char, i) => {
            if (char === letter) {
                correctLetters.push(char);
                const el = wordDisplay.children[i];
                el.innerText = char;
                el.classList.add("guessed");
            }
        });
    } else {
        // Handle wrong guess
        wrongGuessCount++;
        hangmanImage.src = `Hangman_Assets/hangman-${wrongGuessCount}.svg`;
    }
    btn.disabled = true;
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
    // Check game end conditions
    if (wrongGuessCount === maxGuesses) return gameOver(false);
    const allRevealed = [...wordDisplay.children].every(el => el.classList.contains("guessed"));
    if (allRevealed) return gameOver(true);
};
// ----- EVENT LISTENERS -----
// Add keyboard event listener
document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    if (/^[a-z]$/.test(key) && !gameModal.classList.contains("show")) {
        const button = keyboardButtons[key];
        if (button && !button.disabled) {
            button.click();
        }
    }
    if (key === "enter" && gameModal.classList.contains("show")) {
        playAgainBtn.click();
    }
});
// Create keyboard buttons
for (let i = 97; i <= 122; i++) {
    const btn = document.createElement("button");
    const letter = String.fromCharCode(i);
    btn.innerText = letter;
    btn.addEventListener("click", (e) => initGame(e.target, letter));
    keyboardDiv.appendChild(btn);
    keyboardButtons[letter] = btn;
}
// Add event listener for play again button
playAgainBtn.addEventListener("click", getRandomWord);
// Start the game
getRandomWord();