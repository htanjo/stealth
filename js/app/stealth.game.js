/**
 * Class for Game.
 * @author htanjo
 */
(function () {

    var stageData,
        camera,
        scene,
        renderer,
        stage,
        pc,
        enemies = [],
        input = new Stealth.Input(),
        position = new THREE.Vector2(0, 0),
        velocity = new THREE.Vector2(0, 0),
        mapOffset,
        mapSize,
        block,
        collision,
        radar;

    /**
     * Create a game content.
     * @class Stealth.Game
     * @param {Object} data Game stage data.
     */
    Stealth.Game = function (data) {

        stageData = data.stage;

        mapOffset = new THREE.Vector2(stageData.setting.mapOffset.x, stageData.setting.mapOffset.y);
        mapSize = new THREE.Vector2(stageData.setting.mapSize.x, stageData.setting.mapSize.y);
        block = stageData.map.block;
        collision = stageData.map.collision;
        position.set(stageData.setting.startPosition.x, stageData.setting.startPosition.y);

        initialize3D();
        initializeRadar();
        if (Stealth.debug) {
            initializeStats();
        }

    };

    /**
     * Start game.
     */
    Stealth.Game.prototype.start = function () {

        onEnterFrame();

    };

    /**
     * onEnterFrame event shim.
     */
    function onEnterFrame() {
        requestAnimationFrame(onEnterFrame);
        movePC();
        moveEnemy();
        render();
    }

    /**
     * Initialize 3D.
     */
    function initialize3D() {

        var ambientLight,
            directionalLight,
            directionalLight1,
            pointLight,
            pointLight1,
            i;

        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x001111, 0.0013);

        camera = new Stealth.Camera(55, window.innerWidth / window.innerHeight, 10, 10000);
        scene.add(camera);

        stage = new Stealth.Stage(mapOffset, mapSize, block);
        scene.add(stage);

        pc = new Stealth.PC();
        pc.position.x = position.x;
        pc.position.z = position.y;
        scene.add(pc);

        for (i = 0; i < stageData.enemy.length; i++) {
            enemies[i] = new Stealth.Enemy(stageData.enemy[i]);
            scene.add(enemies[i]);
        }

        ambientLight = new THREE.AmbientLight(0x554433);
        scene.add(ambientLight);

        directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
        directionalLight.position.set(0.8, 0.8, 0.3).normalize();
        scene.add(directionalLight);

        directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.2);
        directionalLight1.position.set(-0.8, 0.8, -0.3).normalize();
        scene.add(directionalLight1);

        pointLight = new THREE.PointLight(0xff9944, 1.5, 600);
        pointLight.position.set(750, 300, 1100);
        scene.add(pointLight);

        pointLight1 = new THREE.PointLight(0xff9944, 1.5, 600);
        pointLight1.position.set(400, 300, 200);
        scene.add(pointLight1);

        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(window.innerWidth, window.innerHeight);

        document.body.appendChild(renderer.domElement);

        window.addEventListener('resize', onWindowResize, false);

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }

    //var flag = false;
    /**
     * Rendering.
     */
    function render() {

        /*
         if (!flag) {
         enemies[0].position.z += 2;
         if (enemies[0].position.z > 500) {
         flag = true;
         enemies[0].rotation.y = Math.PI / 2;
         }
         }
         else {
         enemies[0].position.z -= 2;
         if (enemies[0].position.z <= 200) {
         flag = false;
         enemies[0].rotation.y = -Math.PI / 2;
         }
         }
         enemies[1].rotation.y += 1 / 180 * Math.PI;
         */

        renderer.render(scene, camera);
        radar.render(pc, enemies);

    }

    /**
     * Move Player-Character.
     */
    function movePC() {

        var cameraMode = 'overlook',
            fit;

        setVelocity(input);
        fit = reviseVelocity(position);

        if (fit.top) {
            cameraMode = 'behindUp';
        }
        else if (fit.bottom) {
            cameraMode = 'behindDown';
        }
        else if (fit.left) {
            cameraMode = 'behindLeft';
        }
        else if (fit.right) {
            cameraMode = 'behindRight';
        }

        position.addSelf(velocity);
        pc.move(position, velocity);
        camera.changeMode(cameraMode);
        camera.move(pc);

    }

    /**
     * Move Enemies.
     */
    function moveEnemy() {

        var i;

        for (i = 0; i < enemies.length; i++) {
            enemies[i].move();
        }

    }

    /**
     * Set velocity by key inputs.
     * @param {Stealth.Input} input
     */
    function setVelocity(input) {

        var minSpeed = 0.18,
            maxSpeed = 4.5,
            acceleration = new THREE.Vector3(0, 0),
            accelerationLength = 0.3,
            friction = velocity.clone().setLength(-0.18);

        if (input.up) {
            acceleration.y--;
        }
        if (input.down) {
            acceleration.y++;
        }
        if (input.left) {
            acceleration.x--;
        }
        if (input.right) {
            acceleration.x++;
        }
        if (acceleration.length()) {
            acceleration.setLength(accelerationLength);
        }

        // Fix too large or small velocity.
        velocity.addSelf(acceleration).addSelf(friction);
        if (velocity.length() > maxSpeed) {
            velocity.setLength(maxSpeed);
        }
        else if (velocity.length() < minSpeed) {
            velocity.setLength(0);
        }

    }

    /**
     * Revise velocity by collision.
     * @param {THREE.Vector2} position
     */
    function reviseVelocity(position) {

        var minSpeed = 0.18,
            radius = {x: 25, y: 25},
            direction = Math.atan2(velocity.y, velocity.x),
            targetTop = position.y + velocity.y - radius.y,
            targetBottom = position.y + velocity.y + radius.y - 0.01,
            targetLeft = position.x + velocity.x - radius.x,
            targetRight = position.x + velocity.x + radius.x - 0.01,
            fit = {top: false, bottom: false, left: false, right: false};

        if (velocity.length() > 0) {

            // Moving to top or bottom, check Y first.
            if (1 / 4 * Math.PI <= Math.abs(direction) && Math.abs(direction) < 3 / 4 * Math.PI) {
                // Moving to top
                if (velocity.y < 0) {
                    if (getMapState(position.x - radius.x, position.y + velocity.y - radius.y) !== 0 ||
                        getMapState(position.x + radius.x - 0.01, position.y + velocity.y - radius.y) !== 0) {
                        limitTop();
                    }
                }
                // Moving to bottom
                else {
                    if (getMapState(position.x - radius.x, position.y + velocity.y + radius.y - 0.01) !== 0 ||
                        getMapState(position.x + radius.x - 0.01, position.y + velocity.y + radius.y - 0.01) !== 0) {
                        limitBottom();
                    }
                }
                // Moving to left
                if (velocity.x < 0) {
                    if (getMapState(position.x + velocity.x - radius.x, position.y + velocity.y - radius.y) !== 0 ||
                        getMapState(position.x + velocity.x - radius.x, position.y + velocity.y + radius.y - 0.01) !== 0) {
                        limitLeft();
                    }
                }
                // Moving to right
                else if (velocity.x > 0) {
                    if (getMapState(position.x + velocity.x + radius.x - 0.01, position.y + velocity.y - radius.y) !== 0 ||
                        getMapState(position.x + velocity.x + radius.x - 0.01, position.y + velocity.y + radius.y - 0.01) !== 0) {
                        limitRight();
                    }
                }
            }

            // Moving to left or right, check X first.
            else {
                // Moving to left
                if (velocity.x < 0) {
                    if (getMapState(position.x + velocity.x - radius.x, position.y - radius.y) !== 0 ||
                        getMapState(position.x + velocity.x - radius.x, position.y + radius.y - 0.01) !== 0) {
                        limitLeft();
                    }
                }
                // Moving to right
                else {
                    if (getMapState(position.x + velocity.x + radius.x - 0.01, position.y - radius.y) !== 0 ||
                        getMapState(position.x + velocity.x + radius.x - 0.01, position.y + radius.y - 0.01) !== 0) {
                        limitRight();
                    }
                }
                // Moving to top
                if (velocity.y < 0) {
                    if (getMapState(position.x + velocity.x - radius.x, position.y + velocity.y - radius.y) !== 0 ||
                        getMapState(position.x + velocity.x + radius.x - 0.01, position.y + velocity.y - radius.y) !== 0) {
                        limitTop();
                    }
                }
                // Moving to bottom
                else if (velocity.y > 0) {
                    if (getMapState(position.x + velocity.x - radius.x, position.y + velocity.y + radius.y - 0.01) !== 0 ||
                        getMapState(position.x + velocity.x + radius.x - 0.01, position.y + velocity.y + radius.y - 0.01) !== 0) {
                        limitBottom();
                    }
                }
            }

            // Floor too small velocity.
            if (velocity.length() < minSpeed) {
                velocity.setLength(0);
            }
        }

        return fit;

        function limitTop() {
            velocity.y = (Math.floor(targetTop / 100) + 1) * 100 + radius.y - position.y;
            if (getMapState(position.x, position.y - 100) === 2) {
                fit.top = true;
            }
        }

        function limitBottom() {
            velocity.y = Math.floor(targetBottom / 100) * 100 - radius.y - position.y;
            if (getMapState(position.x, position.y + 100) === 2) {
                fit.bottom = true;
            }
        }

        function limitLeft() {
            velocity.x = (Math.floor(targetLeft / 100) + 1) * 100 + radius.x - position.x;
            if (getMapState(position.x - 100, position.y) === 2) {
                fit.left = true;
            }
        }

        function limitRight() {
            velocity.x = Math.floor(targetRight / 100) * 100 - radius.x - position.x;
            if (getMapState(position.x + 100, position.y) === 2) {
                fit.right = true;
            }
        }

    }

    /**
     * Get map state from coordinates
     * @param {Number} x
     * @param {Number} y
     * @returns {Number} State.
     */
    function getMapState(x, y) {

        return collision[Math.floor(y / 100)][Math.floor(x / 100)];

    }

    /**
     * Initialize radar.
     */
    function initializeRadar() {

        radar = new Stealth.Radar(block);
        document.body.appendChild(radar.getDomElement());

    }

    /**
     * Initialize debug stats.
     */
    function initializeStats() {

        var stats = new Stats();

        stats.getDomElement().style.position = 'absolute';
        stats.getDomElement().style.left = '0px';
        stats.getDomElement().style.top = '0px';

        document.body.appendChild(stats.getDomElement());

        setInterval(function () {
            stats.update();
        }, 1000 / 60);

    }

}());