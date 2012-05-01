/**
 * Application booter.
 * @author htanjo
 */
(function ($) {

    var game;

    TWEEN.start();

    $.ajax({
        url: 'data/stage_00.json',
        dataType: 'json',
        success: function (data) {
            game = new Stealth.Game(data);
            game.start();
        }
    });

}(jQuery));