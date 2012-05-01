/**
 * Class for Enemy.
 * @author htanjo
 */
(function () {

    var body = {},
        shadow = {},
        action = {},
        queue = {};

    /**
     * Create a Enemy.
     * @class Stealth.Enemy
     * @param {Object} data
     * @augments THREE.Object3D
     */
    Stealth.Enemy = function (data) {

        THREE.Object3D.call(this);

        var self = this;
        var loader = new THREE.JSONLoader();
        loader.load(
            'data/enemy.js',
            function (geo) {
                //geo.computeVertexNormals();
                for (var i = 0; i < geo.materials.length; i++) {
                    //geo.materials[i].morphTargets = true;
                    geo.materials[i].color.setHex(0xffffff);
                    geo.materials[i].ambient.setHex(0xffffff);
                }
                var mat = new THREE.MeshFaceMaterial();
                body.mesh = new THREE.Mesh(geo, mat);
                body.mesh.scale.set(1.5, 1.5, 1.5);
                body.mesh.rotation.y = 90 / 180 * Math.PI;
                self.add(body.mesh);
            }
        );

        shadow.geometry = new THREE.PlaneGeometry(120, 120);
        shadow.material = new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('img/shadow_00.png'),
            ambient: 0x030303,
            transparent: true,
            opacity: 0.7
        });

        shadow.mesh = new THREE.Mesh(shadow.geometry, shadow.material);
        shadow.mesh.position.y = 2;
        shadow.mesh.rotation.x = -90 / 180 * Math.PI;

        this.add(shadow.mesh);

        this.setPosition(data.position.x, data.position.y);
        this.setRotation(data.rotation);
        this.setAction(data.action);

    };

    Stealth.Enemy.prototype = new THREE.Object3D();
    Stealth.Enemy.prototype.constructor = Stealth.Enemy;

    /**
     * Set enemy position.
     * @param x
     * @param y
     */
    Stealth.Enemy.prototype.setPosition = function (x, y) {
        this.position.x = x;
        this.position.z = y;
    };

    /**
     * Get enemy position.
     * @return {Object}
     */
    Stealth.Enemy.prototype.getPosition = function () {
        return {x: this.position.x, y: this.position.z};
    };

    /**
     * Set enemy rotation.
     * @param degree
     */
    Stealth.Enemy.prototype.setRotation = function (degree) {
        this.rotation.y = -degree / 180 * Math.PI;
    };

    /**
     * Get enemy rotation.
     * @return {Number}
     */
    Stealth.Enemy.prototype.getPosition = function () {
        return -this.rotation.y / Math.PI * 180;
    };

    /**
     * Set action pattern action.
     * @param queue
     */
    Stealth.Enemy.prototype.setAction = function (queue) {
        action = queue;
    };

    /**
     * Act.
     */
    Stealth.Enemy.prototype.move = function () {

        var moveSpeed = 2,
            rotateSpeed = 2;

        //this.setPosition(this.position.x, this.position.z + 1);

    };

}());