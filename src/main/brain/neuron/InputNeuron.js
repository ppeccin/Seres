/**
 * Created by peccin on 27/11/2015.
 */

InputNeuron = function() {

    this.value = 0;
    this.time = 0;

};

InputNeuron.create = function() {
    return new InputNeuron();
};

InputNeuron.createFromGenome = function(gen) {
    return new InputNeuron();
};

InputNeuron.prototype.update = function(toTime) {
    if (this.time >= toTime) return this.value;

    this.time = toTime;

    return this.value;
};

InputNeuron.prototype.toGenome = function() {
    return {};
};

InputNeuron.prototype.fromGenomeFinish = function(gen, neurons) {
};



