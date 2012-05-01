/**
 * Class for Camera.
 * @author htanjo
 */
(function () {

    var cameraTween;

    /**
     * Create a camera.
     * @class Stealth.Camera
     * @augments THREE.PerspectiveCamera
     */
    Stealth.Camera = function (fov, aspect, near, far) {

        THREE.PerspectiveCamera.call(this, fov, aspect, near, far);

        this.mode = '';
        this.aim = {
            position: new THREE.Vector3()
        };
        this.changeMode('overlook');

    };

    Stealth.Camera.prototype = new THREE.PerspectiveCamera();
    Stealth.Camera.prototype.constructor = Stealth.Camera;

    /**
     * Move camera.
     * @param {THREE.Object3D} target
     */
    Stealth.Camera.prototype.move = function (target) {

        this.position.x = target.position.x + this.aim.position.x;
        this.position.y = target.position.y + this.aim.position.y;
        this.position.z = target.position.z + this.aim.position.z;

        if (this.position.z > 1390) {
            this.position.z = 1390;
        }

        this.lookAt({x: target.position.x, y: target.position.y + 60, z: target.position.z});

    };

    /**
     * Change camera mode.
     * @param {String} mode
     */
    Stealth.Camera.prototype.changeMode = function (mode) {

        switch (mode) {
            case 'overlook':
                if (this.mode !== 'overlook') {
                    this.mode = mode;
                    if (cameraTween) {
                        cameraTween.stop();
                    }
                    cameraTween = new TWEEN.Tween(this.aim.position)
                        .to({x: 0, y: 500, z: 300}, 350)
                        .easing(TWEEN.Easing.Cubic.EaseOut)
                        .start();
                }
                break;
            case 'behindUp':
                if (this.mode !== 'behindUp') {
                    this.mode = mode;
                    cameraTween = new TWEEN.Tween(this.aim.position)
                        .to({x: 0, y: 90, z: 160}, 350)
                        .easing(TWEEN.Easing.Cubic.EaseOut)
                        .delay(250)
                        .start();
                }
                break;
            case 'behindDown':
                if (this.mode !== 'behindDown') {
                    this.mode = mode;
                    cameraTween = new TWEEN.Tween(this.aim.position)
                        .to({x: 0, y: 90, z: -160}, 350)
                        .easing(TWEEN.Easing.Cubic.EaseOut)
                        .delay(250)
                        .start();
                }
                break;
            case 'behindLeft':
                if (this.mode !== 'behindLeft') {
                    this.mode = mode;
                    cameraTween = new TWEEN.Tween(this.aim.position)
                        .to({x: 160, y: 90, z: 0}, 350)
                        .easing(TWEEN.Easing.Cubic.EaseOut)
                        .delay(250)
                        .start();
                }
                break;
            case 'behindRight':
                if (this.mode !== 'behindRight') {
                    this.mode = mode;
                    cameraTween = new TWEEN.Tween(this.aim.position)
                        .to({x: -160, y: 90, z: 0}, 350)
                        .easing(TWEEN.Easing.Cubic.EaseOut)
                        .delay(250)
                        .start();
                }
                break;
        }

    };

}());