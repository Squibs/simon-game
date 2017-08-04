class Simon {
  constructor() {
    this.gameButtons = ['g', 'r', 'y', 'b']; // stores game buttons
    this.gameSeed = ''; // order in which buttons need to be pressed
    this.currentString = ''; // stores buttons that have already been pressed
    this.strictMode = false; // controls whether or not strict mode is enabled
    this.powerState = false; // controls whether the power has been turned on or not

    // audio files for each button
    this.greenAudio = new Audio('../media/simonSound1.mp3');
    this.redAudio = new Audio('../media/simonSound2.mp3');
    this.yellowAudio = new Audio('../media/simonSound3.mp3');
    this.blueAudio = new Audio('../media/simonSound4.mp3');
    this.errorAudio = new Audio('../media/bzzzt.mp3');
  }

  // turns the device on and off
  togglePowerState() {
    this.powerState = this.powerState === false;
  }

  // resets everything to default; then generates a new game
  resetGame() {
    this.gameSeed = '';
    this.currentString = '';
    this.generateGameSeed();
  }

  // toggles strict mode on or off
  toggleStrictMode() {
    this.strictMode = this.strictMode === false;
  }

  // generates a game string
  generateGameSeed() {
    // generate new game seed
    for (let i = 0; i <= 20; i += 1) {
      this.gameSeed += this.gameButtons[Math.floor(Math.random() * 4)];
    }
  }

  // handles what happens when any control button is pressed
  controlButtonPressed(buttonPressed) {

  }

  // handles what happens when any game button is pressed
  gameButtonPressed(buttonPressed) {

  }
}

// creates a simon class object
const simon = new Simon();
console.log(simon);
console.log('Game String:', simon.gameString);


/* *******************************
    BUTTON LISTENERS AND HANDLERS
   ******************************* */
// handles simon class methods get called depending on which button is pressed
const buttonListener = function () {
  console.log(this.value, 'clicked');

  switch (this.value) {
    // game buttons
    case 'green':
      simon.gameButtonPressed('green');
      break;
    case 'red':
      simon.gameButtonPressed('red');
      break;
    case 'yellow':
      simon.gameButtonPressed('yellow');
      break;
    case 'blue':
      simon.gameButtonPressed('blue');
      break;
    // control buttons
    case 'c-blue':
      simon.controlButtonPressed('off');
      break;
    case 'c-yellow':
      simon.controlButtonPressed('start');
      break;
    case 'c-red':
      simon.controlButtonPressed('strict');
      break;
    case 'c-green':
      simon.controlButtonPressed('points');
      break;
    // default
    default:
      break;
  }
};

// stores HTMLCollection of all buttons in variable 'buttons'
const buttons = document.getElementsByTagName('button');

// iterate through 'buttons' and add a listener for each button
for (let i = 0; i < buttons.length; i += 1) {
  buttons.item(i).addEventListener('click', buttonListener);
}


/* ***************************************************************************
    TODO:
      - Switch audio to AudioContext sounds (AudioContext.createOscillator())
        + (https://developer.mozilla.org/en-US/docs/Web/API/AudioContext)
   *************************************************************************** */
