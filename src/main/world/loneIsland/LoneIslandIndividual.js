/**
 * Created by peccin on 30/11/2015.
 */

LoneIslandIndividual = function(brain) {
    var self = this;

    function init() {
        self.brain = brain || Brain.create(2, 2);
        self.reset();
        if (!brain) self.basicConfig();
    }

    this.reset = function() {
        this.brain.reset();
        this.loneIslandAge = 0;
        this.loneIslandEnergy = LoneIsland.initialEnergy;
        this.loneIslandCachedNearestGround = null;
        this.loneIslandFitness = null;
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
        this.brain.outputs[1].inputs[0] = this.brain.inputs[1];
    };

    this.getShape = function() {
        return this.loneIslandEnergy > 0 ? "RedCircle" : "GrayCircle";
    };


    this.brain = null;
    this.loneIslandAge = 0;
    this.loneIslandEnergy = 0;
    this.loneIslandCachedNearestGround = null;

    init();

};



