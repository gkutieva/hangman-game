/*----- constants -----*/
const WORDS = [
    'ARRAY', 'FUNCTION', 'BINARY', 'VARIABLE', 'BOOLEAN','REACT', 'COMPUTER SCIENCE', 'TERMINAL', 'EVENTS'
];
const PANEL_WIDTH = 15;
const FATAL_NUM_GUESSES = 6;
/*----- app's state (variables) -----*/

let secretWord;
let guessWord;
let gameStatus; // // null = in progress; 👎 = lose; 👍 = win
let wrongLetters;

/*----- cached element references -----*/
const guessEl = document.getElementById('guess');
const replayBtn = document.getElementById('replay');
const gallowsEl = document.getElementById('gallows');
const letterBtns = document.querySelectorAll('section > button');
const msgEl = document.getElementById('msg');


/*----- event listeners -----*/
document.querySelector('section')
    .addEventListener('click', handleLetterClick);

    document.getElementById('replay')
    .addEventListener('click', init);

/*----- functions -----*/
init();

function handleLetterClick(evt) {
    const letter = evt.target.textContent;
     if (evt.target.tagName !== 'BUTTON' || gameStatus) return; 
    // if the letter is in the secret word
    // update guessWord where all occurances of that letter is in the secret
    let newGuess = '';
    if (secretWord.includes(letter)) {
        for (let i = 0; i < secretWord.length; i++) {
            newGuess += secretWord.charAt(i) === letter ? letter : guessWord.charAt(i);
        }
        guessWord = newGuess;
    //otherwise add the letter to the wrongLetters
    } else {
       wrongLetters.push(letter);
    }
    
    gameStatus = getGameStatus();

    render();
}

function getGameStatus() {
    if (guessWord === secretWord) {
        return '👍';
    } else if (wrongLetters.length === FATAL_NUM_GUESSES) {
        return '👎';
    } else {
        return null;
    }
}

function handleReplayClick() {

}

function render() {
    guessEl.textContent = guessWord;
    replayBtn.style.visibility = gameStatus ? 'visible' : 'hidden';
    gallowsEl.style.backgroundPositionX = `-${wrongLetters.length * PANEL_WIDTH}vmin`;
    renderButtons();
    renderMessage();
}

function renderMessage() {
    if (gameStatus === '👍') {
        msgEl.textContent = 'CONGRATS - YOU WON!';
    } else if (gameStatus === '👎'){
        msgEl.textContent = 'SORRY - YOU LOST';
    } else {
        const numRemaining = FATAL_NUM_GUESSES - wrongLetters.length;
        msgEl.innerHTML = `GOOD LUCK!<br><span>${numRemaining} WRONG GUESS ${numRemaining === 1 ? '' : 'ES'} REMAINING</span>`;
    }
}

function renderButtons() {
    letterBtns.forEach(function(btn){
        const letter = btn.textContent;
        btn.disabled = guessWord.includes(letter) || wrongLetters.includes(letter);
        if (guessWord.includes(letter)) {
            btn.className = 'valid-letter';
        } else if (wrongLetters.includes(letter)) {
            btn.className = 'wrong-letter';
        } else {
            btn.className = '';
        }
    });
}

function init() {
    const rndIdx = Math.floor(Math.random() * WORDS.length);
    secretWord = WORDS[rndIdx];
    guessWord = '';
    //init guessWord with _ for each char in secretWord
    for (let char of secretWord) {
        guessWord += (char === ' ') ? ' ' : '_';
    }
    gameStatus = null;
    wrongLetters = [];
    render();
}