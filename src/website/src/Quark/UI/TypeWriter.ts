import { UIComponent } from "./Component"

var TypeWriterHTML = '<p quark-attrib name="text"></p>'

export class TypeWriter extends UIComponent {

    constructor(public text: string, public speed: number, parent?: HTMLElement, withShadowDOM?: boolean) {
        super('TypeWriter', TypeWriterHTML, parent, withShadowDOM)
    }

    start(callback?: () => void): void {
        let element = this.findAttrib('text')?.value
        if (!element) return 

        (function _animate(i: number, text: string, element: HTMLElement, speed: number, callback?: () => void){
            console.log('typewriter: ')
            if (i < text.length) {
                element.innerHTML += text.charAt(i)
                window.setTimeout(_animate, speed, i + 1, text, element, speed, callback)
            } else if (callback) {
                callback()
            }
        })(0, this.text, element, this.speed, callback)
    }
}