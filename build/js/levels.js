'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
* random levels may be fun. they should use a seed of some sort, so they
* can be shared/recreated. it's no fun if you can't share a challenging
* level with your friends.
 */
var Levels = function () {
    function Levels() {
        _classCallCheck(this, Levels);

        Levels.WIDTH = 100;
        Levels.GROUND = 'g';
        Levels.GROUNDS = [];
        // yayy
    }

    _createClass(Levels, [{
        key: 'generateLand',
        value: function generateLand() {
            var numberOfLands = this.prng(1, 5);
            var width = 0;
            var totalWidth = 0;
            for (var i = 0; i < numberOfLands; i++) {
                width = this.prng(10, Levels.WIDTH - totalWidth);
                totalWidth = width + totalWidth;
                Levels.GROUNDS.push(width);
            }
            console.log(numberOfLands);
            console.log(Levels.WIDTH - totalWidth);
            Levels.GROUNDS[Levels.GROUNDS.length - 1] = Levels.WIDTH - totalWidth;
            console.log(Levels.GROUNDS);
        }
    }, {
        key: 'prng',
        value: function prng(min, max) {
            // generate some randomness
            return Math.floor(Math.random() * (max - min)) + min;
        }
    }]);

    return Levels;
}();

var levels = new Levels();
levels.generateLand();