/*
* random levels may be fun. they should use a seed of some sort, so they
* can be shared/recreated. it's no fun if you can't share a challenging
* level with your friends.
 */
class Levels {
    constructor() {
        Levels.WIDTH = 100;
        Levels.GROUND = 'g';
        Levels.GROUNDS = [];
        // yayy
    }

    generateLand() {
        var numberOfLands = this.prng(1, 5);
        let width = 0;
        let totalWidth = 0;
        for(var i=0; i<numberOfLands; i++) {
            width = this.prng(10, Levels.WIDTH - totalWidth);
            totalWidth = width + totalWidth;
            Levels.GROUNDS.push(width);
        }
        console.log(numberOfLands);
        console.log(Levels.WIDTH - totalWidth);
        Levels.GROUNDS[Levels.GROUNDS.length - 1] = Levels.WIDTH - totalWidth;
        console.log(Levels.GROUNDS);
    }

    prng(min, max) {
        // generate some randomness
        return Math.floor(Math.random() * (max - min)) + min;
    }
}

let levels = new Levels();
levels.generateLand();

