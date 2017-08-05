/* ******************************************************************
    SIMON GAME OBJECT:
      - Features a stunning 8 buttons:
        + 4 game buttons
        + 4 game control / option buttons

      - On / Off button
        + turns the game on off (to resemble an actual device!)
        + features a startup light-show when device turns on
          = every button lights up in a spiral!

      - Start button
        + starts the simon game
        + resets the game regardless of progress / stage of the game

      - Strict mode button
        + sets the game mode to 'strict'
          = no mistakes; you mess up once you have to restart
        + stays lit-up when enabled

      - Count button
        + displays the current score / correct button press count
        + when this button is pressed it does nothing!
          = or it switches to display something else (WIP)
   ****************************************************************** */
class Simon {
  constructor() {
    this.gameSeedValues = ['g', 'r', 'y', 'b']; // stores game seed values
    this.gameSeed = ''; // order in which buttons need to be pressed
    this.currentString = ''; // stores buttons that have already been pressed
    this.strictMode = false; // controls whether or not strict mode is enabled
    this.powerState = false; // controls whether the power has been turned on or not
    this.gameStart = false; // controls whether the game has started or not
    this.lightShowLength = 4.00; // controls the length of the light show (in seconds)

    // audio files for each button
    this.greenAudio = new Audio('../media/simonSound1.mp3');
    this.redAudio = new Audio('../media/simonSound2.mp3');
    this.yellowAudio = new Audio('../media/simonSound3.mp3');
    this.blueAudio = new Audio('../media/simonSound4.mp3');
    this.errorAudio = new Audio('../media/bzzzt.mp3');

    // stores HTMLCollection of all buttons in variable 'buttons'
    this.buttons = document.getElementsByTagName('button');

    // disable all buttons initially; except power
    for (let i = 0; i < this.buttons.length; i += 1) {
      this.buttons[i].disabled = true;
      this.buttons[4].disabled = false;
    }
  }

  // handles simon class methods get called depending on which button is pressed
  buttonHandler(button) {
    console.log(button);
    switch (button) {
      // game buttons
      case 'green':
        this.gameButtonPressed('g');
        break;
      case 'red':
        this.gameButtonPressed('r');
        break;
      case 'yellow':
        this.gameButtonPressed('y');
        break;
      case 'blue':
        this.gameButtonPressed('b');
        break;
      // control buttons
      case 'c-blue':
        this.controlButtonPressed('power');
        break;
      case 'c-yellow':
        this.controlButtonPressed('start');
        break;
      case 'c-red':
        this.controlButtonPressed('strict');
        break;
      case 'c-green':
        this.controlButtonPressed('count');
        break;
      // default
      default:
        break;
    }
  }

  // handles what happens when any game button is pressed
  gameButtonPressed(buttonPressed) {
    this.currentString += buttonPressed;
  }

  // handles what happens when any control button is pressed
  controlButtonPressed(buttonPressed) {
    if (buttonPressed === 'power') {
      this.togglePowerState();
    } else if (buttonPressed === 'start') {
      this.resetGame();
    } else if (buttonPressed === 'strict') {
      this.toggleStrictMode();
    } else if (buttonPressed === 'count') {
      // do something
    }
  }

  lightShow() {
    const that = this;
    const enableLight = function (light) {
      that.buttons[light].classList.add('active');
    };

    const disableLight = function (light) {
      that.buttons[light].classList.remove('active');
    };

    // enable lights clockwise
    setTimeout(() => { enableLight(0); }, 0);
    setTimeout(() => { enableLight(1); }, 35);
    setTimeout(() => { enableLight(2); }, 70);
    setTimeout(() => { enableLight(3); }, 105);
    setTimeout(() => { enableLight(4); }, 140);
    setTimeout(() => { enableLight(5); }, 175);
    setTimeout(() => { enableLight(6); }, 210);
    setTimeout(() => { enableLight(7); }, 245);

    // disable lights anti-clockwise
    setTimeout(() => { disableLight(7); }, 300);
    setTimeout(() => { disableLight(6); }, 335);
    setTimeout(() => { disableLight(5); }, 370);
    setTimeout(() => { disableLight(4); }, 405);
    setTimeout(() => { disableLight(3); }, 440);
    setTimeout(() => { disableLight(2); }, 475);
    setTimeout(() => { disableLight(1); }, 510);
    setTimeout(() => { disableLight(0); }, 545);

    // turn power button light on once show is done
    setTimeout(() => { enableLight(4); }, 600);
  }

  // turns the device on and off
  togglePowerState() {
    // toggles powerstate
    this.powerState = this.powerState === false;

    // stores the blue control button (DOM element)
    const powerButton = document.getElementById('control-blue-button');

    // if power is on
    if (this.powerState === true) {
      // do a light show!
      this.lightShow();

      // change button text to 'on'; light up button
      powerButton.innerHTML = 'On<br><i class="fa fa-2x fa-power-off"></i>';
      powerButton.classList.add('active');

      // enable control buttons
      for (let i = 5; i < this.buttons.length; i += 1) {
        this.buttons[i].disabled = false;
        this.buttons[i].classList.add('cursor');
        this.buttons[i].classList.add('hasactive');
      }
    // if power is off
    } else if (this.powerState === false) {
      // change button text to 'off'; turn button light off
      powerButton.innerHTML = 'Off<br><i class="fa fa-2x fa-power-off"></i>';
      powerButton.classList.remove('active');

      // disable control buttons
      for (let i = 5; i < this.buttons.length; i += 1) {
        this.buttons[i].disabled = true;
        this.buttons[i].classList.remove('cursor');
        this.buttons[i].classList.remove('hasactive');
      }
    }
  }

  // resets everything to default; then generates a new game
  resetGame() {
    this.gameSeed = '';
    this.currentString = '';
    this.generateGameSeed();
  }

  // toggles strict mode on or off
  toggleStrictMode() {
    // toggles strict mode
    this.strictMode = this.strictMode === false;

    // stores the red control button (DOM element)
    const strictButton = document.getElementById('control-red-button');

    // add or remove active state for the red control button (lights the button up)
    if (this.strictMode === true) {
      strictButton.classList.add('active');
    } else if (this.strictMode === false) {
      strictButton.classList.remove('active');
    }
  }

  // generates a game string
  generateGameSeed() {
    // generate new game seed
    for (let i = 0; i <= 20; i += 1) {
      this.gameSeed += this.gameButtons[Math.floor(Math.random() * 4)];
    }
  }
}


/* ***************************************
    CREATE GAME OBJECT & BUTTON LISTENERS
   *************************************** */
// creates a simon class object
const simon = new Simon();
console.log(simon);

// stores HTMLCollection of all buttons in variable 'buttons'
const buttons = document.getElementsByTagName('button');

// iterate through 'buttons' and add a listener for each button
for (let i = 0; i < buttons.length; i += 1) {
  buttons[i].addEventListener('click', function () {
    simon.buttonHandler(this.value);
  });
}


/* *************************************************************************************
    TODO:
      - When power button is pressed:
        + Short light show
          = Large-green clockwise, small-blue clockwise, small-blue stays lit
        + Flash '--' on count button
          = Stops flashing / goes solid once game starts

      - Switch audio to AudioContext sounds (AudioContext.createOscillator())
        + (https://developer.mozilla.org/en-US/docs/Web/API/AudioContext)

      - Possibly adjust button colors
        + make lit up buttons stand out more
   ************************************************************************************* */
