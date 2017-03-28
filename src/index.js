class Game {
    constructor(player, coins, lava) {
        this.player = document.querySelectorAll(player)[0];
        this.coins = document.querySelectorAll(coins);
        this.coinsLocation = this.coins[0].getBoundingClientRect();
        this.lava = document.querySelector(lava);
        this.lavaLocation = this.lava.getBoundingClientRect();
    }
    move(e) {
        e = e || window.event;
        let playerLocation = this.player.getBoundingClientRect();
        let newLocation;
        if (e.keyCode == '38') {
            //console.log('up');
            newLocation = playerLocation.top - 10;
            this.player.style.top = newLocation + 'px';
        }
        else if (e.keyCode == '40') {
            //console.log('down');
            newLocation = playerLocation.top + 10;
            this.player.style.top = newLocation + 'px';
        }
        else if (e.keyCode == '37') {
            //console.log('left');
            newLocation = playerLocation.left - 10;
            this.player.style.left = newLocation + 'px';
        }
        else if (e.keyCode == '39') {
            //console.log('right');
            newLocation = playerLocation.left + 10;
            this.player.style.left = newLocation + 'px';
        }
        this.checkOverlap(playerLocation, this.coinsLocation);
        this.checkLava();
    }
    checkWinner(playerLocation, coinsLocation) {
        if (this.checkOverlap(playerLocation, coinsLocation)) {
            alert('you won');
        }
    }
    checkOverlap(rectOne, rectTwo) {
        var overlap = !(rectOne.right < rectTwo.left ||
            rectOne.left > rectTwo.right ||
            rectOne.bottom < rectTwo.top ||
            rectOne.top > rectTwo.bottom);
        if (overlap) {
            alert('you won the game');
        }
    }
    checkLava() {
        var rectOne = this.player.getBoundingClientRect();
        var overlap = !(rectOne.right < this.lavaLocation.left ||
            rectOne.left > this.lavaLocation.right ||
            rectOne.bottom < this.lavaLocation.top ||
            rectOne.top > this.lavaLocation.bottom);
        if (overlap) {
            alert('you much dead');
        }
    }
    populateCoinLocations() {
        for (var i = 0; i < this.coins.length; i++) {
            this.coinsLocation[i] = this.coins[i].getBoundingClientRect();
        }
    }
}
