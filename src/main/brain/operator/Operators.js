/**
 * Created by peccin on 27/11/2015.
 */

function opAverage(inputs, weights) {
    if (inputs.length <= 1) return inputs[0] * weights[0];

    var len = inputs.length;
    var sum = 0;
    for (var i = 0; i < len; i++) sum += inputs[i].value * weights[i];

    return sum / len;
}

function opHighestPower(inputs, weights) {
    if (inputs.length <= 1) return inputs[0] * weights[0];

    var len = inputs.length;
    var highestVal = 0;
    var highestPower = 0;
    for (var i = 0; i < len; i++) {
        var value = inputs[i].value * weights[i];
        var power = value >= 0 ? value : -value;
        if (power > highestPower) {
            highestVal = value;
            highestPower = power;
        }
    }

    return highestVal;
}