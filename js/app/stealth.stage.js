/**
 * Class for Stage.
 * @author htanjo
 */
(function () {

    /**
     * Create a stage.
     * @class Stealth.Stage
     * @augments THREE.Object3D
     */
    Stealth.Stage = function (mapOffset, mapSize, blockMap) {

        var chipSize = 100,
            groundTexture = 'img/ground_00_top.jpg',
            blockTextures = [
                'img/block_00_side.jpg',
                'img/block_00_side.jpg',
                'img/block_00_top.jpg',
                'img/block_00_top.jpg',
                'img/block_00_side.jpg',
                'img/block_00_side.jpg'
            ];

        this.setGround(blockMap, mapOffset, mapSize, chipSize, groundTexture);
        this.setMapChips(blockMap, chipSize, blockTextures);

    };

    Stealth.Stage.prototype = new THREE.Object3D();
    Stealth.Stage.prototype.constructor = Stealth.Stage;

    /**
     * Set map-chips in array.
     * @param {Array} map Arrangement map of 2x2 array.
     * @param {Number} chipSize Size of map chip.
     * @param {Array} textures Array of texture file path.
     */
    Stealth.Stage.prototype.setMapChips = function (map, chipSize, textures) {

        var blocks = [],
            block = {},
            materials = [],
            i, j;

        for (i = 0; i < textures.length; i++) {
            materials.push(new THREE.MeshPhongMaterial({
                map: THREE.ImageUtils.loadTexture(textures[i]),
                ambient: 0x030303,
                specular: 0xcccc66,
                shininess: 15
            }));
        }

        block.size = new THREE.Vector3(chipSize, chipSize * 2, chipSize);
        block.geometry = new THREE.CubeGeometry(block.size.x, block.size.y, block.size.z, 1, 1, 1, materials);
        block.material = new THREE.MeshFaceMaterial();

        for (i = 0; i < map.length; i++) {
            blocks[i] = [];
            for (j = 0; j < map[i].length; j++) {
                if (map[i][j] !== 0) {
                    blocks[i][j] = {};

                    blocks[i][j].mesh = new THREE.Mesh(block.geometry, block.material);
                    blocks[i][j].mesh.position.x = block.size.x / 2 + block.size.x * j;
                    blocks[i][j].mesh.position.y = block.size.y / 2;
                    blocks[i][j].mesh.position.z = block.size.z / 2 + block.size.z * i;

                    this.add(blocks[i][j].mesh);
                }
            }
        }

    };

    /**
     * Set ground.
     * @param {THREE.Vector2} offset Offset position of ground.
     * @param {THREE.Vector2} size Size of ground.
     * @param {Number} chipSize Size of map chip.
     * @param {Array} texture Array of texture file path.
     */
    Stealth.Stage.prototype.setGround = function (map, offset, size, chipSize, texture) {

        var self = this;
        var ground = {},
            fullSize = new THREE.Vector2(size.x + chipSize * 2, size.y + chipSize * 2),
            i, j;

        ground.canvas = document.createElement('canvas');
        ground.canvas.width = fullSize.x;
        ground.canvas.height = fullSize.y;
        ground.ctx = ground.canvas.getContext('2d');

        ground.image = new Image();
        ground.image.src = texture;
        ground.image.onload = function () {

            for (i = 0; i < fullSize.x / chipSize; i++) {
                for (j = 0; j < fullSize.y / chipSize; j++) {
                    ground.ctx.drawImage(ground.image, 0, 0, chipSize, chipSize, i * chipSize, j * chipSize, chipSize, chipSize)
                }
            }
            for (i = 0; i < fullSize.x / chipSize; i++) {
                for (j = 0; j < fullSize.y / chipSize; j++) {
                    if (map[j][i] !== 0) {
                        ground.ctx.rect(i * chipSize, j * chipSize, chipSize, chipSize);
                        ground.ctx.fillStyle = '#000000';
                    }
                }
            }
            ground.ctx.shadowColor = '#000000';
            ground.ctx.shadowBlur = 80;
            ground.ctx.fill();
            ground.ctx.fill();

            ground.texture = new THREE.Texture(ground.canvas);
            ground.texture.needsUpdate = true;

            ground.geometry = new THREE.PlaneGeometry(fullSize.x, fullSize.y, fullSize.x / chipSize, fullSize.y / chipSize);
            ground.material = new THREE.MeshLambertMaterial({
                map: ground.texture,
                ambient: 0x030303
            });

            ground.mesh = new THREE.Mesh(ground.geometry, ground.material);
            ground.mesh.position.set(size.x / 2 + offset.x, 0, size.y / 2 + offset.y);
            ground.mesh.rotation.x = -90 / 180 * Math.PI;

            var walls = {
                nx: {},
                px: {},
                nz: {},
                pz: {}
            };
            walls.nx.geometry = new THREE.CubeGeometry(size.x, 1000, 20, size.x / chipSize, 1000 / chipSize, 1);
            walls.px.geometry = new THREE.CubeGeometry(size.x, 1000, 20, size.x / chipSize, 1000 / chipSize, 1);
            walls.nz.geometry = new THREE.CubeGeometry(20, 1000, size.y, 1, 1000 / chipSize, size.y / chipSize);
            walls.pz.geometry = new THREE.CubeGeometry(20, 1000, size.y, 1, 1000 / chipSize, size.y / chipSize);
            walls.nx.material = new THREE.MeshLambertMaterial({
                map: THREE.ImageUtils.loadTexture('img/wall_00_side.jpg'),
                ambient: 0x030303
            });
            walls.nx.mesh = new THREE.Mesh(walls.nx.geometry, walls.nx.material);
            walls.px.mesh = new THREE.Mesh(walls.px.geometry, walls.nx.material);
            walls.nz.mesh = new THREE.Mesh(walls.nz.geometry, walls.nx.material);
            walls.pz.mesh = new THREE.Mesh(walls.pz.geometry, walls.nx.material);
            walls.nx.mesh.position.set(size.x / 2 + offset.x, 1000 / 2, offset.y - 20 / 2);
            walls.px.mesh.position.set(size.x / 2 + offset.x, 1000 / 2, size.y + offset.y + 20 / 2);
            walls.nz.mesh.position.set(offset.x - 20 / 2, 1000 / 2, size.y / 2 + offset.y);
            walls.pz.mesh.position.set(size.x + offset.x + 20 / 2, 1000 / 2, size.y / 2 + offset.y);

            self.add(ground.mesh);
            self.add(walls.nx.mesh);
            self.add(walls.px.mesh);
            self.add(walls.nz.mesh);
            self.add(walls.pz.mesh);
        };
    };

}());