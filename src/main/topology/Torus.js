
// A Toroidal world with X * Y positions
// Objects can have fractional positions and move by fractional units
// But always occupy an integral position in the field

Torus = function(width, height, defaultTerrain) {

    function init() {
        objects = Util.arrayFillFunc(new Array(width), function(x) {
            return Util.arrayFill(new Array(height), null);
        });
        terrain = Util.arrayFillFunc(new Array(width), function(x) {
            return Util.arrayFill(new Array(height), defaultTerrain);
        });
    }

    this.getObject = function(x, y) {
        return objects[Math.round(x)][Math.round(y)];
    };

    this.putObject = function(obj, x, y) {
        objects[Math.round(x)][Math.round(y)] = obj;
        if (obj) {
            obj.torusX = x;
            obj.torusY = y;
        }
    };

    this.removeObject = function(obj) {
        objects[Math.round(obj.torusX)][Math.round(obj.torusY)] = null;
        obj.torusX = null;
        obj.torusY = null;
    };

    this.moveObject = function(obj, x, y) {
        var iX = Math.round(x);
        var iY = Math.round(y);

        if (isNaN(iX) || isNaN(iY) || iX < 0 || iX > 19 || iY < 0 || iY > 19) {
            console.log("fodeu");
        }

        var old = objects[iX][iY];
        if (old && (old !== obj)) return null;

        objects[Math.round(obj.torusX)][Math.round(obj.torusY)] = null;
        objects[iX][iY] = obj;
        obj.torusX = x;
        obj.torusY = y;

        return obj;
    };

    this.getTerrain = function(x, y) {
        return terrain[Math.round(x)][Math.round(y)];
    };

    this.putTerrain = function(terr, x, y) {
        terrain[Math.round(x)][Math.round(y)] = terr;
    };

    this.moveObjectBearing = function(obj, bearing, intensity) {
        var rads = radiansForBearing(bearing);
        var x = obj.torusX;
        var y = obj.torusY;
        var newX = x + Math.cos(rads) * intensity;
        var newY = y + Math.sin(rads) * intensity;

        // Wrap around
        if (newX < -0.5 || (newX >= width -0.5))  newX = ((newX + 10 * width + 0.5) % width) - 0.5;
        if (newY < -0.5 || (newY >= height -0.5)) newY = ((newY + 10 * height + 0.5) % height) - 0.5;

        return this.moveObject(obj, newX, newY);
    };

    function radiansForBearing(value) {
        return (value + 1) * Math.PI;
    }


    var objects;
    var terrain;


    init();

};
