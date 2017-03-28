'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Game = function () {
    function Game(player, coins, lava) {
        _classCallCheck(this, Game);

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

    _createClass(Game, [{
        key: 'move',
        value: function move(e) {
            e = e || window.event;
            var playerLocation = this.player.getBoundingClientRect();
            var newLocation = void 0;
            if (e.keyCode == '38') {
                //console.log('up');
                newLocation = playerLocation.top - 10;
                this.player.style.top = newLocation + 'px';
            } else if (e.keyCode == '40') {
                //console.log('down');
                newLocation = playerLocation.top + 10;
                this.player.style.top = newLocation + 'px';
            } else if (e.keyCode == '37') {
                //console.log('left');
                newLocation = playerLocation.left - 10;
                this.player.style.left = newLocation + 'px';
            } else if (e.keyCode == '39') {
                //console.log('right');
                newLocation = playerLocation.left + 10;
                this.player.style.left = newLocation + 'px';
            }
            this.checkOverlap(playerLocation, this.coinsLocation);
            this.checkLava();
        }
    }, {
        key: 'checkWinner',
        value: function checkWinner(playerLocation, coinsLocation) {
            if (this.checkOverlap(playerLocation, coinsLocation)) {
                alert('you won');
            }
        }
    }, {
        key: 'checkOverlap',
        value: function checkOverlap(rectOne, rectTwo) {
            var overlap = !(rectOne.right < rectTwo.left || rectOne.left > rectTwo.right || rectOne.bottom < rectTwo.top || rectOne.top > rectTwo.bottom);
            if (overlap) {
                alert('you won the game');
            }
        }
    }, {
        key: 'checkLava',
        value: function checkLava() {
            var rectOne = this.player.getBoundingClientRect();
            var overlap = !(rectOne.right < this.lavaLocation.left || rectOne.left > this.lavaLocation.right || rectOne.bottom < this.lavaLocation.top || rectOne.top > this.lavaLocation.bottom);
            if (overlap) {
                alert('you much dead');
            }
        }
    }, {
        key: 'populateCoinLocations',
        value: function populateCoinLocations() {
            for (var i = 0; i < this.coins.length; i++) {
                this.coinsLocation[i] = this.coins[i].getBoundingClientRect();
            }
        }
    }]);

    return Game;
}();