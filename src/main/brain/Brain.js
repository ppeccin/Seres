/**
 * Created by peccin on 27/11/2015.
 */

Brain = function() {

    this.time = 0;

};

Brain.create = function(numInputs, numOutputs) {
    var b = new Brain();

    b.inputs = Util.arrayFillFunc(new Array(numInputs), function(i) {
        return InputNeuron.create();
    });

    b.outputs = Util.arrayFillFunc(new Array(numOutputs), function(i) {
        return OutputNeuron.create();
    });

    b.neurons = b.inputs.slice(0);
    Util.arrayAddAll(b.neurons, b.outputs);

    return b;
};

Brain.createFromGenome = function(gen) {
    var b = new Brain();

    b.inputs = Util.arrayFillFunc(new Array(gen.numInputs), function(i) {
        return InputNeuron.createFromGenome(gen.neurons[i]);
    });

    b.outputs = Util.arrayFillFunc(new Array(gen.numOutputs), function(i) {
        return OutputNeuron.createFromGenome(gen.neurons[gen.numInputs + i]);
    });

    b.neurons = b.inputs.slice(0);
    Util.arrayCopy(b.outputs, 0, b.neurons, b.neurons.length);

    for (var i = gen.numInputs + gen.numOutputs, len = gen.neurons.length; i < len; i++)
        b.neurons[i] = Neuron.createFromGenome(gen.neurons[i]);

    for (i = 0, len = b.neurons.length; i < len; i++)
        b.neurons[i].fromGenomeFinish(gen.neurons[i], b.neurons);

    return b;
};

Brain.prototype.spawn = function() {
    return Brain.createFromGenome(this.toGenome());
};

Brain.prototype.reset = function() {
    this.time = 0;
    for (var i = 0, len = this.neurons.length; i < len; i++) {
        this.neurons[i].value = 0;
        this.neurons[i].time = 0;
    }
};

Brain.prototype.update = function(toTime) {
    if (this.time >= toTime) return this.value;

    this.time = toTime;

    var numOutputs = this.outputs.length;
    if (numOutputs === 0) return this.value;

    // First request update from all outputs
    for (var i = 0; i < numOutputs; i++)
        this.outputs[i].update(toTime);

    return this.outputs;
};

Brain.prototype.toGenome = function() {
    var gen = {};
    gen.numInputs = this.inputs.length;
    gen.numOutputs = this.outputs.length;

    for (var i = 0, len = this.neurons.length; i < len; i++)
        this.neurons[i].genId = i;

    gen.neurons = new Array(this.neurons.length);

    for (i = 0, len = this.neurons.length; i < len; i++)
        gen.neurons[i] = this.neurons[i].toGenome();

    return gen;
};


