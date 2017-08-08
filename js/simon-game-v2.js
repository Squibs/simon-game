/* global greenDataURL, redDataURL, yellowDataURL, blueDataURL, errorDataURL, silenceDataURL */
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
    this.roundCount = 0; // counts which roud the player is on
    this.gameSpeed = 1250; // how fast the game pattern will play (in milliseconds)

    // stores HTMLCollection of all buttons
    this.buttons = document.getElementsByTagName('button');

    // stores game state toggles
    this.toggles = {
      powerState: false, // controls whether or not the power has been turned on
      gameStarted: false, // controls whether or not the game has started
      strictMode: false, // controls whether or not strict mode is enabled
    };

    // create an audio source with silent audio
    const audio = document.createElement('audio');
    audio.src = silenceDataURL;
    audio.id = 'fake-audio';
    document.body.appendChild(audio);

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
          alert(button, 'This button is not being handled correctly'); // eslint-disable-line
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

    // // clone the original audio node for the passed color and play it (allows audio overlap)
    // const cloneAudio = this.audio[button].cloneNode(true);
    // cloneAudio.play();

    Simon.playAudio(button, false);

    this.playerTurn();
  }

  // handles option / control buttons
  handleControlButtons(button) {
    // handles the power button
    const powerButtonHandler = function () {
      // toggle the power state
      this.toggleControlState('powerState');

      // play empty audio to allow mobile audio to work
      document.getElementById('fake-audio').play();

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
        // start the game & change yellow control button text to 'restart'
        document.getElementById('control-yellow-button').innerHTML = 'Restart<br><i class="fa fa-2x fa-refresh"></i>';
        this.startGame();
      // if the start game button is pressed while a game is already started
      } else {
        // press this button again to restart / start a new game
        this.handleControlButtons('y');
      }
    }.bind(this);

    // handles the strict button
    const strictButtonHandler = function () {
      this.toggleControlState('strictMode');
    }.bind(this);

    // handles the count button
    const countButtonHandler = function () {
      // !!!!!!!!!!!!!!!!!!do something
    }.bind(this); // eslint-disable-line

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
        this.buttons[7].innerHTML = 'Count<br><span class="fa fa-2x" id="simon-rounds">--</span>';
        this.buttons[5].innerHTML = 'Start<br><i class="fa fa-2x fa-play-circle"></i>';
        clearInterval(this.flashTimer);
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
    this.addRoundCount();
  }

  // adds to the round counter
  addRoundCount() {
    // add one to the round counter
    this.roundCount += 1;

    if (this.roundCount === 5) {
      this.gameSpeed = 1000;
    } else if (this.roundCount === 10) {
      this.gameSpeed = 800;
    } else if (this.roundCount === 15) {
      this.gameSpeed = 600;
    } else if (this.roundCount === 18) {
      this.gameSpeed = 500;
    }

    // update round counter DOM element; one is delayed just incase flashCount() un-does this
    document.getElementById('simon-rounds').innerText = Simon.formatRoundNumber(this.roundCount);
    setTimeout(() => { document.getElementById('simon-rounds').innerText = Simon.formatRoundNumber(this.roundCount); }, 500);

    // generate a move, delayed just a bit to allow the player to prepare
    setTimeout(() => { this.generateMove(); }, 150);
  }

  // pulls the next game move (pattern sequence)
  generateMove() {
    // pull next move from already generated game seed
    this.computerInput += this.gameSeed.slice(0, 1);
    this.gameSeed = this.gameSeed.slice(1, this.gameSeed.length);
    console.log(`Round${this.roundCount}`, `Seed Length${this.gameSeed.length}`);
    this.displayRoundPattern();
  }

  // displays the current round's pattern
  displayRoundPattern() {
    // disable player input
    this.disableGameButtons(true);

    // control for the following setInterval
    let i = 0;

    // display each bit of the pattern based on gameSpeed variable
    const patternTimer = setInterval(() => {
      this.playGame(this.computerInput[i]);
      i += 1;

      // once pattern has completely played out
      if (i >= this.computerInput.length) {
        // stop the interval (stops pattern from playing)
        clearInterval(patternTimer);
        setTimeout(() => { this.disableGameButtons(false); }, 300);
      }
    }, this.gameSpeed);

    // clear player input
    this.playerInput = '';
  }

  // plays out the pattern based on the computerInput variable
  playGame(color) {
    console.log('playGame tick', this);

    // play appropriate audio tone
    Simon.playAudio(color, true);

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

    // prevent additional inputs
    if (this.playerInput.length === this.computerInput.length) {
      this.disableGameButtons(true);
    }

    // if incorrect piece of the pattern was entered
    if (this.playerInput[length] !== this.computerInput[length]) {
      // if strict mode is enabled; display error, then start new game
      if (this.toggles.strictMode) {
        this.playerMistake();
        setTimeout(() => { this.startGame(); }, 1600);
        // display mistake then reshow the pattern to the player
      } else {
        this.playerMistake();
        setTimeout(() => { this.displayRoundPattern(); }, 1600);
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

  // handles what happens when the player makes a mistake
  playerMistake() {
    // disable player input
    this.disableGameButtons(true);

    // // play error sound
    // this.audio.error.play();
    Simon.playAudio('e', true);

    // change count to display '!!'
    const flashCount = document.getElementById('simon-rounds');
    flashCount.innerText = '!!';
    setTimeout(() => { flashCount.innerHTML = '&nbsp;'; }, 200);
    setTimeout(() => { flashCount.innerText = '!!'; }, 400);
    setTimeout(() => { flashCount.innerHTML = '&nbsp;'; }, 600);
    setTimeout(() => { flashCount.innerText = '!!'; }, 800);
    setTimeout(() => { flashCount.innerHTML = '&nbsp;'; }, 1000);
    setTimeout(() => { flashCount.innerText = '!!'; }, 1200);
    setTimeout(() => { flashCount.innerText = Simon.formatRoundNumber(this.roundCount); }, 1600);
  }

  // handles what happens when the player wins
  playerVictory() {
  }


  /* *********************
      FANCY LIGHT METHODS
     ********************* */
  // flashes the round count until the game is started
  flashCount() {
    if (this.toggles.powerState && !this.toggles.gameStarted) {
      setTimeout(() => { this.buttons[7].innerHTML = 'Count<br><span class="fa fa-2x" id="simon-rounds">&nbsp&nbsp</span>'; }, 0);
      setTimeout(() => { this.buttons[7].innerHTML = 'Count<br><span class="fa fa-2x" id="simon-rounds">--</span>'; }, 500);
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

  static playAudio(color, automated) {
    const audio = document.createElement('audio');
    const fakeAudio = document.getElementById('fake-audio');

    if (!automated) {
      if (color === 'g') {
        audio.src = 'https://s3.amazonaws.com/freecodecamp/simonSound1.mp3';
      } else if (color === 'r') {
        audio.src = 'https://s3.amazonaws.com/freecodecamp/simonSound2.mp3';
      } else if (color === 'y') {
        audio.src = 'https://s3.amazonaws.com/freecodecamp/simonSound3.mp3';
      } else if (color === 'b') {
        audio.src = 'https://s3.amazonaws.com/freecodecamp/simonSound4.mp3';
      }

      audio.addEventListener('ended', function () {
        document.body.removeChild(this);
      }, false);

      document.body.appendChild(audio);

      audio.play();
    } else if (automated) {
      if (color === 'g') {
        fakeAudio.src = greenDataURL;
      } else if (color === 'r') {
        fakeAudio.src = redDataURL;
      } else if (color === 'y') {
        fakeAudio.src = yellowDataURL;
      } else if (color === 'b') {
        fakeAudio.src = blueDataURL;
      } else if (color === 'e') {
        fakeAudio.src = errorDataURL;
      }
      document.body.appendChild(fakeAudio);

      fakeAudio.play();
    }
  }
}


/* ***************************************
    CREATE GAME OBJECT & BUTTON LISTENERS
   *************************************** */
// creates a simon class objects
const simon = new Simon(); // eslint-disable-line


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

      - set time limit on user turn?

      - speed up pattern as the player progresses
   ************************************************************************************* */
