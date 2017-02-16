/*
 * game.js by Matthew Fritz <mattf@burbankparanormal.com>
 * Holds the logic and display of the game code
 *
 * NOTE: This file was coded VERY quickly
 */

// =============================
//
// CONFIGURATION PARAMETERS
//
// =============================

// maximum number of guesses for the words
const MAX_GUESSES = 7;

// number of guesses that have been attempted
var num_guesses = 0;

// true if the game has been won, false otherwise
var won = false;

// set of available words for guessing
var words = [
   'available',
   'configuration',
   'evaluate',
   'complacent',
   'incorrigible',
   'superfluous',
   'irritating'
];

// holds the current word that has been selected
var current_word = "";

// holds the character array for the current word
var current_word_characters = [];

// holds the character array for the guesses
var guessed = [];

// holds a reference to the <div> for the game image
var image_element;

// holds a reference to the <div> for the guessed letters
var guessed_element;

// =============================
//
// GAME IMAGES (ASCII)
//
// =============================

// first image in the game for when something goes wrong
var image_one = `
   |
`;

// second image in the game for when something goes wrong
var image_two = `
   |
   |
`;

// third image in the game for when something goes wrong
var image_three = `
   |
   |
   O
`;

// fourth image in the game for when something goes wrong
var image_four = `
   |
   |
   O
 --|--
`;

// fifth image in the game for when something goes wrong
var image_five = `
   |
   |
   O
 --|--
   |
`;

// sixth image in the game for when something goes wrong
var image_six = `
   |
   |
   O
 --|--
   |
  \/
`;

// seventh image in the game for when something goes wrong
var image_seven = `
   |
   |
   O
 --|--
   |
  \/ \\
`;

// =============================
//
// GAME LOGIC
//
// =============================

// starts the game, selects a random word, and applies it
function startGame() {
	num_guesses = 0;
	won = false;

	// grab the reference to the image element and guessed element
	image_element = document.getElementById('game-image');
	guessed_element = document.getElementById('game-guesses');

	console.info("Clearing image");

	// clear the image
	displayImage();

	console.info("Selecting a new word");

	// select a new random word
	let word_index = Math.floor(Math.random() * words.length);
	current_word = words[word_index];

	// split the word into its character array
	current_word_characters = current_word.split("");

	// reset the "guessed" array
	guessed = current_word_characters.slice();
	guessed.fill('_');

	console.info("Game started");
}

function displayImage() {
	let image = "";

	if(num_guesses == 1) {
		image = image_one;
	}
	else if(num_guesses == 2) {
		image = image_two;
	}
	else if(num_guesses == 3) {
		image = image_three;
	}
	else if(num_guesses == 4) {
		image = image_four;
	}
	else if(num_guesses == 5) {
		image = image_five;
	}
	else if(num_guesses == 6) {
		image = image_six;
	}
	else if(num_guesses == MAX_GUESSES) {
		image = image_seven;
	}

	// update the image element on the document
	image_element.innerHTML = "<pre>" + image + "</pre>";

	// update the guesses on the screen
	guessed_element.innerHTML = "<pre>Word: " + guessed.split(" ") + "</pre>";
}

// checks whether the game has been won; returns true if the game has
// been won, false otherwise
function checkGuess(letter) {
	for(let i = 0; i < current_word_characters.length; i++) {
		if(current_word_characters[i] == letter) {
			// set the corresponding letter on the guessed characters
			guessed[i] = letter;
		}
	}

	// do the words match?
	if(guessed.join('') == current_word) {
		// the word has been guessed completely
		return true;
	}

	return false;
}

// make the guess
function makeGuess(letter) {
	if(!won) {
		if(checkGuess()) {
			// game won, so display a message on the screen above the image
			image_element.innerHTML += "<strong>YOU WON! Select Start New Game to play again</strong>";
			won = true;
		}
		else
		{
			// only execute if the player has not yet lost
			if(num_guesses < MAX_GUESSES) {
				// increment the number of guesses
				num_guesses++;

				// display the new image
				displayImage();

				// was this a losing guess?
				if(num_guesses == MAX_GUESSES) {
					// player lost
					image_element.innerHTML += "<strong>You lost. The word was '" + current_word + "'. Select Start New Game to play again</strong>";
				}
			}
		}
	}
}