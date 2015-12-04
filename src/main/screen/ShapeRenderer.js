/**
 * Created by peccin on 04/12/2015.
 */

ShapeRenderer =  {

    Empty: function(context) {
        context.fillStyle = "white";
        context.fillRect(0, 0, ShapeRenderer.SQUARE_SIZE, ShapeRenderer.SQUARE_SIZE);
    },

    Green: function(context) {
        context.fillStyle = "lightgreen";
        context.fillRect(0, 0, ShapeRenderer.SQUARE_SIZE, ShapeRenderer.SQUARE_SIZE);
    },

    RedCircle: function(context) {
        context.fillStyle = "red";
        context.arc(ShapeRenderer.SQUARE_SIZE / 2, ShapeRenderer.SQUARE_SIZE / 2, ShapeRenderer.SQUARE_SIZE *.35, 0, Math.PI * 2);
        context.fill();
    },

    GrayCircle: function(context) {
        context.fillStyle = "gray";
        context.arc(ShapeRenderer.SQUARE_SIZE / 2, ShapeRenderer.SQUARE_SIZE / 2, ShapeRenderer.SQUARE_SIZE *.35, 0, Math.PI * 2);
        context.fill();
    }

};

ShapeRenderer.SQUARE_SIZE = 20;
