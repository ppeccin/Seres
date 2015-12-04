/**
 * Created by peccin on 04/12/2015.
 */

ShapeRenderer =  {

    Empty: function(context) {
        context.fillStyle = "white";
        context.fillRect(0, 0, ShapeRenderer.SQUARE_SIZE, ShapeRenderer.SQUARE_SIZE);
    },

    Water: function(context) {
        context.fillStyle = "lightblue";
        context.fillRect(0, 0, ShapeRenderer.SQUARE_SIZE, ShapeRenderer.SQUARE_SIZE);
    },

    Grass: function(context) {
        context.fillStyle = "rgb(70, 160, 70)";
        context.fillRect(0, 0, ShapeRenderer.SQUARE_SIZE, ShapeRenderer.SQUARE_SIZE);
    },

    Animal: function(context) {
        context.fillStyle = "red";
        context.arc(ShapeRenderer.SQUARE_SIZE / 2, ShapeRenderer.SQUARE_SIZE / 2, ShapeRenderer.SQUARE_SIZE *.35, 0, Math.PI * 2);
        context.fill();
    },

    DeadAnimal: function(context) {
        context.fillStyle = "gray";
        context.arc(ShapeRenderer.SQUARE_SIZE / 2, ShapeRenderer.SQUARE_SIZE / 2, ShapeRenderer.SQUARE_SIZE *.35, 0, Math.PI * 2);
        context.fill();
    }

};

ShapeRenderer.SQUARE_SIZE = 20;
