/**
 * Application booter.
 * @author htanjo
 */

require.config({
    paths: {
        jquery: 'lib/jquery-1.7.2',
        three: 'lib/Three',
        tween: 'lib/Tween'
    }
});

require([
    'jquery',
    'app/stealth.game',
    'tween'
], function ($, Game) {
    var game;

    TWEEN.start();

    $.ajax({
        url: 'data/stage_00.json',
        dataType: 'json',
        success: function (data) {
            game = new Game(data);
            game.start();
        }
    });
});