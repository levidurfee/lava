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

        /* these are arrays! and they hold the location(s) of things */
        this.coinsLocation = Array();
        this.lavaLocation = Array();
        this.landsLocation = Array();

        /* keep track of disabled moves (so they can't go off screen) */
        this.disabledMoves = Array();

        /* Store locations of coins in an array */
        this.populateCoinLocations();

        /* There could be more than one lava pit! AHH */
        this.populateLavaLocations();

        /* Constrain player with land. */
        this.populateLandLocations();

        /* Distance player will travel */
        if (distance) {
            this.distance = distance;
        } else {
            this.distance = 10;
        }

        /**
         * Both start at 0
         */
        this.score = 0;
        this.deads = 0;

        /* Array of properties that have an HTML element that contains data */
        this.liveProperties = ["score", "deads"];

        /* Map static properties to keyboard equivalent */
        Game.UP = '38';
        Game.DOWN = '40';
        Game.LEFT = '37';
        Game.RIGHT = '39';
        Game.DIRECTION = {
            'up': Game.UP,
            'down': Game.DOWN,
            'left': Game.LEFT,
            'right': Game.RIGHT
        };
        Game.OPP_DIRECTION = {
            'up': Game.DOWN,
            'down': Game.UP,
            'left': Game.RIGHT,
            'right': Game.LEFT
        };

        /* maybe add this as a parameter */
        this.gravity = true;

        if (this.gravity) {
            this.startGravity();
        }
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
             */
            if (e.keyCode == Game.UP && this.checkAllowedMove(Game.UP)) {
                newLocation = playerLocation.top - this.distance;
                this.player.style.top = newLocation + 'px';
                this.enableMove(Game.DOWN);
            } else if (e.keyCode == Game.DOWN && this.checkAllowedMove(Game.DOWN)) {
                newLocation = playerLocation.top + this.distance;
                this.player.style.top = newLocation + 'px';
                this.enableMove(Game.UP);
            } else if (e.keyCode == Game.LEFT && this.checkAllowedMove(Game.LEFT)) {
                newLocation = playerLocation.left - this.distance;
                this.player.style.left = newLocation + 'px';
                this.enableMove(Game.RIGHT);
            } else if (e.keyCode == Game.RIGHT && this.checkAllowedMove(Game.RIGHT)) {
                newLocation = playerLocation.left + this.distance;
                this.player.style.left = newLocation + 'px';
                this.enableMove(Game.LEFT);
            }

            /* Check if player is going outside the boundaries */
            this.checkBoundary(this.player.getBoundingClientRect(), e.keyCode);

            /* Check if on coin or on lava. */
            this.checkWinner(playerLocation, this.coinsLocation);
            this.checkLava(playerLocation, this.lavaLocation);

            /* Run liveUpdate properties after each move to update page. */
            this.liveUpdate();
        }

        /**
        * First floor please.
        */

    }, {
        key: "startGravity",
        value: function startGravity() {
            var that = this;
            // here we go (down, because gravity)!
            window.setInterval(function () {
                return that.moveDown();
            }, 1000);
        }
    }, {
        key: "moveDown",
        value: function moveDown() {
            var event = document.createEvent('Event');
            event.keyCode = 40;
            event.initEvent('keydown');
            document.dispatchEvent(event);
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
         * Check if player is on land
         *
         * @param  {any} playerLocation
         * @return {bool}
         */

    }, {
        key: "checkLand",
        value: function checkLand(playerLocation) {
            /* loop through the lands */
            for (var i = 0; i < this.landsLocation.length; i++) {
                /* check if player is trying to go beyong land */
                if (this.checkOverlap(playerLocation, this.landsLocation[i])) {
                    return true;
                }
            }
            return false;
        }

        /**
         * Make sure player can't go beyond boundary
         *
         * @param {any} playerLocation Player's current location.
         */

    }, {
        key: "checkBoundary",
        value: function checkBoundary(playerLocation, move) {
            /* First check if they're trying to go off the screen. */
            if (playerLocation.top <= 0) {
                this.disableMove(Game.UP);
            }
            if (playerLocation.left <= 0) {
                this.disableMove(Game.LEFT);
            }

            /* Check if player is going into land */
            if (this.checkLand(playerLocation)) {
                this.disableMove(move.toString());
            }
        }

        /**
         * Disable the option to move in a certain direction.
         * @param {string} move
         */

    }, {
        key: "disableMove",
        value: function disableMove(move) {
            // Append it to the array
            this.disabledMoves.push(move);
        }

        /**
         * Allow the player to move in that direction.
         * @param {string} move
         */

    }, {
        key: "enableMove",
        value: function enableMove(move) {
            // Loop through disabledMoves property and remove the 'move'
            for (var i = 0; i < this.disabledMoves.length; i++) {
                // Get the index of the disabledMove
                var index = this.disabledMoves.indexOf(move);
                if (index > -1) {
                    // if the index does exist, remove it
                    this.disabledMoves.splice(index, 1);
                }
            }
        }

        /**
         * Check if the user is allowed to move in that direction.
         * @param {string} move
         */

    }, {
        key: "checkAllowedMove",
        value: function checkAllowedMove(move) {
            // if no moves are disabled, they can move in any direction
            if (this.disabledMoves.length === 0) {
                return true;
            }

            // loop through all disabled moves
            for (var i = 0; i < this.disabledMoves.length; i++) {
                // check if they are allowed to move in that direction
                if (move == this.disabledMoves[i]) {
                    // return false if that move is disabled
                    return false;
                }
            }

            // otherwise return true
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
                val = eval("this." + this.liveProperties[i]); // jshint ignore:line
                el = document.getElementById("lava--" + this.liveProperties[i]);
                el.innerHTML = val;
            }
        }
    }]);

    return Game;
}();