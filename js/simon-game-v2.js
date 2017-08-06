/* ******************************************************************
    SIMON GAME OBJECT V2:
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
        + can turn off or on whenever

      - Count button
        + displays the current round / correct button press count
        + when this button is pressed it does nothing!
          = or it switches to display something else (WIP)
   ****************************************************************** */
class Simon {
  constructor() {
    this.gameSeed = ''; // order in which buttons need to be pressed
    this.gameSeedVariables = ['g', 'r', 'y', 'b']; // stores game seed variables
    this.playerInput = ''; // stores what the player has entered
    this.computerInput = ''; // controls the current stage of the game
    this.flashTimer = ''; // stores flashInterval
    this.patternTimer = ''; // stores patternInterval
    this.roundCount = 0; // counts which roud the player is on
    this.gameSpeed = 800; // how fast the game pattern will play (in milliseconds)

    // stores HTMLCollection of all buttons
    this.buttons = document.getElementsByTagName('button');

    // stores game state toggles
    this.toggles = {
      powerState: false, // controls whether or not the power has been turned on
      gameStarted: false, // controls whether or not the game has started
      strictMode: false, // controls whether or not strict mode is enabled
    };

    // audio files for each button; and error
    this.audio = {
      g: new Audio('../media/simonSound1.mp3'),
      r: new Audio('../media/simonSound2.mp3'),
      y: new Audio('../media/simonSound3.mp3'),
      b: new Audio('../media/simonSound4.mp3'),
      error: new Audio('../media/bzzzt.mp3'),
    };

    this.createButtonListeners();
    this.disableGameButtons(true);
    this.disableControlButtons(true);
  }

  /* ****************************************
      GAME / CONTROL BUTTON HANDLING METHODS
     **************************************** */
  // handles button input
  createButtonListeners() {
    const buttonHandlerSwitch = function (button) {
      switch (button.value) {
        case 'green':
        case 'red':
        case 'yellow':
        case 'blue':
          this.handleGameButtons(button.value.split('').shift());
          break;
        case 'blue-control':
        case 'yellow-control':
        case 'red-control':
        case 'green-control':
          this.handleControlButtons(button.value.split('').shift());
          break;
        default:
          alert(button, 'This button is not being handled correctly');
          break;
      }
    }.bind(this);

    // add click event listeners for every button
    for (let i = 0; i < this.buttons.length; i += 1) {
      this.buttons[i].addEventListener('click', (evt) => {
        // window.event & event.srcElement for IE; even though my page layout doesn't work on IE
        const event = evt || window.event;
        const target = event.currentTarget || event.srcElement;

        // pass event target to the button handler switch
        buttonHandlerSwitch(target);
      });
    }
  }

  // handles player input (via game buttons)
  handleGameButtons(button) {
    // add the color pressed to the player input string (to compare against the seed)
    this.playerInput += button;

    // clone the original audio node for the passed color and play it (allows audio overlap)
    const cloneAudio = this.audio[button].cloneNode(true);
    cloneAudio.play();

    this.playerTurn();
    console.log(this);
  }

  // handles option / control buttons
  handleControlButtons(button) {
    // handles the power button
    const powerButtonHandler = function () {
      this.toggleControlState('powerState');

      // stores power button DOM element
      const power = this.buttons[4];

      // if power is turned on
      if (this.toggles.powerState) {
        // do a light show, light button up and change text to 'on', enable other control buttons
        this.lightShow();
        this.flashTimer = setInterval(() => { this.flashCount(); }, 1000);
        document.getElementById('control-blue-button').innerHTML = 'On<br><i class="fa fa-2x fa-power-off"></i>';
        this.disableControlButtons(false);

      // if power is turned off
      } else {
        // turn light off and change text to 'off', disable other control buttons
        power.classList.remove('active');
        document.getElementById('control-blue-button').innerHTML = 'Off<br><i class="fa fa-2x fa-power-off"></i>';
        this.disableControlButtons(true);
      }
    }.bind(this);

    // handles the start button
    const startButtonHandler = function () {
      this.toggleControlState('gameStarted');

      // if the game is started
      if (this.toggles.gameStarted) {
        // start the game
        this.startGame();

      // if the game button is pressed while a game is already started
      } else {
        // !!!!!!!!!!!!!!!!!!!!do something
      }
    }.bind(this);

    // handles the strict button
    const strictButtonHandler = function () {
      this.toggleControlState('strictMode');
    }.bind(this);

    // handles the count button
    const countButtonHandler = function () {
      // !!!!!!!!!!!!!!!!!!do something
    }.bind(this);

    // call the appropriate function based on the button
    if (button === 'b') {
      powerButtonHandler();
    } else if (button === 'y') {
      startButtonHandler();
    } else if (button === 'r') {
      strictButtonHandler();
    } else if (button === 'g') {
      countButtonHandler();
    }
  }

  // toggles any game state
  toggleControlState(state) {
    // for the passed state: if true set false; if false set true
    this.toggles[state] = this.toggles[state] === false;

    // add class to appropraite button if toggle is true respectively
    if (state === 'powerState' && this.toggles[state]) {
      this.buttons[4].classList.add('active');
    } else if (state === 'gameStarted' && this.toggles[state]) {
      this.buttons[5].classList.add('active');
    } else if (state === 'strictMode' && this.toggles[state]) {
      this.buttons[6].classList.add('active');
    }

    // remove class to appropriate button if toggle is false respectively
    if (state === 'powerState' && !this.toggles[state]) {
      this.buttons[4].classList.remove('active');
    } else if (state === 'gameStarted' && !this.toggles[state]) {
      this.buttons[5].classList.remove('active');
    } else if (state === 'strictMode' && !this.toggles[state]) {
      this.buttons[6].classList.remove('active');
    }
  }

  // disables or enables game buttons based on passed boolean
  disableGameButtons(bool) {
    for (let i = 0; i < 4; i += 1) {
      this.buttons[i].disabled = bool;

      // if buttons are enabled: add hand cursor and light up when clicked
      if (!bool) {
        this.buttons[i].classList.add('cursor');
        this.buttons[i].classList.add('hasactive');

      // if buttons are disabled: remove hand cursor and light up when clicked
      } else {
        this.buttons[i].classList.remove('cursor');
        this.buttons[i].classList.remove('hasactive');
      }
    }
  }

  // disables or enables control buttons based on passed boolean; except power
  disableControlButtons(bool) {
    for (let i = 5; i < 8; i += 1) {
      // enable or disable all control buttons
      this.buttons[i].disabled = bool;

      // if buttons are enabled: add hand cursor and light up when clicked
      if (!bool) {
        this.buttons[i].classList.add('cursor');
        this.buttons[i].classList.add('hasactive');

      // if buttons are disabled: remove hand cursor and light up when clicked
      } else {
        this.buttons[i].classList.remove('cursor');
        this.buttons[i].classList.remove('hasactive');
        this.buttons[i].classList.remove('active');

        // set everything to default (only time buttons are disabled is when power is off)
        this.disableGameButtons(true);
        this.toggles.powerState = false;
        this.toggles.gameStarted = false;
        this.toggles.strictMode = false;
        this.computerInput = '';
        this.playerInput = '';
        this.gameSeed = '';
        this.roundCount = 0;
        this.buttons[7].innerHTML = 'Count<br><span class="fa fa-2x" id="simon-points">--</span>';
        this.patternTimer = '';
        this.flashTimer = '';
      }
    }
  }


  /* ********************
      GAME LOGIC METHODS
     ******************** */
  // starts the game
  startGame() {
    // clear existing seed and other game variables
    this.gameSeed = '';
    this.playerInput = '';
    this.computerInput = '';
    this.roundCount = 0;

    // generate new game seed
    for (let i = 0; i < 20; i += 1) {
      this.gameSeed += this.gameSeedVariables[Math.floor(Math.random() * 4)];
    }

    // add one to the round cunter
    console.log(this.gameSeed);
    this.addRoundCount();
  }

  // adds to the round counter
  addRoundCount() {
    // add one to the round counter; update round counter DOM element; generate a move
    this.roundCount += 1;
    document.getElementById('simon-points').innerText = Simon.formatRoundNumber(this.roundCount);
    setTimeout(() => { this.generateMove(); }, 150);
  }

  // pulls the next game move (pattern sequence)
  generateMove() {
    // pull next move from already generated game seed
    this.computerInput += this.gameSeed.slice(0, 1);
    this.gameSeed = this.gameSeed.slice(1, this.gameSeed.length - 1);
    this.displayRoundPattern();
  }

  // displays the current round's pattern
  displayRoundPattern() {
    // disable player input
    this.disableGameButtons(true);

    // control for the following setInterval
    let i = 0;

    // display each bit of the pattern based on gameSpeed variable
    this.patternTimer = setInterval(() => {
      this.playGame(this.computerInput[i]);
      i += 1;

      // once pattern has completely played out
      if (i >= this.computerInput.length) {
        // stop the interval (stops pattern from playing)
        clearInterval(this.patternTimer);

        // re-enable player controls
        this.disableGameButtons(false);
      }
    }, this.gameSpeed);

    // clear player input
    this.playerInput = '';
  }

  // plays out the pattern based on the computerInput variable
  playGame(color) {
    // clone the original audio node for the passed color and play it (allows audio overlap)
    const cloneAudio = this.audio[color].cloneNode(true);
    cloneAudio.play();

    console.log('playGame tick');

    // light up the appropriate button
    if (color === 'g') {
      this.buttons[0].classList.add('active');
    } else if (color === 'r') {
      this.buttons[1].classList.add('active');
    } else if (color === 'y') {
      this.buttons[2].classList.add('active');
    } else if (color === 'b') {
      this.buttons[3].classList.add('active');
    }

    // disable the light after a short amount of time
    for (let i = 0; i < 4; i += 1) {
      setTimeout(() => { this.buttons[i].classList.remove('active'); }, 175);
    }
  }

  // logic for when it is the players turn
  playerTurn() {
    // stores length of the playerInput variable to make 'if' statement readable
    const length = this.playerInput.length - 1;

    // if incorrect piece of the pattern was entered
    if (this.playerInput[length] !== this.computerInput[length]) {
      // if strict mode is enabled
      if (this.toggles.strictMode) {
        // !!!!!!!!!!!!insert mistake handling method here
        this.startGame();
      // reshow the pattern to the player
      } else {
        this.displayRoundPattern();
      }
    // if entire player input was correct and the length matches that of the computer's input
    } else if (this.playerInput.length === this.computerInput.length) {
      // if the round count is at 20 the player wins!
      if (this.roundCount === 20) {
        // you win!!!!!!!!!!! (insert winning method here)
      // otherwise go to the next round
      } else {
        this.addRoundCount();
      }
    }
  }

  /* *********************
      FANCY LIGHT METHODS
     ********************* */
  // flashes the round count until the game is started
  flashCount() {
    if (this.toggles.powerState && !this.toggles.gameStarted) {
      setTimeout(() => { this.buttons[7].innerHTML = 'Count<br><span class="fa fa-2x" id="simon-points">&nbsp&nbsp</span>'; }, 0);
      setTimeout(() => { this.buttons[7].innerHTML = 'Count<br><span class="fa fa-2x" id="simon-points">--</span>'; }, 500);
    } else {
      clearInterval(this.flashTimer);
    }

    console.log('flashCount tick');
  }

  // little light show when game is powered on
  lightShow() {
    // enables lights
    const enableLight = function (light) {
      this.buttons[light].classList.add('active');
    }.bind(this);

    // disables lights
    const disableLight = function (light) {
      this.buttons[light].classList.remove('active');
    }.bind(this);

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

    // fix power button light depending on power state
    setTimeout(() => { this.toggles.powerState ? enableLight(4) : disableLight(4); }, 450); // eslint-disable-line
  }

  /* ****************
      STATIC METHODS
     **************** */
  // formats the round number to always be two digits (00 thrugh 20)
  static formatRoundNumber(round) {
    // if less than 10 add '0' in front of round number; return as string
    if (round < 10) { return `0${round}`; }
    return round.toString();
  }
}


/* ***************************************
    CREATE GAME OBJECT & BUTTON LISTENERS
   *************************************** */
// creates a simon class objects
const simon = new Simon();


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
