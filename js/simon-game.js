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
        + displays the current round / correct button press count
        + when this button is pressed it does nothing!
          = or it switches to display something else (WIP)
   ****************************************************************** */
class Simon {
  constructor() {
    this.gameSeedValues = ['g', 'r', 'y', 'b']; // stores game seed values
    this.gameSeed = ''; // order in which buttons need to be pressed
    this.currentString = ''; // stores buttons that have already been pressed
    this.flashTimer = ''; // stores flashInverval
    this.strictMode = false; // controls whether or not strict mode is enabled
    this.powerState = false; // controls whether the power has been turned on or not
    this.gameStarted = false; // controls whether the game has started or not
    this.flashEnabled = false; // controls whether the count button is flashing or not
    this.roundCount = 0; // counts which round the player is on
    this.gameSpeed = 1000; // how fast the game pattern will play (in milliseconds)
    this.playerMoves = [];

    // stores HTMLCollection of all buttons in variable 'buttons'
    this.buttons = document.getElementsByTagName('button');

    // audio files for each button
    this.greenAudio = new Audio('../media/simonSound1.mp3');
    this.redAudio = new Audio('../media/simonSound2.mp3');
    this.yellowAudio = new Audio('../media/simonSound3.mp3');
    this.blueAudio = new Audio('../media/simonSound4.mp3');
    this.errorAudio = new Audio('../media/bzzzt.mp3');

    // disable all buttons initially; except power
    for (let i = 0; i < this.buttons.length; i += 1) {
      this.buttons[i].disabled = true;
      this.buttons[4].disabled = false;
    }
  }

  /* ****************
      BUTTON TOGGLES
     **************** */
  // toggles whether the game has started
  toggleGameStarted() {
    // toggles game started
    this.gameStarted = this.gameStarted === false;

    // if the game is set to run
    if (this.gameStarted) {
      this.buttons[5].classList.add('active');
      setTimeout(() => { document.getElementById('simon-points').innerText = Simon.formatRoundNumber(1); }, 525);
      this.generateGameSeed();
      this.addCount();
    // reset the game and start a new one
    } else if (!this.gameStarted) {
      this.buttons[5].classList.remove('active');
    }
  }

  // toggles strict mode on or off
  toggleStrictMode() {
    // toggles strict mode
    this.strictMode = this.strictMode === false;

    // add or remove active state for the red control button (lights the button up)
    if (this.strictMode) {
      this.buttons[6].classList.add('active');
    } else if (!this.strictMode) {
      this.buttons[6].classList.remove('active');
    }
  }

  // turns the device on and off
  togglePowerState() {
    // toggles powerstate
    this.powerState = this.powerState === false;

    // if power is on
    if (this.powerState) {
      // do a light show!
      this.lightShow();

      // enable the flashing of count
      this.flashTimer = setInterval(() => { this.flashCount(); }, 1000);

      // change button text to 'on'; light up button
      this.buttons[4].innerHTML = 'On<br><i class="fa fa-2x fa-power-off"></i>';
      this.buttons[4].classList.add('active');

      // enable control buttons
      for (let i = 5; i < this.buttons.length; i += 1) {
        this.buttons[i].disabled = false;
        this.buttons[i].classList.add('cursor');
        this.buttons[i].classList.add('hasactive');
      }
    // if power is off
    } else if (!this.powerState) {
      this.resetGame();

      // disable the flashing of count
      clearInterval(this.flashTimer);

      // toggle strict mode off
      if (this.strictMode) { this.toggleStrictMode(); }

      // change button text to 'off'; turn button light off
      this.buttons[4].innerHTML = 'Off<br><i class="fa fa-2x fa-power-off"></i>';
      this.buttons[4].classList.remove('active');

      // disable control buttons
      for (let i = 5; i < this.buttons.length; i += 1) {
        this.buttons[i].disabled = true;
        this.buttons[i].classList.remove('cursor');
        this.buttons[i].classList.remove('hasactive');
      }
    }
  }


  /* *****************
      BUTTON HANDLING
     ***************** */
  // handles what happens when any control button is pressed
  controlButtonPressed(buttonPressed) {
    if (buttonPressed === 'power') {
      this.togglePowerState();
    } else if (buttonPressed === 'start') {
      this.toggleGameStarted();
    } else if (buttonPressed === 'strict') {
      this.toggleStrictMode();
    } else if (buttonPressed === 'count') {
      // do something?
    }
  }

  // handles simon class methods get called depending on which button is pressed
  buttonHandler(button) {
    console.log(button);
    switch (button) {
      // game buttons
      case 'green':
        this.addToPlayerMoves('g');
        break;
      case 'red':
        this.addToPlayerMoves('r');
        break;
      case 'yellow':
        this.addToPlayerMoves('y');
        break;
      case 'blue':
        this.addToPlayerMoves('b');
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


  /* *************
      GAME LOGIC
     ************ */
  // player input?
  clearPlayerMoves() {
    this.playerMoves = [];
  }

  addToPlayerMoves(color) {
    this.playerMoves.push(color);
    this.playerTurn(color);
  }

  playerTurn(x) {
    if (this.playerMoves[this.playerMoves.length - 1] !== this.currentString[this.playerMoves.length - 1]) {
      if (this.strictMode) {
        this.resetGame();
        this.addCount();
      } else {
        this.showPattern();
      }
    } else {
      this.playGame(x);
      const check = this.playerMoves.length === this.currentString.length;

      if (check) {
        if (this.roundCount === 20) {
          // you win
        } else {
          this.addCount();
        }
      }
    }
  }

  playGame(color) {
    let audioClone = '';
    if (color === 'g') {
      this.buttons[0].classList.add('active');
      audioClone = this.greenAudio;
    } else if (color === 'r') {
      this.buttons[1].classList.add('active');
      audioClone = this.redAudio;
    } else if (color === 'y') {
      this.buttons[2].classList.add('active');
      audioClone = this.yellowAudio;
    } else if (color === 'b') {
      this.buttons[3].classList.add('active');
      audioClone = this.blueAudio;
    }

    audioClone.play();

    for (let i = 0; i < 4; i += 1) {
      setTimeout(() => { this.buttons[i].classList.remove('active'); }, 300);
    }
  }

  showPattern() {
    for (let j = 0; j < 4; j += 1) {
      this.buttons[j].disabled = true;
    }

    let i = 0;
    const moves = setInterval(() => {
      this.playGame(this.currentString[i]);
      i += 1;
      if (i >= this.currentString.length) {
        clearInterval(moves);
      }
    }, this.gameSpeed);

    for (let j = 0; j < 4; j += 1) {
      this.buttons[j].disabled = false;
    }

    this.clearPlayerMoves();
  }

  generateMove() {
    this.currentString += this.gameSeed.slice(0, 1);
    this.showPattern();
  }

  addCount() {
    this.roundCount += 1;
    document.getElementById('simon-points').innerText = Simon.formatRoundNumber(this.roundCount);
    this.generateMove();
  }

  // resets everything to default
  resetGame() {
    // clear game seeds
    this.gameSeed = '';
    this.currentString = '';

    if (this.gameStarted) {
      this.toggleGameStarted();
      this.flashCount();
      document.getElementById('simon-points').innerHTML = '--';
      // delayed set to default in-case point flashing causes issues
      setTimeout(() => { document.getElementById('simon-points').innerHTML = '--'; }, 525);
      this.flashTimer = setInterval(() => { this.flashCount(); }, 1000);
    }
  }

  // generates a game string
  generateGameSeed() {
    // clear existing seed
    this.gameSeed = '';

    // generate new game seed
    for (let i = 0; i < 20; i += 1) {
      this.gameSeed += this.gameSeedValues[Math.floor(Math.random() * 4)];
    }
  }


  /* **************
      FANCY LIGHTS
     ************** */
  // flashes count until game is started
  flashCount() {
    // stores simon game object for use inside of setTimeout
    const that = this;

    // flash count only if power state is on and a game is not running
    if (this.powerState && !this.gameStarted) {
      setTimeout(() => { that.buttons[7].innerHTML = 'Count<br><span class="fa fa-2x" id="simon-points">&nbsp&nbsp</span>'; }, 0);
      setTimeout(() => { that.buttons[7].innerHTML = 'Count<br><span class="fa fa-2x" id="simon-points">--</span>'; }, 500);
    // if a game is running or the power is off clear the interval so it stops calling this method
    } else {
      clearInterval(this.flashTimer);
    }
  }

  // light show shown when game is turned on
  lightShow() {
    // stores simon object
    const that = this;

    // enables lights
    const enableLight = function (light) {
      that.buttons[light].classList.add('active');
    };

    // disables lights
    const disableLight = function (light) {
      that.buttons[light].classList.remove('active');
    };

    // enable / disable lights clockwise (appears semi-sporadic on mobile)
    setTimeout(() => { enableLight(0); }, 0);
    setTimeout(() => { disableLight(0); }, 50);
    setTimeout(() => { enableLight(1); }, 50);
    setTimeout(() => { disableLight(1); }, 100);
    setTimeout(() => { enableLight(2); }, 100);
    setTimeout(() => { disableLight(2); }, 150);
    setTimeout(() => { enableLight(3); }, 150);
    setTimeout(() => { disableLight(3); }, 200);
    setTimeout(() => { enableLight(4); }, 200);
    setTimeout(() => { disableLight(4); }, 250);
    setTimeout(() => { enableLight(5); }, 250);
    setTimeout(() => { disableLight(5); }, 300);
    setTimeout(() => { enableLight(6); }, 300);
    setTimeout(() => { disableLight(6); }, 350);
    setTimeout(() => { enableLight(7); }, 350);
    setTimeout(() => { disableLight(7); }, 400);

    // fix power button light depending on power state (is there a better way to write this line?)
    setTimeout(() => { that.powerState ? enableLight(4) : disableLight(4); }, 450); // eslint-disable-line
  }

  /* ****************
      STATIC METHODS
     **************** */
  // formats the round number to always have two digits (00 through 20)
  static formatRoundNumber(round) {
    // if less than 10 (0 through 9)
    if (round < 10) {
      // add 0 to front of number
      return `0${round}`;
    }
    // otherwise return the round as a string
    return round.toString();
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

      - On victory spam last color a few times then change count to '**'
   ************************************************************************************* */
