/**
 * Created by peccin on 02/12/2015.
 */

LoneIslandGame = {};

LoneIslandGame.bestOutOf = function(best, total, evaluations) {

    var all = Util.arrayFillFunc(new Array(total), function(i) {
        return new LoneIslandIndividual();
    });

    var loneIsland = new LoneIsland();
    L = loneIsland;

    for (var i = 0, len = all.length; i < len; i++) {
        var ind = all[i];
        loneIsland.evaluateIndividual(ind, evaluations);
    }

    all.sort(function(a, b) {
        return b.loneIslandFitness - a.loneIslandFitness;
    });

    return all.slice(0, best);

};

LoneIslandGame.evolveIndividual = function(individual, generations, evaluations) {

    var loneIsland = new LoneIsland();
    L = loneIsland;

    var ind = individual;
    if (!ind && generations > 0) {
        ind = new LoneIslandIndividual();
        loneIsland.evaluateIndividual(ind, evaluations);
    }

    for (var i = 0; i < generations; i++) {
        var newInd = new LoneIslandIndividual(Mutation.spawnMutating(ind.brain, Mutation.defaultParameters));
        loneIsland.evaluateIndividual(newInd, evaluations);

        if (newInd.loneIslandFitness >= ind.loneIslandFitness) ind = newInd;
    }

    // One last animated run for the best individual
    loneIsland.reset();
    ind.reset();
    loneIsland.putIndividual(ind);
    loneIsland.runAnimate(Seres.screen);

    return ind;
};
