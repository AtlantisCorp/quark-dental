import { QMap } from './QMap'
import * as Interface from '../Player'

export abstract class Player extends Interface.Player {

    public map?: QMap

    constructor(name: string, camera?: THREE.Camera) {
        super(name, camera)
    }
}