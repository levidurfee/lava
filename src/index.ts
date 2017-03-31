interface gameCallback { (): void }

class Game {
	public player: any;
	public coins: any;
	public coinsLocation: any;
	public lava: any;
	public lavaLocation: any;
	public listener: any;

    public distance: any;

    public score: number;

    /**
    * Construct the game!
    *
    * @param {string} player Currently only 1p
    * @param {string} coins CSS Selector for coins
    * @param {string} lava CSS Selector for lava(s)
    * @param {number} distance The distance the player travels
    */
	constructor(player: string, coins: string, lava: string, distance?: number) {
        /* currently only supports one player  */
		this.player = document.querySelectorAll(player)[0];
		this.coins = document.querySelectorAll(coins);
		this.lava = document.querySelectorAll(lava);

        /* these are arrays! and they hold the location(s) */
        this.coinsLocation = Array();
        this.lavaLocation = Array();

        /**
        * Since there is more than one coin, I need to get the coords
        * for both coins.
        */
        this.populateCoinLocations();

        /**
        * There could be more than one lava pit! AHH
        */
        this.populateLavaLocations();

        /**
        * Check and see if the distance param was passed. If it was then set
        * the distance property equal to the param. If it wasn't, use the
        * default of 10px.
        */
        if(distance) {
            this.distance = distance;
        } else {
            this.distance = 10;
        }

        /**
         * The score starts at 0
         */
        this.score = 0;
	}

    /**
    * @param {event} e Get the onkeydown event
    */
	public move(e: any) {
		e = e || window.event;
        /* we need to get the player's location for each move  */
		let playerLocation = this.player.getBoundingClientRect();

        /* where ya going playa?  */
		let newLocation;

		/**
        * The player will attempt to make a move. Will eventually restrict
        * movement so the player can't go through walls or off the screen
        */
        if (e.keyCode == '38') {
            /* if the player moved up  */
			newLocation = <number>playerLocation.top - this.distance;
			this.player.style.top = newLocation + 'px';
		} else if (e.keyCode == '40') {
			/* if the player moved down */
            newLocation = <number>playerLocation.top + this.distance;
			this.player.style.top = newLocation + 'px';
		} else if (e.keyCode == '37') {
			/* if the player moved left */
            newLocation = <number>playerLocation.left - this.distance;
			this.player.style.left = newLocation + 'px';
		} else if (e.keyCode == '39') {
			/* if the player moved right */
            newLocation = <number>playerLocation.left + this.distance;
			this.player.style.left = newLocation + 'px';
		}

        /*
        * check player's location after each move
        * did player get some COINS?! or
        * did player think the lava was kool-aid and now much ded.
        * must check for these things.
        */
		this.checkWinner(playerLocation, this.coinsLocation, this.incrementScore);
		this.checkLava(playerLocation, this.lavaLocation);
	}

    /**
    * Check if they won some coins
    *
    * @param {any} playerLocation
    * @param {any} coinLocation
    */
    private checkWinner(playerLocation: any, coinsLocation: any) {
        /* loop through coins and check for overlap */
        for(var i=0; i<this.coinsLocation.length; i++) {
            /* if they overlap, they get a little prize */
            if(this.checkOverlap(playerLocation, this.coinsLocation[i])) {
                this.score++;
                console.log('yay, much coens good.');
                console.log('you have ' + this.score + ' coens, k?');
            }
        }
    }

    /**
    * Check if they swam with the lavas
    *
    * @param {any} playerLocation
    * @param {any} lavaLocation
    */
	private checkLava(playerLocation: any, lavaLocation: any) {
        /* loop through the lavas */
	    for(var i=0; i<this.lavaLocation.length; i++) {
            /* check if player is in there somewhere */
            if(this.checkOverlap(playerLocation, this.lavaLocation[i])) {
                /* when ded reset score to 0 */
                this.score = 0;
                console.log('you much dead. -1 for u.');
            }
        }
    }

    /**
    * Check if the one html object is overlapping another
    * Will return true if they overlap
    *
    * @param {any} rectOne
    * @param {any} rectTwo
    */
	private checkOverlap(rectOne: any, rectTwo: any) {
		var overlap = !(rectOne.right < rectTwo.left || 
	        rectOne.left > rectTwo.right || 
	        rectOne.bottom < rectTwo.top || 
	        rectOne.top > rectTwo.bottom)
		return overlap;
    }

    /**
    * Build the property coinsLocation array
    */
    private populateCoinLocations() {
        for(var i=0; i<this.coins.length; i++) {
            this.coinsLocation[i] = this.coins[i].getBoundingClientRect();
        }
    }

    /**
    * Build the property lavaLocation array
    */
    private populateLavaLocations() {
        for(var i=0; i<this.lava.length; i++) {
            this.lavaLocation[i] = this.lava[i].getBoundingClientRect();
        }
    }
}

