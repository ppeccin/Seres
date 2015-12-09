/**
 * Created by peccin on 02/12/2015.
 */

Mutation = {};

Mutation.spawnMutating = function(brain, pars) {
    return Mutation.mutate(brain.spawn(), pars);
};

Mutation.mutate = function(brain, pars) {

    var inputsCount = brain.inputs.length;
    var mutNeuronCount = brain.neurons.length - inputsCount;

    // Change Weights
    var cwc = pars.changeWeighChances;
    if (cwc.length > 0) {
        var t0 = pars.changeWeightTo0;
        var tP1 = t0 + pars.changeWeightToPos1;
        var tN1 = tP1 + pars.changeWeightToNeg1;

        for (var i = 0; i < cwc.length; i++) {
            var cw = cwc[i];
            if (Math.random() >= cw) break;

            var neuron = brain.neurons[inputsCount + ((Math.random() * mutNeuronCount) | 0)];
            var input = (Math.random() * neuron.inputs.length) | 0;

            var newWeight;
            var n = Math.random();
            if (n < t0) newWeight = 0;
            else if (n < tP1) newWeight = 1;
            else if (n < tN1) newWeight = -1;
            else newWeight = Math.random();

            neuron.weights[input] = newWeight;
        }
    }

    return brain;
};


Mutation.defaultParameters = {

    changeWeighChances: [1, 0.4, 0.3],
    changeWeightTo0: 0.2,
    changeWeightToPos1: 0.2,
    changeWeightToNeg1: 0.2

};
