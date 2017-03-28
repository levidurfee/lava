'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Game = function () {
    function Game(player, coins, lava) {
        _classCallCheck(this, Game);

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
            this.checkLava(playerLocation, this.lavaLocation);
        }
    }, {
        key: 'checkWinner',
        value: function checkWinner(playerLocation, coinsLocation) {
            for (var i = 0; i < this.coinsLocation.length; i++) {
                if (this.checkOverlap(playerLocation, this.coinsLocation[i])) {
                    console.log('yay, much coens good.');
                }
            }
        }
    }, {
        key: 'checkLava',
        value: function checkLava(playerLocation, lavaLocation) {
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

    }, {
        key: 'checkOverlap',
        value: function checkOverlap(rectOne, rectTwo) {
            var overlap = !(rectOne.right < rectTwo.left || rectOne.left > rectTwo.right || rectOne.bottom < rectTwo.top || rectOne.top > rectTwo.bottom);
            return overlap;
        }
    }, {
        key: 'populateCoinLocations',
        value: function populateCoinLocations() {
            for (var i = 0; i < this.coins.length; i++) {
                this.coinsLocation[i] = this.coins[i].getBoundingClientRect();
            }
        }
    }, {
        key: 'populateLavaLocations',
        value: function populateLavaLocations() {
            for (var i = 0; i < this.lava.length; i++) {
                this.lavaLocation[i] = this.lava[i].getBoundingClientRect();
            }
        }
    }]);

    return Game;
}();