/**
 * Created by peccin on 02/12/2015.
 */

ScatteredFoodGame = {};

ScatteredFoodGame.evolvePopulation = function(pop, total, best, generations, evaluations) {

    var world = new ScatteredFood();
    L = world;

    if (!pop && generations > 0) {
        pop = Util.arrayFillFunc(new Array(total), function() {
            return new ScatteredFoodIndividual();
        }, best);
    } else {
        total = pop.length;
    }

    for (var g = 0; g < generations; g++) {
        // Best individuals survive and worst are replaced by clones of the best, with mutation
        for (var c = best, b = 0; c < total; c++, b++)
            pop[c] = new ScatteredFoodIndividual(Mutation.spawnMutating(pop[b].brain, Mutation.defaultParameters));

        // Evaluate population
        for (var i = 0; i < total; i++)
            world.evaluateIndividual(pop[i], evaluations);
        pop.sort(function(a, b) {
            return b.scatteredFoodFitness - a.scatteredFoodFitness;
        });

        // Save best individuals regularly
        if (generations % 10 === 0) {
            var bestInds = new Array(best);
            for (var s = 0; s < best; s++) bestInds[s] = pop[s].brain.toGenome();
            localStorage["ScatteredFoodBestPopulation"] = JSON.stringify(bestInds);
        }
    }

    // One last animated run for the best individual
    world.reset();
    pop[0].reset();
    world.putIndividual(pop[0]);
    world.runAnimate(Seres.screen);

    return pop;
};

ScatteredFoodGame.evolveIndividual = function(individual, generations, evaluations) {

    var world = new ScatteredFood();
    L = world;

    var ind = individual;
    if (!ind && generations > 0) {
        ind = new ScatteredFoodIndividual();
        world.evaluateIndividual(ind, evaluations);
    }

    for (var i = 0; i < generations; i++) {
        var newInd = new ScatteredFoodIndividual(Mutation.spawnMutating(ind.brain, Mutation.defaultParameters));
        world.evaluateIndividual(newInd, evaluations);

        if (newInd.scatteredFoodFitness >= ind.scatteredFoodFitness) ind = newInd;

        if (generations % 10 === 0) localStorage["ScatteredFoodBest"] = JSON.stringify(ind.brain.toGenome());
    }

    // One last animated run for the best individual
    world.reset();
    ind.reset();
    world.putIndividual(ind);
    world.runAnimate(Seres.screen);

    return ind;

};

LoneIslandGame.bestOutOf = function(all, bestCount) {

    all.sort(function(a, b) {
        return b.scatteredFoodFitness - a.scatteredFoodFitness;
    });

    return all.slice(0, bestCount);

};

