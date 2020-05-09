import { Size2d } from './Size2d'
import { Sprite } from './Sprite'
import { Main } from './Main'
import { MaterialLayer } from './MaterialLayer'
import * as THREE from 'three'
import { Player } from './Player'

export interface QMapLocation {
    x: number,
    y: number
}

export class QMap {
    public name: string = ''
    public size: Size2d = { width: 0, height: 0 }
    public spriteSize: Size2d = { width: 0, height: 0 }
    public playerZindex: number = 2
    public sprites: Array < Array < Sprite > > = new Array()
    public spriteGeometry?: THREE.Geometry
    public scene: THREE.Scene = new THREE.Scene()
    public backgrounColor: THREE.Color = new THREE.Color(0X000000)

    private meshGroup: Map < number, THREE.Group > = new Map()

    async makeMeshGroup(sprite: Sprite, x: number, y: number): Promise < THREE.Group > {
        var main = Main.instance as Main

        // (0) Checks if we have a cache entree

        if (this.meshGroup.has(x * this.size.width + y)) {
            return < THREE.Group > this.meshGroup.get(x * this.size.width + y)
        }

        // (1) Creates a THREE Group.

        var result = new THREE.Group()
        result.translateX(x * this.spriteSize.width)
        result.translateY(y * this.spriteSize.height)

        // (2) Finds the material for our sprite.

        var material = await main.world?.findMaterial(sprite.material)

        // (3) Iterates over materials to create a Mesh for each material.

        material?.layers?.forEach((layer: MaterialLayer) => {
            var mesh = new THREE.Mesh(this.spriteGeometry, layer.material)
            result.add(mesh)
        })

        // (4) returns the mesh group (and caches it)

        this.meshGroup.set(x * this.size.width + y, result)

        return result;
    }

    async makeScene() {
        this.scene.background = this.backgrounColor

        for (var x = 0; x < this.size.width; x++) {
            for (var y = 0; y < this.size.height; y++) {
                this.scene.add(await this.makeMeshGroup(this.sprites[x][y], x, y))
            }
        }
    }

    render() {
        var main = Main.instance as Main
        if ((main.player as Player).camera) {
            main.renderer.render(this.scene, < THREE.Camera > (main.player as Player).camera)
        }
    }
}