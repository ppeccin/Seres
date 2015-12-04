/**
 * Created by peccin on 30/11/2015.
 */

// A torus with an island in its center
// Individuals spawn at random borders and have to move to the island in the shortest time
// Individual specs:
//      Inputs:
//              bearing of the nearest ground square
//              current terrain type
//      Outputs:
//              bearing to move (according to torus definition)
//              intensity to move


LoneIsland = function() {
    var self = this;

    function init() {
        defineWorld();
    }

    this.reset = function() {
        for (var i = 0, len = this.individuals.length; i < len; i++)
            this.world.removeObject(this.individuals[i])
        this.individuals.length = 0;
        this.day = 0;
    };

    this.putIndividual = function(ind) {
        do {
            var pos = randomBorderPosition();
        } while (this.world.getObject(pos.x, pos.y));

        if (!Util.arrayHasElement(this.individuals, ind)) this.individuals.push(ind);
        this.world.putObject(ind, pos.x, pos.y);

        return ind;
    };

    this.evaluateIndividual = function(individual, iterations) {
        var fitnesses = [];
        for (var i = 0; i < iterations; i++) {
            this.reset();
            individual.reset();
            this.putIndividual(individual);
            this.run();
            fitnesses.push(individual.loneIslandAge);
        }

        var avg = Util.arrayAverage(fitnesses);
        individual.loneIslandFitness = avg;

        return avg;
    };

    this.run = function(days) {
        var toDay = days ? this.day + days : 10000000;
        while (this.day < toDay) {
            this.day++;
            var allDead = true;
            for (var i = 0, len = this.individuals.length; i < len;  i++) {
                var survived = this.updateIndividual(this.individuals[i]);
                if (allDead && survived) allDead = false;
            }

            if (allDead) break;
        }
    };

    this.runAnimate = function(screen, days) {
        var toDay = days ? this.day + days : 10000000;

        if (this.day < toDay) {
            screen.refresh(this);
            window.setTimeout(runDay, 700);
        }

        function runDay() {
            self.day++;
            var allDead = true;
            for (var i = 0, len = self.individuals.length; i < len; i++) {
                var survived = self.updateIndividual(self.individuals[i]);
                if (allDead && survived) allDead = false;
            }
            screen.refresh(self);

            if (!allDead && self.day < toDay && !Seres.STOP)
                window.setTimeout(runDay, 100);
            else {
                Seres.STOP = false;
                Util.log("Finished");
            }
        }
    };

    this.updateIndividual = function(ind) {
        if (ind.loneIslandEnergy <= 0) return false;

        // Update age
        ind.loneIslandAge = this.day;

        // Update energy loss
        var currTerrain = this.world.getTerrain(ind.torusX, ind.torusY);
        ind.loneIslandEnergy -= currTerrain === LoneIsland.water ? LoneIsland.energyLossOnWater : LoneIsland.energyLossOnGround;

        // Update brain inputs
        if (ind.loneIslandCachedNearestGround === null) cacheNearestGround(ind);
        ind.brain.inputs[0].value = ind.loneIslandCachedNearestGround.bearing;
        ind.brain.inputs[1].value = currTerrain;

        // Update brain outputs
        ind.brain.update(this.day);

        // Move
        moveIndividual(ind);

        return true;
    };

    function putTerrain(terrain, x, y) {
        self.world.putTerrain(terrain, x, y);
        if (terrain === LoneIsland.ground) self.world.loneIslangGroundSquares.push({ x: x, y: y});
    }

    function defineWorld() {
        self.world = new Torus(self.WORLD_SIZE, self.WORLD_SIZE, LoneIsland.water);
        self.world.loneIslangGroundSquares = [];
        putTerrain(LoneIsland.ground, 9, 9);
        putTerrain(LoneIsland.ground, 10, 9);
        putTerrain(LoneIsland.ground, 9, 10);
        putTerrain(LoneIsland.ground, 10, 10);
    }

    function randomBorderPosition() {
        if (Math.random() < (40 / 78))
            return { x: Math.random() < 0.5 ? 0 : 19, y: (Math.random() * 19) | 0 };
        else
            return { x: (Math.random() * 19) | 0, y: Math.random() < 0.5 ? 0 : 19 };
    }

    function moveIndividual(ind) {
        if (ind.loneIslandEnergy <= 0) return;

        var intensity = ind.brain.outputs[1].value;
        if (intensity === 0) return;

        var bearing = ind.brain.outputs[0].value;
        if ((intensity >= 0 ? intensity : -intensity) > ind.loneIslandEnergy) intensity = ind.loneIslandEnergy * (intensity >= 0 ? 1 : -1);
        var moved = self.world.moveObjectBearing(ind, bearing, intensity);
        if (moved) {
            ind.loneIslandEnergy -= (intensity >= 0 ? intensity : -intensity);
            ind.loneIslandCachedNearestGround = null;              // clear cached value
        }
    }

    function nearestGroundSquare(x, y) {
        var minDist = 10000000;
        var nearestGround;
        for (var i = 0, len = self.world.loneIslangGroundSquares.length; i < len; i++) {
            var ground = self.world.loneIslangGroundSquares[i];
            var dX = ground.x - x;
            var dY = ground.y - y;
            var dist = Math.abs(dX) + Math.abs(dY);
            if (dist < minDist) {
                minDist = dist;
                nearestGround = { x: ground.x, y: ground.y, dX: dX, dY: dY };
            }
        }
        return nearestGround;
    }

    function cacheNearestGround(ind) {
        var nearest = nearestGroundSquare(ind.torusX, ind.torusY);
        // Calculate bearing
        if (nearest.dX === 0) {
            nearest.bearing = nearest.dY > 0 ? -0.5 : 0.5;        // Special case...
        } else {
            var rads = Math.atan(nearest.dY / nearest.dX);
            if (nearest.dX < 0) rads += Math.PI;
            else if (nearest.dY < 0) rads += 2 * Math.PI;
            nearest.bearing = rads / Math.PI - 1;
        }
        ind.loneIslandCachedNearestGround = nearest;
    }


    // Drawable Grid interface

    this.getGridDimensions = function() {
        return { x: this.WORLD_SIZE, y: this.WORLD_SIZE };
    };

    this.getGridBottomLayerShape = function(x, y) {
        switch(this.world.getTerrain(x, y)) {
            case 0: return "Grass";
            case 1: return "Water";
        }
    };

    this.getGridTopLayerShape = function(x, y) {
        var obj = this.world.getObject(x, y);
        return obj && obj.getShape();
    };

    // -----------------------------------------


    this.world = null;
    this.individuals = [];
    this.day = 0;

    this.WORLD_SIZE = 20;

    init();

};

LoneIsland.water  = 1;
LoneIsland.ground = 0;

LoneIsland.initialEnergy = 50;

LoneIsland.energyLossOnWater = 0.7;
LoneIsland.energyLossOnGround = 0.1;
