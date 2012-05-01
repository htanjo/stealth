/**
 * Class for Radar.
 * @author htanjo
 */
(function () {

    var canvas,
        context,
        map;

    /**
     * Create a radar.
     * @class Stealth.Radar
     * @param {Array} mapData Map array data.
     */
    Stealth.Radar = function (mapData) {

        canvas = document.createElement('canvas');
        canvas.setAttribute('id', 'radar');
        canvas.width = 220;
        canvas.height = 220;

        context = canvas.getContext('2d');

        map = mapData;

    };

    /**
     * Get DOM element.
     */
    Stealth.Radar.prototype.getDomElement = function () {

        return canvas;

    };

    /**
     * Update rendering.
     */
    Stealth.Radar.prototype.render = function (pc, enemies) {

        clear();
        renderBase();
        renderMap(pc, enemies);
        renderFrame();

    };

    function clear() {
        // Clear canvas
        context.save();
        context.beginPath();
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.closePath();
        context.restore();
    }

    function renderBase() {
        // Base circle
        context.save();
        context.beginPath();
        context.arc(canvas.width / 2, canvas.height / 2, 100, 0, 2 * Math.PI, false);
        context.closePath();
        context.fillStyle = 'rgba(0, 10, 5, 0.5)';
        context.fill();
        context.restore();
    }

    function renderMap(pc, enemies) {
        var i, j,
            radarChipSize = 15,
            chipSize = 100,
            offsetX = pc.position.x / chipSize * radarChipSize,
            offsetY = pc.position.z / chipSize * radarChipSize;

        // Ground
        context.save();

        context.beginPath();
        context.arc(canvas.width / 2, canvas.height / 2, 100, 0, 2 * Math.PI, false);
        context.closePath();
        context.clip();

        context.beginPath();

        for (i = 0; i < map.length; i++) {
            for (j = 0; j < map[i].length; j++) {
                if (i !== 0 && i !== map.length - 1 && j !== 0 && j !== map[i].length - 1) {
                    context.rect(j * radarChipSize - offsetX + canvas.width / 2, i * radarChipSize - offsetY + canvas.height / 2, radarChipSize, radarChipSize);
                }
            }
        }

        context.closePath();
        context.fillStyle = 'rgba(90, 150, 120, 0.3)';
        context.fill();
        context.restore();

        // Block object
        context.save();

        context.beginPath();
        context.arc(canvas.width / 2, canvas.height / 2, 100, 0, 2 * Math.PI, false);
        context.closePath();
        context.clip();

        context.beginPath();

        for (i = 0; i < map.length; i++) {
            for (j = 0; j < map[i].length; j++) {
                if (map[i][j] !== 0) {
                    context.rect(j * radarChipSize - offsetX + canvas.width / 2, i * radarChipSize - offsetY + canvas.height / 2, radarChipSize, radarChipSize);
                }
            }
        }

        context.closePath();
        context.fillStyle = 'rgba(90, 150, 120, 0.5)';
        context.fill();
        context.restore();

        for (i = 0; i < enemies.length; i++) {
            (function () {
                var x = enemies[i].position.x / chipSize * radarChipSize - offsetX + canvas.width / 2,
                    y = enemies[i].position.z / chipSize * radarChipSize - offsetY + canvas.height / 2,
                    rotation = -enemies[i].rotation.y,
                    gradient;

                // Enemy point
                context.save();

                context.beginPath();
                context.arc(canvas.width / 2, canvas.height / 2, 100, 0, 2 * Math.PI, false);
                context.closePath();
                context.clip();

                context.beginPath();
                context.arc(x, y, 2.5, 0, 2 * Math.PI, false);
                context.closePath();
                context.fillStyle = 'rgb(250, 190, 120)';
                context.shadowColor = 'rgb(240, 140, 120)';
                context.shadowBlur = 8;
                context.fill();
                context.fill();

                context.restore();

                // Enemy vision
                context.save();

                context.beginPath();
                context.arc(canvas.width / 2, canvas.height / 2, 100, 0, 2 * Math.PI, false);
                context.closePath();
                context.clip();

                context.beginPath();
                context.moveTo(x, y);
                context.arc(x, y, 70, rotation - (45 / 180 * Math.PI), rotation + (45 / 180 * Math.PI), false);
                context.closePath();
                gradient = context.createRadialGradient(x, y, 0, x, y, 70);
                gradient.addColorStop(0, 'rgba(250, 190, 120, 0.2)');
                gradient.addColorStop(0.5, 'rgba(250, 190, 120, 0.2)');
                gradient.addColorStop(1, 'rgba(250, 190, 120, 0)');
                context.fillStyle = gradient;
                context.fill();

                context.restore();
            }());
        }
    }

    function renderFrame() {
        // Radar line
        context.save();
        context.beginPath();
        context.moveTo(canvas.width / 2, 10);
        context.lineTo(canvas.width / 2, 210);
        context.closePath();
        context.lineWidth = 1.5;
        context.strokeStyle = 'rgba(100, 140, 120, 0.2)';
        context.stroke();
        context.restore();

        // Radar line
        context.save();
        context.beginPath();
        context.moveTo(10, canvas.height / 2);
        context.lineTo(210, canvas.height / 2);
        context.closePath();
        context.lineWidth = 1.5;
        context.strokeStyle = 'rgba(100, 140, 120, 0.2)';
        context.stroke();
        context.restore();

        // Radar circle
        context.save();
        context.beginPath();
        context.arc(canvas.width / 2, canvas.height / 2, 34, 0, 2 * Math.PI, false);
        context.closePath();
        context.lineWidth = 1.5;
        context.strokeStyle = 'rgba(100, 140, 120, 0.2)';
        context.stroke();
        context.restore();

        // Radar circle
        context.save();
        context.beginPath();
        context.arc(canvas.width / 2, canvas.height / 2, 68, 0, 2 * Math.PI, false);
        context.closePath();
        context.lineWidth = 1.5;
        context.strokeStyle = 'rgba(100, 140, 120, 0.2)';
        context.stroke();
        context.restore();

        // Frame
        context.save();
        context.beginPath();
        context.arc(canvas.width / 2, canvas.height / 2, 100, 0, 2 * Math.PI, false);
        context.closePath();
        context.lineWidth = 1.5;
        context.strokeStyle = 'rgb(140, 190, 160)';
        context.stroke();
        context.restore();

        // Center point
        context.save();
        context.beginPath();
        context.arc(canvas.width / 2, canvas.height / 2, 3, 0, 2 * Math.PI, false);
        context.closePath();
        context.fillStyle = 'rgb(200, 220, 120)';
        context.shadowColor = 'rgb(200, 240, 140)';
        context.shadowBlur = 8;
        context.fill();
        context.restore();
    }

}());