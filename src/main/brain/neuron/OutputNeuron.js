/**
 * Created by peccin on 27/11/2015.
 */

OutputNeuron = function() {

    this.value = 0;
    this.time = 0;

    this.inputs = [ null ];
    this.weights = 1;

};

OutputNeuron.create = function(input, weight) {
    var n = new OutputNeuron();
    n.inputs = [ input || null ];
    n.weights = [ weight || 0 ];
    return n;
};

OutputNeuron.createFromGenome = function(gen) {
    return new OutputNeuron();
};

OutputNeuron.prototype.update = function(toTime) {
    if (this.time >= toTime) return this.value;

    this.time = toTime;

    if (!this.inputs[0]) return this.value;

    // First request update from input
    this.inputs[0].update(toTime);

    // Then update value
    this.value = this.inputs[0].value * this.weights[0];

    return this.value;
};

OutputNeuron.prototype.toGenome = function() {
    return {
        input: this.inputs[0] ? this.inputs[0].genId : -1,
        weight: this.weights[0]
    };
};

OutputNeuron.prototype.fromGenomeFinish = function(gen, neurons) {
    this.inputs = [ gen.input >= 0 ? neurons[gen.input] : null ];
    this.weights = [ gen.weight ];
};
