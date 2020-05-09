import * as THREE from 'three'

export abstract class Player {

    /** @brief Constructs a new Player.
     *  @param name The player's name.
     *  @param camera The camera to use with the Player. The camera is optional as it 
     *  may be created later.
     */
    constructor(public name: string, public camera?: THREE.Camera) {

    }

    /** @brief Changes the aspect ratio of the camera.
     * 
     */
    abstract onWindowResize(): void;
}