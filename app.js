/* Table of Contents
––––––––––––––––––––––––––––––––––––––––––––––––––
- REQUIREMENTS
- DATA
- VARIABLES
- FUNCTIONS
- LOGIC
*/

// REQUIREMENTS

// 1. As a player, I can start a new game. DONE
// 2. As a player during the game, I can click on a card to reveal what’s underneath it. DONE
// 3. As a player during the game, I can see the total number of times I have turned over cards by clicking on them. DONE
// 4. As a player, I should only be able to see at most two cards at a time. DONE
// 5. As a player, I should not be able to click on the same card twice and have that count as a guess. DONE
// 6. As a player, after clicking two cards that are not a match, I should be able to see them both for at least 1 second before they flip over again. DONE
// 7. (Bonus) Store the lowest-scoring game in local storage, so that players can see a record of the best game played. DONE

// DATA

const cardsArray = [
  {
    name: 'shiro',
    img: 'img/shiro.png'
  },
  {
    name: 'keith',
    img: 'img/keith.png'
  },
  {
    name: 'lance',
    img: 'img/lance.png'
  },
  {
    name: 'hunk',
    img: 'img/hunk.png'
  },
  {
    name: 'pidge',
    img: 'img/pidge.png'
  },
  {
    name: 'allura',
    img: 'img/allura.png'
  },
  {
    name: 'coran',
    img: 'img/coran.png'
  },
  {
    name: 'voltron',
    img: 'img/voltron.png'
  },
  {
    name: 'zarkon',
    img: 'img/zarkon.png'
  },
  {
    name: 'haggar',
    img: 'img/haggar.png'
  }
];

// VARIABLES

// Requirement 1
var board = document.querySelector('.board');
var cardDeck = cardsArray.concat(cardsArray);
var restart = document.getElementById('restart');

// Requirement 3
var scoreCurrent = document.getElementById('scoreCurrent');
var currentScore = 0;

// Requirement 4
var firstGuess = '';
var secondGuess = '';
var count = 0;

// Requirement 5
var previousTarget = null;

// Requirement 6
var delay = 1200;

// Requirement 7
var scoreBest = document.getElementById('scoreBest');
var bestScore = Infinity;
var matchCount = 0;

// FUNCTIONS

// Requirement 1 | Fisher-Yates (aka Knuth) Shuffle
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

// Requirement 1
var start = function() {
  shuffle(cardDeck);

  cardDeck.forEach(function(image) {
    // Create elements
    var scene = document.createElement('div');
    var card = document.createElement('section');
    var front = document.createElement('div');
    var back = document.createElement('div');

    // Add classes and properties
    scene.classList.add('scene');
    card.classList.add('card');
    card.dataset.name = image.name;
    front.classList.add('card__face', 'card__face--front');
    back.classList.add('card__face', 'card__face--back');
    back.style.backgroundImage = `url(${image.img})`;

    // Build HTML
    board.appendChild(scene);
    scene.appendChild(card);
    card.appendChild(front);
    card.appendChild(back);
  });

  // Display Scores
  // Requirement 7
  if (localStorage.getItem('bestScore') === null) {
    scoreBest.innerText = '~';
  } else {
    scoreBest.innerText = localStorage.getItem('bestScore');
  }

  // Requirement 3
  scoreCurrent.innerText = currentScore;
};

// Requirement 4
var reset = function() {
  firstGuess = '';
  secondGuess = '';
  count = 0;

  var selected = document.querySelectorAll('.selected');
  selected.forEach(function(card) {
    card.classList.remove('selected');
  });
};

// Requirement 4
var match = function() {
  var selected = document.querySelectorAll('.selected');

  selected.forEach(function(card) {
    card.classList.add('match');
  });
};

// LOGIC

// Requirement 1
window.onload = start();

// Requirement 1
restart.addEventListener('click', function() {
  location.reload();
});

// Requirement 2 | Overall Game Mechanics
board.addEventListener('click', function(event) {
  var clicked = event.target;

  // Requirement 5
  if (clicked === previousTarget) {
    return;
  }

  // Requirement 4
  if (clicked.nodeName === 'SECTION' && count < 2) {
    currentScore++;
    count++;

    // Requirement 2
    if (count === 1) {
      firstGuess = clicked.dataset.name;
      clicked.classList.add('selected');
    } else {
      secondGuess = clicked.dataset.name;
      clicked.classList.add('selected');
    }

    // Requirement 6
    if (firstGuess !== '' && secondGuess !== '') {
      if (firstGuess === secondGuess) {
        setTimeout(match, delay);
        setTimeout(reset, delay);
        matchCount++;
      } else {
        setTimeout(reset, delay);
      }
    }

    // Requirement 5
    previousTarget = clicked;

    // Requirement 3
    scoreCurrent.innerText = currentScore;
  }

  // Requirement 7
  if (matchCount === cardsArray.length && currentScore < bestScore) {
    localStorage.setItem('bestScore', currentScore);
    scoreBest.innerText = localStorage.getItem('bestScore');
  }
});
