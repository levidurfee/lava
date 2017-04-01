"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Game = function () {
    /**
    * Construct the game!
    *
    * @param {string} player Currently only 1p
    * @param {string} coins CSS Selector for coins
    * @param {string} lava CSS Selector for lava(s)
    * @param {string} land CSS selector
    * @param {number} distance The distance the player travels
    */
    function Game(player, coins, lava, lands, distance) {
        _classCallCheck(this, Game);

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
        if (distance) {
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


    _createClass(Game, [{
        key: "move",
        value: function move(e) {
            e = e || window.event;
            /* we need to get the player's location for each move  */
            var playerLocation = this.player.getBoundingClientRect();
            /* where ya going playa?  */
            var newLocation = void 0;
            /**
             * Check which direction the player is trying to move and if
             * he is allowed to move in that direction.
             * @todo clean this up - it's jumbled.
             */
            if (e.keyCode == Game.UP && this.checkAllowedMove(Game.UP)) {
                /* get new location */
                newLocation = playerLocation.top - this.distance;
                /* move the player */
                this.player.style.top = newLocation + 'px';
                /* enable opposite direction */
                this.enableMove(Game.DOWN);
            } else if (e.keyCode == Game.DOWN && this.checkAllowedMove(Game.DOWN)) {
                /* get new location */
                newLocation = playerLocation.top + this.distance;
                /* move the player */
                this.player.style.top = newLocation + 'px';
                /* enable opposite direction */
                this.enableMove(Game.UP);
            } else if (e.keyCode == Game.LEFT && this.checkAllowedMove(Game.LEFT)) {
                /* get new location */
                newLocation = playerLocation.left - this.distance;
                /* move the player */
                this.player.style.left = newLocation + 'px';
                /* enable opposite direction */
                this.enableMove(Game.RIGHT);
            } else if (e.keyCode == Game.RIGHT && this.checkAllowedMove(Game.RIGHT)) {
                /* get new location */
                newLocation = playerLocation.left + this.distance;
                /* move the player */
                this.player.style.left = newLocation + 'px';
                /* enable opposite direction */
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
            /* Run liveUpdate after each move to update page. */
            this.liveUpdate();
        }
        /**
        * Check if they won some coins
        *
        * @param {any} playerLocation
        * @param {any} coinLocation
        */

    }, {
        key: "checkWinner",
        value: function checkWinner(playerLocation, coinsLocation) {
            /* loop through coins and check for overlap */
            for (var i = 0; i < this.coinsLocation.length; i++) {
                /* if they overlap, they get a little prize */
                if (this.checkOverlap(playerLocation, this.coinsLocation[i])) {
                    this.score++;
                }
            }
        }
        /**
        * Check if they swam with the lavas
        *
        * @param {any} playerLocation
        * @param {any} lavaLocation
        */

    }, {
        key: "checkLava",
        value: function checkLava(playerLocation, lavaLocation) {
            /* loop through the lavas */
            for (var i = 0; i < this.lavaLocation.length; i++) {
                /* check if player is in there somewhere */
                if (this.checkOverlap(playerLocation, this.lavaLocation[i])) {
                    /* when ded reset score to 0 */
                    this.score = 0;
                    this.deads++;
                }
            }
        }
        /**
         * Make sure player can't go beyond boundary
         * @todo Check if player is going into land.
         *
         * @param {any} playerLocation Player's current location.
         */

    }, {
        key: "checkBoundary",
        value: function checkBoundary(playerLocation) {
            /* First check if they're trying to go off the screen. */
            // Up
            if (playerLocation.top <= 0) {
                this.disableMove(Game.UP);
            }
            // Down
            /* the browser won't let them go too far down */
            // Left
            if (playerLocation.left <= 0) {
                this.disableMove(Game.LEFT);
            }
            // Right
            /* the browser prevents them from going too far right */
            /* Check if player is going into land */
        }
    }, {
        key: "disableMove",
        value: function disableMove(move) {
            this.disabledMoves.push(move);
        }
    }, {
        key: "enableMove",
        value: function enableMove(move) {
            for (var i = 0; i < this.disabledMoves.length; i++) {
                var index = this.disabledMoves.indexOf(move);
                if (index > -1) {
                    this.disabledMoves.splice(index, 1);
                }
            }
        }
    }, {
        key: "checkAllowedMove",
        value: function checkAllowedMove(move) {
            if (this.disabledMoves.length == 0) {
                return true;
            }
            for (var i = 0; i < this.disabledMoves.length; i++) {
                if (move == this.disabledMoves[i]) {
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

    }, {
        key: "checkOverlap",
        value: function checkOverlap(rectOne, rectTwo) {
            var overlap = !(rectOne.right < rectTwo.left || rectOne.left > rectTwo.right || rectOne.bottom < rectTwo.top || rectOne.top > rectTwo.bottom);
            return overlap;
        }
        /**
        * Build the property coinsLocation array
        */

    }, {
        key: "populateCoinLocations",
        value: function populateCoinLocations() {
            for (var i = 0; i < this.coins.length; i++) {
                this.coinsLocation[i] = this.coins[i].getBoundingClientRect();
            }
        }
        /**
        * Build the property lavaLocation array
        */

    }, {
        key: "populateLavaLocations",
        value: function populateLavaLocations() {
            for (var i = 0; i < this.lava.length; i++) {
                this.lavaLocation[i] = this.lava[i].getBoundingClientRect();
            }
        }
        /**
         * Build the property landsLocation array
         */

    }, {
        key: "populateLandLocations",
        value: function populateLandLocations() {
            for (var i = 0; i < this.lands.length; i++) {
                this.landsLocation[i] = this.lands[i].getBoundingClientRect();
            }
        }
        /**
        * Update the containers with the latest value in the property
        */

    }, {
        key: "liveUpdate",
        value: function liveUpdate() {
            var val = void 0;
            var el = void 0;
            for (var i = 0; i < this.liveProperties.length; i++) {
                val = eval("this." + this.liveProperties[i]);
                el = document.getElementById("lava--" + this.liveProperties[i]);
                el.innerHTML = val;
            }
        }
    }]);

    return Game;
}();