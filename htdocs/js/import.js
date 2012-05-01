/**
 * Import script files.
 * @author htanjo
 */
(function () {

    var sources = [

        // WebGL library
        'js/lib/Three.js',

        // Utilities
        'js/lib/Stats.js',
        'js/lib/Tween.js',
        'js/lib/jquery-1.7.2.min.js',

        // Application components
        'js/app/stealth.js',
        'js/app/stealth.camera.js',
        'js/app/stealth.stage.js',
        'js/app/stealth.pc.js',
        'js/app/stealth.enemy.js',
        'js/app/stealth.radar.js',
        'js/app/stealth.input.js',
        'js/app/stealth.game.js',

        // Application booter
        'js/app/main.js'
    ];

    for (var i = 0; i < sources.length; i++) {
        document.write('<script src="' + sources[i] + '"></script>');
    }

}());