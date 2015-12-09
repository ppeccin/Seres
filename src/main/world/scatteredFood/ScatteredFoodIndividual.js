/**
 * Created by peccin on 30/11/2015.
 */

ScatteredFoodIndividual = function(brain) {
    var self = this;

    function init() {
        self.brain = brain || Brain.create(2, 2);
        self.reset();
        self.resetAverageFitness();
        if (!brain) self.basicConfig();
    }

    this.reset = function() {
        this.brain.reset();
        this.scatteredFoodAge = 0;
        this.scatteredFoodEnergy = ScatteredFood.initialEnergy;
        this.scatteredFoodCachedNearestFood = null;
        this.scatteredFoodAverageFitness = null;
    };

    this.resetAverageFitness = function() {
        this.scatteredFoodFitnessMeasures = [];
    };

    this.basicConfig = function() {
        var b = self.brain;
        var inters = Util.arrayFillFunc(new Array(2), function(i) {
            return Neuron.create([b.inputs[0], b.inputs[1]], [0, 0], opHighestPower);
        });
        Util.arrayAddAll(b.neurons, inters);

        this.brain.outputs[0].inputs[0] = inters[0];
        this.brain.outputs[1].inputs[0] = inters[1];
    };

    this.testConfig = function() {
        this.brain.outputs[0].inputs[0] = this.brain.inputs[0];
        this.brain.outputs[0].weights[0] = 1;
        this.brain.outputs[1].inputs[0] = this.brain.inputs[2];
        this.brain.outputs[1].weights[0] = 1;
    };

    this.getShape = function() {
        return this.scatteredFoodEnergy > 0 ? "Animal" : "DeadAnimal";
    };

    this.rememberFitness = function() {
        this.scatteredFoodFitnessMeasures.push(this.scatteredFoodAge);
    };

    this.averageFitness = function() {
        if (this.scatteredFoodAverageFitness === null) {
            this.scatteredFoodAverageFitness = Util.arrayAverage(this.scatteredFoodFitnessMeasures);
            this.scatteredFoodFitnessMeasures = [];
        }
        return this.scatteredFoodAverageFitness;
    };


    this.brain = null;
    this.scatteredFoodAge = 0;
    this.scatteredFoodEnergy = 0;
    this.scatteredFoodCachedNearestFood = null;
    this.scatteredFoodAverageFitness = null;
    this.scatteredFoodFitnessMeasures = null;

    init();

};



