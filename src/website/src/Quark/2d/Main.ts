import { Player } from './Player'
import { World } from './World'
import { UIComponent } from '../UI/Component'
import { QMap } from './QMap'
import { Sprite } from './Sprite'
import * as path from 'path'
import * as THREE from 'three'
import * as Interface from '../Main'

const { remote } = window.require('electron')

export class Main extends Interface.Main {

    public world?: World
    public running: boolean = false

    /** @brief Constructs the Main object.
     *  @param renderer The THREE.Renderer object.
     *  @param canvas The canvas element that hold the renderer. We will use it to track 
     *  size change and other events.
     *  @param container The container to use with the UIComponent. This container will
     *  hold the main component for the UI layer.
     *  @param content The main UI component. You can change the component later with
     *  setContent().
     */
    constructor(public renderer: THREE.Renderer, public canvas: HTMLElement, public container: HTMLElement, public content: UIComponent) {
        super(renderer, canvas, container, content)
    }

    /** @brief Loads a QuarkWorld from a file. 
     *  Generally this file is under the 'assets/World' directory but you can do however you want.
     */
    async loadQuarkWorld(filename: string): Promise < World > {
        return new Promise < World >(async resolve => {
            // First try to locate this file.
            var filepath = path.join('out', filename)
            var json = JSON.parse(remote.getGlobal('global').loadResource(filepath))

            // Now try to load this JSON file
            // A QuarkWorld is a collection of QuarkMap, and an entry point. Simple.

            /*

                QuarkWorld is:

                "name": the world's name.
                "entry": a QuarkWorldEntryPoint structure.
                "textures": the textures used for this world. Loading the textures right now makes us
                more efficient when using it.
                "maps": An array of pair "id":"filepath" for the QuarkMaps.
                "materials": An array of key "id":"material file path" for the QuarkMaterials
             
             */

            var world = new World()
            world.name = json.name

            world.entry = { 
                map: json?.entry?.map, 
                location: { 
                    x: json?.entry?.location?.x, 
                    y: json?.entry?.location?.y
                }
            }

            // Now iterates over the textures.

            for (var id in json.textures) {
                var texture = await this.loadTexture(json.textures[id])
                world.textures.set(id, texture)
            }

            // Loads the maps (well cache it)

            world.mapFiles = json.maps
            world.materialFiles = json.materials 
            this.world = world

            resolve(world)
        })
    }

    async loadQuarkMap(filename: string): Promise < QMap > {
        return new Promise < QMap >(resolve => {
            // First try to locate this file.
            var filepath = path.join('out', filename)
            var json = JSON.parse(remote.getGlobal('global').loadResource(filepath))

            // Loads the QuarkMap from a JSON file: 
            // The QuarkMap has the following structure: 

            /*

            "size": a QuarkSize2d structure to specify the total size (in number of sprites).
            "spriteSize": a QuarkSize2d structure to specify the size of a single sprite.
            "name": the map's name.
            "sprites": an array of QuarkMapSprite.
            "playerZindex": the z index we should use to draw the player's sprite.
            "backgroundColor": A background color for the map's background.
            
            QuarkMapSprite is: 

            "id": a unique identifier for the sprite.
            "texture": the texture id where to look the sprite. This texture is found in QuarkWorld.
            "coords": a QuarkSpriteCoords where to look the texture coordinates.
            "events": a list of events id to look into the QuarkWorld.
            "zindex": an index indicating the z positioning of the sprite.
            "material": the id of material we use to create the sprite.

            QuarkMaterial is an array of THREE.Material to use when drawing a sprite.

            */

            var map = new QMap
            map.name = json.name
            map.size = json.size
            map.spriteSize = json.spriteSize
            map.playerZindex = json.playerZindex
            map.backgrounColor = json.backgrounColor ? json.backgrounColor : new THREE.Color(0)

            // We must set the initial geometry to a plane of size map.spriteSize.

            map.spriteGeometry = new THREE.PlaneGeometry(map.spriteSize.width, map.spriteSize.height)

            // Now load every sprites.

            map.sprites = < Array < Array < Sprite > > > json.sprites

            // and return the map.

            resolve(map)
        })
    }

    async loadTexture(filename: string): Promise < THREE.Texture > {
        return new Promise < THREE.Texture >(resolve => {
            var filepath = path.join('out', filename)
            var loader = new THREE.TextureLoader()
            loader.load(
                filepath,

                function(texture) {
                    resolve(texture)
                },

                undefined,

                function(err) {
                    throw err
                }
            )
        })
    }

    render() {
        if (this.running) {
            (this.player as Player).map?.render()
        }
    }
}