/**
 * Created by peccin on 27/11/2015.
 */

function testBrain() {

    B = Brain.create(5, 1);

    N = Neuron.create([B.inputs[1], B.inputs[2]], [1, 1], opAverage);

    B.neurons.push(N);

    B.outputs[0].inputs[0] = N;

    B.inputs[1].value = 0.6;

}

function testTorus() {
    T = new Torus(20, 20, 0);
    O = {};
    T.putObject(O, 10, 10);
}

function testLoneIsland() {

    L = new LoneIsland();
    I = new LoneIslandIndividual();

    return I;
}

