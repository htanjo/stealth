/**
 * Class for Player-Character.
 * @author htanjo
 */
(function () {

    var radius = 25,
        height = 80,
        body = {},
        shadow = {},
        isMoving = false,
        motionTween;

    /**
     * Create a Player-Character.
     * @class Stealth.PC
     * @augments THREE.Object3D
     */
    Stealth.PC = function () {

        var textures = [
                'img/can_00_side.jpg',
                'img/can_00_top.jpg'
            ],
            materials = [];

        THREE.Object3D.call(this);

        body.geometry = new THREE.CylinderGeometry(radius, radius, height, 16);
        body.material = new THREE.MeshFaceMaterial();

        for (var i = 0; i < textures.length; i++) {
            materials.push(new THREE.MeshPhongMaterial({
                map: THREE.ImageUtils.loadTexture(textures[i]),
                ambient: 0x030303,
                specular: 0xcc9999,
                shininess: 10,
                shading: THREE.SmoothShading
            }));
        }
        body.geometry.materials = materials;

        for (var z = 0; z < body.geometry.faces.length; z++) {
            if (body.geometry.faces[z] instanceof THREE.Face3) {
                body.geometry.faceVertexUvs[0][z][0].u = (body.geometry.vertices[body.geometry.faces[z].a].position.x + radius ) / (radius * 2);
                body.geometry.faceVertexUvs[0][z][0].v = (body.geometry.vertices[body.geometry.faces[z].a].position.z + radius ) / (radius * 2);
                body.geometry.faceVertexUvs[0][z][1].u = (body.geometry.vertices[body.geometry.faces[z].b].position.x + radius ) / (radius * 2);
                body.geometry.faceVertexUvs[0][z][1].v = (body.geometry.vertices[body.geometry.faces[z].b].position.z + radius ) / (radius * 2);
                body.geometry.faceVertexUvs[0][z][2].u = (body.geometry.vertices[body.geometry.faces[z].c].position.x + radius ) / (radius * 2);
                body.geometry.faceVertexUvs[0][z][2].v = (body.geometry.vertices[body.geometry.faces[z].c].position.z + radius ) / (radius * 2);
                body.geometry.faces[z].materialIndex = 1;
            }
            else {
                body.geometry.faces[z].materialIndex = 0;
            }
        }

        body.mesh = new THREE.Mesh(body.geometry, body.material);
        body.mesh.position.y = height / 2;

        shadow.geometry = new THREE.PlaneGeometry(120, 120);
        shadow.material = new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('img/shadow_00.png'),
            ambient: 0x030303,
            transparent: true
        });

        shadow.mesh = new THREE.Mesh(shadow.geometry, shadow.material);
        shadow.mesh.position.y = 1;
        shadow.mesh.rotation.x = -90 / 180 * Math.PI;

        this.add(body.mesh);
        this.add(shadow.mesh);

    };

    Stealth.PC.prototype = new THREE.Object3D();
    Stealth.PC.prototype.constructor = Stealth.PC;

    /**
     * Move Player-Character.
     * @param {THREE.Vector3} position
     * @param {THREE.Vector3} velocity
     */
    Stealth.PC.prototype.move = function (position, velocity) {

        var isMoved = isMoving;
        isMoving = velocity.length() ? true : false;

        if (!isMoved && isMoving) {
            startMotion();
        }
        else if (isMoved && !isMoving) {
            stopMotion();
        }

        this.position.set(position.x, this.position.y, position.y);

        function startMotion() {
            var rotation = {
                    x: (Math.random() * 8 - 4) / 180 * Math.PI,
                    y: -Math.atan2(velocity.y, velocity.x),
                    z: (Math.random() * 8 - 4) / 180 * Math.PI
                },
                duration = 120 + Math.random() * 100;

            // Connect -PI with PI for smooth rotation.
            if (body.mesh.rotation.y - rotation.y > Math.PI) {
                body.mesh.rotation.y -= Math.PI * 2;
            }
            else if (body.mesh.rotation.y - rotation.y < -Math.PI) {
                body.mesh.rotation.y += Math.PI * 2;
            }

            motionTween = new TWEEN.Tween(body.mesh.rotation)
                .to(rotation, duration)
                .easing(TWEEN.Easing.Quadratic.EaseInOut)
                .onComplete(startMotion)
                .start();
            new TWEEN.Tween(body.mesh.position)
                .to({x: 0, y: height / 2 + 10, z: 0}, 100)
                .easing(TWEEN.Easing.Cubic.EaseOut)
                .start();
        }

        function stopMotion() {
            motionTween.stop();
            new TWEEN.Tween(body.mesh.rotation)
                .to({x: 0, y: body.mesh.rotation.y, z: 0}, 100)
                .easing(TWEEN.Easing.Cubic.EaseOut)
                .start();
            new TWEEN.Tween(body.mesh.position)
                .to({x: 0, y: height / 2, z: 0}, 100)
                .easing(TWEEN.Easing.Cubic.EaseOut)
                .start();
        }

    }

}());