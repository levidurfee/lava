class Game {
    /**
    * Construct the game!
    *
    * @param {string} player Currently only 1p
    * @param {string} coins CSS Selector for coins
    * @param {string} lava CSS Selector for lava(s)
    * @param {number} distance The distance the player travels
    */
    constructor(player, coins, lava, distance) {
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
        if (distance) {
            this.distance = distance;
        }
        else {
            this.distance = 10;
        }
    }
    move(e) {
        e = e || window.event;
        let playerLocation = this.player.getBoundingClientRect();
        let newLocation;
        if (e.keyCode == '38') {
            //console.log('up');
            newLocation = playerLocation.top - this.distance;
            this.player.style.top = newLocation + 'px';
        }
        else if (e.keyCode == '40') {
            //console.log('down');
            newLocation = playerLocation.top + this.distance;
            this.player.style.top = newLocation + 'px';
        }
        else if (e.keyCode == '37') {
            //console.log('left');
            newLocation = playerLocation.left - this.distance;
            this.player.style.left = newLocation + 'px';
        }
        else if (e.keyCode == '39') {
            //console.log('right');
            newLocation = playerLocation.left + this.distance;
            this.player.style.left = newLocation + 'px';
        }
        this.checkWinner(playerLocation, this.coinsLocation);
        this.checkLava(playerLocation, this.lavaLocation);
    }
    checkWinner(playerLocation, coinsLocation) {
        for (var i = 0; i < this.coinsLocation.length; i++) {
            if (this.checkOverlap(playerLocation, this.coinsLocation[i])) {
                console.log('yay, much coens good.');
            }
        }
    }
    checkLava(playerLocation, lavaLocation) {
        for (var i = 0; i < this.lavaLocation.length; i++) {
            if (this.checkOverlap(playerLocation, this.lavaLocation[i])) {
                console.log('you much dead. -1 for u.');
            }
        }
    }
    /**
    * Check if the one html object is overlapping another
    *
    * Will return true if they overlap
    */
    checkOverlap(rectOne, rectTwo) {
        var overlap = !(rectOne.right < rectTwo.left ||
            rectOne.left > rectTwo.right ||
            rectOne.bottom < rectTwo.top ||
            rectOne.top > rectTwo.bottom);
        return overlap;
    }
    populateCoinLocations() {
        for (var i = 0; i < this.coins.length; i++) {
            this.coinsLocation[i] = this.coins[i].getBoundingClientRect();
        }
    }
    populateLavaLocations() {
        for (var i = 0; i < this.lava.length; i++) {
            this.lavaLocation[i] = this.lava[i].getBoundingClientRect();
        }
    }
}
