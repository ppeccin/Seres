/**
 * Created by peccin on 30/11/2015.
 */

// A torus land with scattered food around
// Individuals spawn at random positions and have to eat food to survive more time
// Individual specs:
//      Inputs:
//              bearing of the nearest food square
//              current energy
//      Outputs:
//              bearing to move (according to torus definition)
//              intensity to move


ScatteredFood = function() {
    var self = this;

    function init() {
    }

    this.reset = function() {
        defineWorld();
        this.individuals.length = 0;
        this.day = 0;
    };

    this.putIndividual = function(ind) {
        do {
            var pos = randomPosition();
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
            fitnesses.push(individual.scatteredFoodAge);
        }

        var avg = Util.arrayAverage(fitnesses);
        individual.scatteredFoodFitness = avg;

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
                window.setTimeout(runDay, 60);
            else {
                Seres.STOP = false;
                Util.log("Finished");
            }
        }
    };

    this.updateIndividual = function(ind) {
        if (ind.scatteredFoodEnergy <= 0) return false;

        // Update age
        ind.scatteredFoodAge = this.day;

        // Update energy loss
        var currTerrain = this.world.getTerrain(ind.torusX, ind.torusY);
        if (currTerrain === ScatteredFood.food) {
            ind.scatteredFoodEnergy += ScatteredFood.energyGainOnFood;
            putTerrain(ScatteredFood.ground, ind.torusX, ind.torusY);
            ind.scatteredFoodCachedNearestFood = null;
        } else {
            ind.scatteredFoodEnergy -= ScatteredFood.energyLossOnGround;
        }

        // Update brain inputs
        if (ind.scatteredFoodCachedNearestFood === null) cacheNearestFood(ind);
        var nearest = ind.scatteredFoodCachedNearestFood;
        ind.brain.inputs[0].value = nearest ? nearest.bearing : -1;
        ind.brain.inputs[1].value = nearest ? 1 : 0;

        // Update brain outputs
        ind.brain.update(this.day);

        // Move
        moveIndividual(ind);

        return true;
    };

    function putTerrain(terrain, x, y) {
        x = Math.round(x);
        y = Math.round(y);
        if (terrain === ScatteredFood.food)
            self.world.scatteredFoodFoodSquares.push({ x: x, y: y });
        else if(self.world.getTerrain(x, y) === ScatteredFood.food) Util.arrayRemoveAllOccurrencesFunc(self.world.scatteredFoodFoodSquares, function(e) {
            return e.x === x && e.y === y;
        });

        self.world.putTerrain(terrain, x, y);
    }

    function defineWorld() {
        self.world = new Torus(self.WORLD_SIZE, self.WORLD_SIZE, ScatteredFood.ground);
        putFood();
    }

    function randomPosition() {
        return { x: (Math.random() * 19) | 0, y: Math.random() * 19 | 0};
    }

    function moveIndividual(ind) {
        if (ind.scatteredFoodEnergy <= 0) return;

        var intensity = ind.brain.outputs[1].value;
        if (intensity === 0) return;

        var bearing = ind.brain.outputs[0].value;
        if ((intensity >= 0 ? intensity : -intensity) > ind.scatteredFoodEnergy) intensity = ind.scatteredFoodEnergy * (intensity >= 0 ? 1 : -1);
        var moved = self.world.moveObjectBearing(ind, bearing, intensity);
        if (moved) {
            ind.scatteredFoodEnergy -= (intensity >= 0 ? intensity : -intensity) * ScatteredFood.energyLossOnMoveFactor;
            ind.scatteredFoodCachedNearestFood = null;
        }
    }

    function nearestFoodSquare(x, y) {
        var minDist = 10000000;
        var nearestFood;
        for (var i = 0, len = self.world.scatteredFoodFoodSquares.length; i < len; i++) {
            var food = self.world.scatteredFoodFoodSquares[i];
            var dX = food.x - x;
            var dY = food.y - y;
            var dist = Math.abs(dX) + Math.abs(dY);
            if (dist < minDist) {
                minDist = dist;
                nearestFood = { x: food.x, y: food.y, dX: dX, dY: dY };
            }
        }
        return nearestFood;
    }

    function cacheNearestFood(ind) {
        var nearest = nearestFoodSquare(ind.torusX, ind.torusY);
        if (!nearest) {
            ind.scatteredFoodCachedNearestFood = null;
            return;
        }

        // Calculate bearing
        if (nearest.dX === 0) {
            nearest.bearing = nearest.dY > 0 ? -0.5 : 0.5;        // Special case...
        } else {
            var rads = Math.atan(nearest.dY / nearest.dX);
            if (nearest.dX < 0) rads += Math.PI;
            else if (nearest.dY < 0) rads += 2 * Math.PI;
            nearest.bearing = rads / Math.PI - 1;
        }
        ind.scatteredFoodCachedNearestFood = nearest;
    }

    function putFood() {
        self.world.scatteredFoodFoodSquares = [];
        for (var i = 0; i < ScatteredFood.foodCound; i++) {
            do {
                var pos = randomPosition();
            } while (self.world.getTerrain(pos.x, pos.y) === ScatteredFood.food);

            putTerrain(ScatteredFood.food, pos.x, pos.y);
        }
    }

    // Drawable Grid interface

    this.getGridDimensions = function() {
        return { x: this.WORLD_SIZE, y: this.WORLD_SIZE };
    };

    this.getGridBottomLayerShape = function(x, y) {
        switch(this.world.getTerrain(x, y)) {
            case 0: return "Empty";
            case 1: return "Food";
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

ScatteredFood.ground = 0;
ScatteredFood.food = 1;

ScatteredFood.initialEnergy = 50;

ScatteredFood.energyLossOnMoveFactor = 0.3;
ScatteredFood.energyLossOnGround = 1;
ScatteredFood.energyGainOnFood  = 20;

ScatteredFood.foodCound  = 10;
