// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

CanvasGridDisplay = function(mainElement) {

    function init(self) {
        setupMain();
        setupOSD();
    }

    this.powerOn = function() {
        setCRTFilter(1);
        mainElement.style.visibility = "visible";
        this.focus();
    };

    this.powerOff = function() {
        mainElement.style.visibility = "hidden";
        mainElement.style.display = "none";
    };

    this.refresh = function(grid) {
        adjustDimensions(grid);
        for (var x = 0; x < gridWidth; x++) {
            for (var y = 0; y < gridHeight; y++) {
                canvasContext.setTransform(1, 0, 0, 1, 0, 0);
                canvasContext.translate(x * SQUARE_SIZE, y * SQUARE_SIZE);
                canvasContext.beginPath();
                var shape = grid.getGridBottomLayerShape(x, y);
                if (shape) ShapeRenderer[shape](canvasContext);
                shape = grid.getGridTopLayerShape(x, y);
                if (shape) ShapeRenderer[shape](canvasContext);
            }
        }
    };

    this.showOSD = function(message, overlap) {
        //Util.log(message);
        if (osdTimeout) clearTimeout(osdTimeout);
        if (!message) {
            osd.style.transition = "all 0.15s linear";
            osd.style.top = "-29px";
            osd.style.opacity = 0;
            osdShowing = false;
            return;
        }
        if (overlap || !osdShowing) osd.innerHTML = message;
        osd.style.transition = "none";
        osd.style.top = "15px";
        osd.style.opacity = 1;
        osdShowing = true;
        osdTimeout = setTimeout(function() {
            osd.style.transition = "all 0.15s linear";
            osd.style.top = "-29px";
            osd.style.opacity = 0;
            osdShowing = false;
        }, OSD_TIME);
    };

    this.displayToggleFullscreen = function() {
        if (Seres.SCREEN_FULLSCREEN_DISABLED) return;

        if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
            if (fsElement.requestFullscreen)
                fsElement.requestFullscreen();
            else if (fsElement.webkitRequestFullscreen)
                fsElement.webkitRequestFullscreen();
            else if (fsElement.webkitRequestFullScreen)
                fsElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            else if (fsElement.mozRequestFullScreen)
                fsElement.mozRequestFullScreen();
            else if (fsElement.msRequestFullscreen)
                fsElement.msRequestFullscreen();
            else
                this.showOSD("Fullscreen is not supported by your browser!");
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    };

    this.focus = function() {
        canvas.focus();
    };

    var fullScreenChanged = function() {
        var fse = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
        isFullscreen = !!fse;
    };

    var setElementsSizes = function (width, height) {
        canvas.style.width = "" + width + "px";
        canvas.style.height = "" + height + "px";
        // Do not change containers sizes while in fullscreen
        if (isFullscreen) return;
        borderElement.style.width = "" + width + "px";
        borderElement.style.height = "" + height + "px";
        width += borderLateral * 2;
        height += borderTop + borderBottom;
        mainElement.style.width = "" + width + "px";
        mainElement.style.height = "" + height + "px";
    };

    var setCRTFilter = function(level) {
        crtFilter = level;
        updateImageSmoothing();
    };

    var updateImageSmoothing = function () {
        canvas.style.imageRendering = (crtFilter === 1 || crtFilter === 3) ? "initial" : canvasImageRenderingValue;
        var smoothing = crtFilter >= 2;
        if (canvasContext.imageSmoothingEnabled !== undefined)
            canvasContext.imageSmoothingEnabled = smoothing;
        else {
            canvasContext.webkitImageSmoothingEnabled = smoothing;
            canvasContext.mozImageSmoothingEnabled = smoothing;
            canvasContext.msImageSmoothingEnabled = smoothing;
        }
    };

    var setupMain = function () {
        mainElement.style.position = "relative";
        mainElement.style.overflow = "hidden";
        mainElement.style.outline = "none";
        mainElement.tabIndex = "-1";               // Make it focusable

        borderElement = document.createElement('div');
        borderElement.style.position = "relative";
        borderElement.style.overflow = "hidden";
        borderElement.style.background = "black";
        borderElement.style.border = "0 solid black";
        borderElement.style.borderWidth = "" + borderTop + "px " + borderLateral + "px " + borderBottom + "px";

        fsElement = document.createElement('div');
        fsElement.style.position = "relative";
        fsElement.style.width = "100%";
        fsElement.style.height = "100%";
        fsElement.style.overflow = "hidden";
        fsElement.style.background = "black";

        document.addEventListener("fullscreenchange", fullScreenChanged);
        document.addEventListener("webkitfullscreenchange", fullScreenChanged);
        document.addEventListener("mozfullscreenchange", fullScreenChanged);
        document.addEventListener("msfullscreenchange", fullScreenChanged);

        borderElement.appendChild(fsElement);

        canvas = document.createElement('canvas');
        canvas.width = Seres.SCREEN_DEFAULT_WIDTH;
        canvas.height = Seres.SCREEN_DEFAULT_HEIGHT;
        canvas.style.position = "absolute";
        canvas.style.display = "block";
        canvas.style.left = canvas.style.right = 0;
        canvas.style.top = canvas.style.bottom = 0;
        canvas.style.background = "black";
        canvas.style.margin = "auto";
        canvas.tabIndex = "-1";               // Make it focusable
        canvas.style.outline = "none";
        canvas.style.border = "none";
        fsElement.appendChild(canvas);

        setElementsSizes(canvas.width, canvas.height);

        // Prepare Context used to draw frame
        canvasContext = canvas.getContext("2d");
        canvasContext.globalCompositeOperation = "copy";
        canvasContext.save();

        // Try to determine correct value for image-rendering for the canvas filter modes
        switch (Util.browserInfo().name) {
            case "CHROME":
            case "OPERA":   canvasImageRenderingValue = "pixelated"; break;
            case "FIREFOX": canvasImageRenderingValue = "-moz-crisp-edges"; break;
            case "SAFARI":  canvasImageRenderingValue = "-webkit-crisp-edges"; break;
            default:        canvasImageRenderingValue = "initial";
        }

        mainElement.appendChild(borderElement);
    };

    var setupOSD = function() {
        osd = document.createElement('div');
        osd.style.position = "absolute";
        osd.style.overflow = "hidden";
        osd.style.top = "-29px";
        osd.style.right = "18px";
        osd.style.height = "29px";
        osd.style.padding = "0 12px";
        osd.style.margin = "0";
        osd.style.font = 'bold 15px/29px sans-serif';
        osd.style.color = "rgb(0, 255, 0)";
        osd.style.background = "rgba(0, 0, 0, 0.6)";
        osd.style.opacity = 0;
        osd.style.userSelect = "none";
        osd.style.webkitUserSelect = "none";
        osd.style.MozUserSelect = "none";
        osd.style.msUserSelect = "none";
        osd.innerHTML = "";
        fsElement.appendChild(osd);
    };

    function adjustDimensions(grid) {
        var dim = grid.getGridDimensions();
        if (dim.x === gridWidth && dim.y === gridHeight) return;

        gridWidth = dim.x;
        gridHeight = dim.y;

        canvas.width = gridWidth * SQUARE_SIZE;
        canvas.height = gridHeight * SQUARE_SIZE;
        setElementsSizes(canvas.width, canvas.height);
    }


    var gridWidth = 0;
    var gridHeight = 0;

    var borderElement;
    var fsElement;

    var canvas;
    var canvasContext;
    var canvasImageRenderingValue;

    var osd;
    var osdTimeout;
    var osdShowing = false;

    var isFullscreen = false;
    var crtFilter = 1;

    var borderTop = 1;
    var borderLateral = 1;
    var borderBottom = 1;

    var OSD_TIME = 2500;

    var SQUARE_SIZE = ShapeRenderer.SQUARE_SIZE;

    init(this);

};

