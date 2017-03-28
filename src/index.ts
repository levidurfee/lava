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
		this.lava = document.querySelector(lava);
		this.lavaLocation = this.lava.getBoundingClientRect();

        /**
        * Since there is more than one coin, I need to get the coords
        * for both coins.
        */
        this.populateCoinLocations();
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
		this.checkLava();
	}

    public checkWinner(playerLocation: any, coinsLocation: any) {
        if(this.checkOverlap(playerLocation, coinsLocation)) {
            alert('you won');
        }
    }

	public checkOverlap(rectOne: any, rectTwo: any) {
		var overlap = !(rectOne.right < rectTwo.left || 
	        rectOne.left > rectTwo.right || 
	        rectOne.bottom < rectTwo.top || 
	        rectOne.top > rectTwo.bottom)
		if(overlap) {
			alert('you won the game');
		}
	}

	public checkLava() {
		var rectOne = this.player.getBoundingClientRect();
		var overlap = !(rectOne.right < this.lavaLocation.left || 
	        rectOne.left > this.lavaLocation.right || 
	        rectOne.bottom < this.lavaLocation.top || 
	        rectOne.top > this.lavaLocation.bottom)
		if(overlap) {
			alert('you much dead');
		}
	}

    private populateCoinLocations() {
        for(var i=0; i<this.coins.length; i++) {
            this.coinsLocation[i] = this.coins[i].getBoundingClientRect();
        }
    }
}

