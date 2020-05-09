import { MaterialLayer } from './MaterialLayer'
import { World } from './World'

export class Material {

    constructor(public name?: string, public layers?: Array < MaterialLayer >) {

    }

    static async FromJSON(world: World, json: any): Promise < Material > {
        return new Promise < Material >(resolve => {

            // "name": The material's name (not the ID, the ID is specific to a QuarkWorld)
            // "layers": The material's layer. See QuarkMaterialLayer.

            var material = new Material()
            material.name = json.name 
            material.layers = new Array()

            json.layers?.forEach(async (el: any) => {
                material.layers?.push(await MaterialLayer.FromJSON(world, el))
            })

            resolve(material)
        })
    }
}