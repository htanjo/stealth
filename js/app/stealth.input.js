/**
 * Class for Key inputs.
 * @author htanjo
 */
(function () {

    /**
     * Create a key input listener.
     * @class Stealth.Input
     */
    Stealth.Input = function () {

        var self = this;

        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;

        document.addEventListener('keydown', onKeyDown, false);
        document.addEventListener('keyup', onKeyUp, false);

        function onKeyDown(event) {
            switch (event.keyCode) {
                case 38:
                    self.up = true;
                    break;
                case 40:
                    self.down = true;
                    break;
                case 37:
                    self.left = true;
                    break;
                case 39:
                    self.right = true;
                    break;
            }
        }

        function onKeyUp(event) {
            switch (event.keyCode) {
                case 38:
                    self.up = false;
                    break;
                case 40:
                    self.down = false;
                    break;
                case 37:
                    self.left = false;
                    break;
                case 39:
                    self.right = false;
                    break;
            }
        }

    };

}());