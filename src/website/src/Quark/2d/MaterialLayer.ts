import * as THREE from 'three'
import { World } from './World'

export class MaterialLayer {

    constructor(public id?: number, public material?: THREE.Material) {

    }

    static async FromJSON(world: World, json: any): Promise < MaterialLayer > {
        return new Promise < MaterialLayer >(resolve => {

            // "id": The layer's id in the material.
            // "material": This is a definition of a Material from THREE.js, however it 
            // differs by the following points: Textures are loaded from the QuarkWorld passed, 
            // and no UUID is associated to the material.

            var loader = new THREE.MaterialLoader()
            loader.setTextures(<any>world.textures)
            
            var layer = new MaterialLayer()
            layer.id = json.id 
            layer.material = loader.parse(json.material)

            resolve(layer)
        })
    }
}