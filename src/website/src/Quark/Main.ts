import { Player } from './Player'
import { UIComponent } from './UI/Component'
import * as THREE from 'three'

export abstract class Main {
    /** @brief The global instance for the Main object.
     *  Instantiate this object with either a Q2D.Main or a Q3D.Main object.
     */
    public static instance?: Main

    /** @brief The Player for the Main instance.
     *  Basically it can be a Q2D.Player or a Q3D.Player object. 
     */
    public player?: Player

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
        canvas.appendChild(renderer.domElement)
        container.appendChild(content.root)

        window.addEventListener('resize', this.onWindowResize.bind(this))
    }

    /** @brief Changes the UIComponent that serves the UI layer.
     *  @param rhs The component to set. 
     *  The old component is removed from the DOM tree before adding this one. Please note
     *  that the component is added to the end of the container.
     */
    setContent(rhs: UIComponent) {
        if (this.content) {
            this.container.removeChild(this.content.root)
        }

        this.content = rhs 
        this.container.appendChild(rhs.root)
    }

    /** @brief Updates the renderer size and, optionally, the player's camera aspect.
     * 
     */
    onWindowResize() {
        console.log('resizing to ' + 
        this.canvas.offsetWidth + '/' + 
        this.canvas.offsetHeight )

        this.renderer.setSize( this.canvas.offsetWidth, this.canvas.offsetHeight )
        this.player?.onWindowResize()
    }

    /** @brief Changes the UIComponent with a transition.
     * 
     */
    transitionUI(content: UIComponent, duration: number = 0, callback?: () => void) {
        this.content.hide(duration, () => {
            content.hide(0, () => {
                this.setContent(content)
                this.content.show(duration, callback)
            })
        })
    }
}