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

// maximum number of misses for the words
const MAX_MISSES = 7;

// number of misses that have taken place
var num_misses = 0;

// true if the game has ended, false otherwise
var ended = false;

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
	num_misses = 0;
	ended = false;

	// grab the reference to the image element and guessed element
	image_element = document.getElementById('game-image');
	guessed_element = document.getElementById('game-guesses');

	// show all of the buttons again
	showLetterButtons();

	console.info("Clearing image");

	// clear the image
	displayImage();

	console.info("Selecting a new word");

	// select a new random word
	let word_index = Math.floor(Math.random() * words.length);
	current_word = words[word_index].toUpperCase();

	// split the word into its character array
	current_word_characters = current_word.split("");

	// reset the "guessed" array
	guessed = current_word_characters.slice();
	guessed.fill('_');

	// display the word text
	displayWord();

	console.info("Game started");
}

// hide a specific letter button
function hideLetterButton(letter) {
	document.getElementById("btn-" + letter).style.visibility = "hidden";
}

// show all of the letter buttons
function showLetterButtons() {
	let buttons = document.getElementsByTagName("button");
	for(button of buttons) {
		button.style.visibility = "visible";
	}
}

// update the display of the hangman image
function displayImage() {
	let image = "";

	if(num_misses == 1) {
		image = image_one;
	}
	else if(num_misses == 2) {
		image = image_two;
	}
	else if(num_misses == 3) {
		image = image_three;
	}
	else if(num_misses == 4) {
		image = image_four;
	}
	else if(num_misses == 5) {
		image = image_five;
	}
	else if(num_misses == 6) {
		image = image_six;
	}
	else if(num_misses == MAX_MISSES) {
		image = image_seven;
	}

	// update the image element on the document
	image_element.innerHTML = "<pre>" + image + "</pre>";
}

function displayWord() {
	// update the guesses on the screen
	guessed_element.innerHTML = "<pre>Word: " + guessed.join(" ") + "</pre><br />Misses: " + num_misses + "/" + MAX_MISSES;
}

// checks whether the game has been won; returns true if the game has
// been won, false otherwise
function checkGuess(letter) {
	if(num_misses < MAX_MISSES) {
		let replacements = 0;
		for(let i = 0; i < current_word_characters.length; i++) {
			if(current_word_characters[i] == letter) {
				// set the corresponding letter on the guessed characters
				guessed[i] = letter;

				replacements++;
			}
		}

		// only update the game image and max guesses if there were
		// no replacements
		if(replacements == 0) {
			// increment the number of guesses
			num_misses++;

			// display the new image
			displayImage();
		}

		// do the words match?
		if(guessed.join('') == current_word) {
			// the word has been guessed completely
			return true;
		}
	}

	return false;
}

// make the guess
function makeGuess(letter) {
	if(!ended) {
		if(checkGuess(letter)) {
			// game won, so display a message on the screen above the image
			image_element.innerHTML += "<br /><strong>YOU WON! Select Start New Game to play again</strong>";
			ended = true;
		}
		else
		{
			// has the player lost?
			if(num_misses == MAX_MISSES) {
				// player lost
				image_element.innerHTML += "<br /><strong>You lost. The word was '" + current_word + "'. Select Start New Game to play again</strong>";
				ended = true;
			}
		}

		// update the word display
		displayWord();

		// hide the letter button
		hideLetterButton(letter);
	}
}