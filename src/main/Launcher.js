// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

Seres.start = function () {
    // Can only be started once
    delete Seres.start;

    // Get container elements
    if (!Seres.screenElement) {
        Seres.screenElement = document.getElementById(Seres.SCREEN_ELEMENT_ID);
        if (!Seres.screenElement)
            throw new Error('Seres cannot be started. ' +
                'HTML document is missing screen element with id "' + Seres.SCREEN_ELEMENT_ID + '"');
    }

    // Build and start emulator
    Seres.screen = new CanvasGridDisplay(Seres.screenElement);
    Seres.screen.powerOn();
    Util.log(Seres.VERSION + " started");
};

Seres.autoStart = function() {
    var domReady = false;
    function tryLaunch(bypass) {
        if (Seres.start && (domReady || bypass)) Seres.start();
    }

    document.addEventListener("DOMContentLoaded", function() {
        domReady = true;
        tryLaunch(false);
    });

    window.addEventListener("load", function() {
        tryLaunch(true);
    });

};

Seres.autoStart();
