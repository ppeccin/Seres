/**
 * Created by peccin on 27/11/2015.
 */

Neuron = function() {

    this.value = 0;
    this.time = 0;

};

Neuron.create = function(inputs, weights, operator) {
    var n = new Neuron();
    n.operator = operator || opAverage;
    n.inputs = inputs || [];
    n.weights = weights || Util.arrayFill(new Array(n.inputs.length), 1);
    return n;
};

Neuron.createFromGenome = function(gen) {
    return new Neuron();
};

Neuron.prototype.update = function(toTime) {
    if (this.time >= toTime) return this.value;

    this.time = toTime;

    var numInputs = this.inputs.length;
    if (numInputs === 0) return this.value;

    // First request update from all inputs
    for (var i = 0; i < numInputs; i++)
        this.inputs[i].update(toTime);

    // Then update value
    this.value = this.operator(this.inputs, this.weights);

    return this.value;
};

Neuron.prototype.toGenome = function(neuronIds) {
    var gen = {
        op: this.operator.name,
        inputs: new Array(this.inputs.length),
        weights: new Array(this.weights.length)
    };

    for (var i = 0, len = this.inputs.length; i < len; i++) {
        gen.inputs[i] = this.inputs[i].genId;
        gen.weights[i] = this.weights[i];
    }

    return gen;
};

Neuron.prototype.fromGenomeFinish = function(gen, neurons) {
    var inputs = new Array(gen.inputs.length);
    var weights = new Array(gen.weights.length);
    for (var i = 0, len = inputs.length; i < len; i++) {
        inputs[i] = neurons[gen.inputs[i]];
        weights[i] = gen.weights[i];
    }

    this.inputs = inputs;
    this.weights = weights;
    this.operator = eval(gen.op);
};

