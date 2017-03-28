class Game {
	public player: any;
	public coins: any;
	public coinsLocation: any;
	public lava: any;
	public lavaLocation: any;
	public listener: any;
	constructor(player: string, coins: string, lava: string) {
		this.player = document.querySelectorAll(player)[0];
		this.coins = document.querySelectorAll(coins);
		this.lava = document.querySelectorAll(lava);

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
	}

	public move(e: any) {
		e = e || window.event;
		let playerLocation = this.player.getBoundingClientRect();
		let newLocation;
		if (e.keyCode == '38') {
			//console.log('up');
			newLocation = <number>playerLocation.top - 10;
			this.player.style.top = newLocation + 'px';
		} else if (e.keyCode == '40') {
			//console.log('down');
			newLocation = <number>playerLocation.top + 10;
			this.player.style.top = newLocation + 'px';
		} else if (e.keyCode == '37') {
			//console.log('left');
			newLocation = <number>playerLocation.left - 10;
			this.player.style.left = newLocation + 'px';
		} else if (e.keyCode == '39') {
			//console.log('right');
			newLocation = <number>playerLocation.left + 10;
			this.player.style.left = newLocation + 'px';
		}

		this.checkOverlap(playerLocation, this.coinsLocation);
		this.checkLava(playerLocation, this.lavaLocation);
	}

    public checkWinner(playerLocation: any, coinsLocation: any) {
        for(var i=0; i<this.coinsLocation.length; i++) {
            if(this.checkOverlap(playerLocation, this.coinsLocation[i])) {
                console.log('yay, much coens good.');
            }
        }
    }

	public checkLava(playerLocation: any, lavaLocation: any) {
	    for(var i=0; i<this.lavaLocation.length; i++) {
            if(this.checkOverlap(playerLocation, this.lavaLocation[i])) {
                console.log('you much dead. -1 for u.');
            }
        }
    }

    /**
    * Check if the one html object is overlapping another
    *
    * Will return true if they overlap
    */
	public checkOverlap(rectOne: any, rectTwo: any) {
		var overlap = !(rectOne.right < rectTwo.left || 
	        rectOne.left > rectTwo.right || 
	        rectOne.bottom < rectTwo.top || 
	        rectOne.top > rectTwo.bottom)
		return overlap;
    }

    private populateCoinLocations() {
        for(var i=0; i<this.coins.length; i++) {
            this.coinsLocation[i] = this.coins[i].getBoundingClientRect();
        }
    }

    private populateLavaLocations() {
        for(var i=0; i<this.lava.length; i++) {
            this.lavaLocation[i] = this.lava[i].getBoundingClientRect();
        }
    }
}

