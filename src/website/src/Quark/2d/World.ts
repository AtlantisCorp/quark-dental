import { QMapLocation, QMap } from './QMap'
import { Material } from './Material'
import { Main } from './Main'
import * as path from 'path'

const { remote } = window.require('electron')

export interface WorldEntryPoint {
    map: number
    location: QMapLocation
}

export class World {

    public entry: WorldEntryPoint
    public maps: Map < number, QMap >
    public name: string = ''
    public textures: Map < string, THREE.Texture > = new Map()
    public mapFiles: Map < number, string > = new Map()
    public materialFiles: Map < string, string > = new Map()
    public materials: Map < string, Material > = new Map()

    constructor() {
        this.entry = < WorldEntryPoint >{}
        this.maps = new Map<number, QMap>()
    }

    async loadQuarkMap(id: number): Promise < QMap > {
        return new Promise < QMap >(async resolve => {
            if (this.maps.has(id)) {
                resolve(this.maps.get(id))
            } else {
                if (this.mapFiles.has(id)) {
                    var filepath = this.mapFiles.get(id)
                    var map = await (Main.instance as Main).loadQuarkMap(filepath ? filepath : '')
                    this.maps.set(id, < QMap > map)
                    resolve(map)
                } else {
                    throw 'No QuarkMap with id ' + id + ' in QuarkWorld ' + this.name 
                }
            }
        })
    }

    async loadEntryMap(): Promise < QMap > {
        return new Promise < QMap >(async resolve => {
            await this.loadQuarkMap(this.entry.map)
        })
    }

    async findMaterial(id: string): Promise < Material | undefined > {
        return new Promise < Material >(async resolve => {

            // (0) Checks if a material is available.

            if (!this.materialFiles.has(id)) {
                resolve(undefined)
            }

            // (1) Tries to load the material from its file (.QuarkMaterial)

            var filepath = path.join('out', < string > this.materialFiles.get(id))
            var json = JSON.parse(remote.getGlobal('global').loadResource(filepath))

            // (2) Now, loads the QuarkMaterial.
            
            resolve(await Material.FromJSON(this, json))
        })
    }
}