interface gameCallback { (): void }

class Game {
    static UP: string;
    static DOWN: string;
    static LEFT: string;
    static RIGHT: string;

	public player: any;
	
    public coins: any;
	public coinsLocation: any;
	public lava: any;
	public lavaLocation: any;
    public lands: any;
    public landsLocation: any;

	public listener: any;

    public distance: any;

    public liveProperties: string[];

    private score: number;
    private deads: number;

    private lastMove: string;
    private disabledMoves: string[];

    /**
    * Construct the game!
    *
    * @param {string} player Currently only 1p
    * @param {string} coins CSS Selector for coins
    * @param {string} lava CSS Selector for lava(s)
    * @param {string} land CSS selector
    * @param {number} distance The distance the player travels
    */
	constructor(
        player: string, 
        coins: string, 
        lava: string,
        lands: string,
        distance?: number
        ) {
        /* currently only supports one player  */
		this.player = document.querySelectorAll(player)[0];
		this.coins = document.querySelectorAll(coins);
		this.lava = document.querySelectorAll(lava);
        this.lands = document.querySelectorAll(lands);

        /* these are arrays! and they hold the location(s) */
        this.coinsLocation = Array();
        this.lavaLocation = Array();
        this.landsLocation = Array();

        /* keep track of disabled moves (so they can't go off screen) */
        this.disabledMoves = Array();

        /**
        * Since there is more than one coin, I need to get the coords
        * for all coins.
        */
        this.populateCoinLocations();

        /**
        * There could be more than one lava pit! AHH
        */
        this.populateLavaLocations();

        /**
         * Constrain player.
         */
        this.populateLandLocations();

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

        /**
        * The deads starts at 0
        */
        this.deads = 0;

        /**
         * An array of properties that will update their HTML counterparts
         * after each move. So the page always reflects the latest data.
         * 
         * @type {Array}
         */
        this.liveProperties = ["score", "deads"];

        /*
        Static properties for direction are easier to remember / have more meaning.
        */
        /**
         * Keyboard "UP" arrow key
         * @type {String}
         */
        Game.UP = '38';

        /**
         * Keyboard "DOWN" arrow key
         * @type {String}
         */
        Game.DOWN = '40';

        /**
         * Keyboard "LEFT" arrow key
         * @type {String}
         */
        Game.LEFT = '37';

        /**
         * Keyboard "RIGHT" arrow key
         * @type {String}
         */
        Game.RIGHT = '39';
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
        if (e.keyCode == Game.UP && this.checkAllowedMove(Game.UP)) {
            /* if the player moved up  */
			newLocation = <number>playerLocation.top - this.distance;
			this.player.style.top = newLocation + 'px';
            this.enableMove(Game.DOWN);
		} else if (e.keyCode == Game.DOWN && this.checkAllowedMove(Game.DOWN)) {
			/* if the player moved down */
            newLocation = <number>playerLocation.top + this.distance;
			this.player.style.top = newLocation + 'px';
            this.enableMove(Game.UP);
		} else if (e.keyCode == Game.LEFT && this.checkAllowedMove(Game.LEFT)) {
			/* if the player moved left */
            newLocation = <number>playerLocation.left - this.distance;
			this.player.style.left = newLocation + 'px';
            this.enableMove(Game.RIGHT);
		} else if (e.keyCode == Game.RIGHT && this.checkAllowedMove(Game.RIGHT)) {
			/* if the player moved right */
            newLocation = <number>playerLocation.left + this.distance;
			this.player.style.left = newLocation + 'px';
            this.enableMove(Game.LEFT);
		}

        /**
         * Player's last move needs to be stored so we can prevent him from
         * going outside the boundaries.
         *  
         * @type {string}
         */
        this.lastMove = e.keyCode;

        /**
         * Player can't go through walls.
         * 
         * @param {any} playerLocation Player's current location.
         */
        this.checkBoundary(playerLocation);

        /*
        * check player's location after each move
        * did player get some COINS?! or
        * did player think the lava was kool-aid and now much ded.
        * must check for these things.
        */
		this.checkWinner(playerLocation, this.coinsLocation);
		this.checkLava(playerLocation, this.lavaLocation);

        this.liveUpdate();
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
                //console.log('yay, much coens good.');
                //console.log('you have ' + this.score + ' coens, k?');
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
                this.deads++;
                //console.log('you much dead. -1 for u.');
            }
        }
    }

    /**
     * Make sure player can't go beyond boundary
     * @param {any} playerLocation Player's current location.
     */
    private checkBoundary(playerLocation: any) {
        /* First check if they're trying to go off the screen. */
        // Up
        if(playerLocation.top <= 0) {
            this.disableMove(Game.UP);
        }
        // Down
        // Left
        if(playerLocation.left <= 0) {
            this.disableMove(Game.LEFT);
        }
        // Right
    }

    private disableMove(move: string) {
        this.disabledMoves.push(move);
    }

    private enableMove(move: string) {
        for(var i=0; i<this.disabledMoves.length; i++) {
            let index = this.disabledMoves.indexOf(move);
            if(index > -1) {
                this.disabledMoves.splice(index, 1);
            }
        }
    }

    private checkAllowedMove(move: string) {
        if(this.disabledMoves.length == 0) {
            return true;
        }
        for(var i=0; i<this.disabledMoves.length; i++) {
            if(move == this.disabledMoves[i]) {
                return false;
            }
        }
        return true;
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

    /**
     * Build the property landsLocation array
     */
    private populateLandLocations() {
        for(var i=0; i<this.lands.length; i++) {
            this.landsLocation[i] = this.lands[i].getBoundingClientRect();
        }
    }

    /**
    * Update the containers with the latest value in the property
    */
    private liveUpdate() {
        let val;
        let el;
        for(var i=0;i<this.liveProperties.length; i++) {
            val = eval("this." + this.liveProperties[i]);
            el = document.getElementById("lava--" + this.liveProperties[i]);
            el.innerHTML = val;
        }
    }
}

