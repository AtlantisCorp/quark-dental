import * as THREE from 'three'
import { QEvent } from './QEvent'

export interface SpriteCoords {
    topLeft: THREE.Vector2
    topRight: THREE.Vector2
    bottomLeft: THREE.Vector2
    bottomRight: THREE.Vector2
}

export interface Sprite {
    id: number
    texture: string
    coords: SpriteCoords
    events: Array < QEvent >
    zindex: number 
    material: string
}