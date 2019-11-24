var startBtn = document.getElementById('start');
var msg = document.getElementById('message');
var board = document.getElementById('gameboard');
var tileImages = []; //container for game images
var tileArray = []; //container for randomised images
var tileFlippedOver = []; //container for which tiles have been flipped over
var gamePlay = false; //controls if we rebuild the board restart
var playLockout = false; //doesn't allow user to pick new cards if old cards haven't flipped back to back.jpg again
var cardFlipped = -1; //determines if we're on the first or second card flip
var timer = ''; //placeholder for the setinterval function
var score = 0;

function newGame() {
	startBtn.style.display = 'none';
	msg.textContent = 'Click on any tile.';
	if(!gamePlay) {
		gamePlay = true;
		buildArray();
		//concat is used to merge two arrays together, in this case its joining with itself so its duplicating the content inside, so the length of the array is now 24 (12 images)
		tileArray = tileImages.concat(tileImages);
		//array now:  ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg", "9.jpg", "10.jpg", "11.jpg", "12.jpg", "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg", "9.jpg", "10.jpg", "11.jpg", "12.jpg"]
		
		buildBoard(shuffle(tileArray));
	}
}

function buildArray() {
	for(var i = 1; i<=12 ; i++) { //number of images
		tileImages.push(i+'.jpg');
	}
}

function buildBoard(arr) {
	var html = '';
	for(var i = 0; i<arr.length; i++) {
		html += '<div class="gameTile">';
		html += '<img id="cards'+i+'" src="img/back.jpg" onclick="pickCard('+i+',this);" class="flipImage">';
		html += '</div>';		
	}
	board.innerHTML = html;
}

function shuffle(arr) {
	//returning a randomised version of the array
	//arr.length - 1 because arrays start at  0, so the last index needs to be 23 in this case, not 24
	for(var i = arr.length-1; i >= 0; i--) {
		//random returns 0 - the array length, so in case it's zero, add 1 
		var randomNum = Math.floor(Math.random()*(i+1));
		var itemValue = arr[i];
		//overwrite the array with new random number images
		arr[i] = arr[randomNum];
		//avoid duplicates by reassigning the original to it
		arr[randomNum] = itemValue;			
	}
	//arr is now something like this:
	//"11.jpg", "10.jpg", "3.jpg", "4.jpg", "6.jpg", "5.jpg", "5.jpg", "12.jpg", "2.jpg", "3.jpg", "6.jpg", "7.jpg", "2.jpg", "8.jpg", "9.jpg", "4.jpg", "8.jpg", "1.jpg", "9.jpg", "10.jpg", "1.jpg", "12.jpg", "7.jpg", "11.jpg"
	return arr;
}

function cardFlip(ths, tileIndex) {
	//console.log('this: ' +ths);
	//console.log('index: ' +tileIndex);
	ths.setAttribute('src', 'img/'+tileArray[tileIndex]);
	//add to the array to hold both cards
	tileFlippedOver.push(ths.id);
}

function inArray(val, arr) {
	//this will check the tileFlipped over array to see if it's already been flipped
	return arr.indexOf(val) > -1;
}

function hideCard() {
	//console.log('before:' +tileFlippedOver);
	for(var i = 0; i<2; i++) {
		//remove from the tileFlippedOver array
		var cId = tileFlippedOver.pop();
		//flip the cards back to back.jpg	
		document.getElementById(cId).setAttribute('src', 'img/back.jpg');
	}
	//console.log('after: ' +tileFlippedOver);
	clearInterval(timer);
	playLockout = false;
}

function gameOver() {
	if(parseInt(score*2) === parseInt(tileArray.length)) {
		msg.textContent = 'Go you! You\'re a winner!';
		startBtn.style.display = 'block';
		tileImages = [];
		tileArray = [];
		tileFlippedOver = [];
		gamePlay = false;
		score = 0;
	}
}

function pickCard(tileIndex, ths) {
	//check it hasn't already been flipped
	if(!inArray(ths.id, tileFlippedOver) && !playLockout) {
		//console.log('Not in array');	
	
		if(cardFlipped >= 0) {		
			//**first card has already been flipped, so flip second card
			
			//flip the second card over
			cardFlip(ths, tileIndex);

			playLockout = true;
			
			//if they match
			if(tileArray[cardFlipped] === tileArray[tileIndex]) {
				msg.textContent = 'You have a match.';
				score++;
				console.log('score:'+score);
				console.log('tilearray: '+tileArray.length);
				//check if game is over
				gameOver();
				playLockout = false;
			} else {
				//no match
				msg.textContent = 'No match.  Try again.';
				timer = setInterval(hideCard, 1000);				
			}
			
		cardFlipped = -1;
		//console.log(tileIndex, tileFlippedOver);

		} else {
			//**flip the first card over			
			cardFlip(ths, tileIndex);
			cardFlipped = tileIndex;
		}	
	} else {
		//console.log('In array');
	}
}

startBtn.addEventListener('click', newGame);