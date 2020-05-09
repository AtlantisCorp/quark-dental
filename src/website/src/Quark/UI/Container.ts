import { UIComponent } from "./Component"
import $ from 'jquery'

/** @brief A Generic Container.
 *  For every components that have only one attribute as their 'content' attribute, makes
 *  common code like 'get content' and 'set content' effective.
 */
export class Container extends UIComponent {
    /** @brief Constructs a new Container.
     *  @param name The Container's class name.
     *  @param source The Container's HTML source. This HTML shall contains at least one quark-attrib
     *  with name 'content'.
     *  @param content The Container's content to bind to attribute 'content'.
     */
    constructor(name: string, source: string, content?: any, parent?: HTMLElement, withShadowDOM?: boolean) {
        super(name, source, parent, withShadowDOM)
        this.setAttrib('content', content)
    }

    /** @brief Returns the tab's content. */
    public get content() { return this.findAttrib('content')?.value }

    /** @brief Modifies the tab's content. */
    public set content(value: any) { this.setAttrib('content', value) }

    /** @brief Hides the container. */
    hide(duration?: number, callback?: any) {
        let attrib = this.findAttrib('content')
        if (attrib) $(attrib.element).hide(duration ? duration : 0, callback)
    }

    /** @brief Shows the container. */
    show(duration?: number, callback?: any) {
        let attrib = this.findAttrib('content')
        if (attrib) $(attrib.element).show(duration ? duration : 0, callback)
    }
}

/** @brief Defines a container which handles multiple UIComponent under the 'content' attribute.
 *  Notes the 'content' attribute cannot contain anything else.
 */
export class Collection extends UIComponent {

    /** @brief The children in the container.
     * 
     */
    protected _children: UIComponent[]

    /** @brief Constructs a new Collection.
     *  @param name The name we want for this component.
     *  @param source The HTML source for this component. Default is a single DIV element.
     */
    constructor(name: string = 'Quark.Collection', source: string = '<div quark-attrib name="content"></div>', parent?: HTMLElement, withShadowDOM?: boolean) {
        super(name, source, parent, withShadowDOM)
        this._children = []
    }

    /** @brief Adds a component to this collection.
     * 
     */
    add(rhs: UIComponent) {
        if (this.content && (this.content instanceof HTMLElement)) {
            this._children.push(rhs)
            // this.content.appendChild(rhs.root)
            rhs.parent = this.content
        }

        else console.warn(`${ this.name }: No content.`)
    }

    insert(rhs: UIComponent, before: UIComponent) {
        if (this.content && (this.content instanceof HTMLElement)) {
            let beforeIdx = this._children.findIndex(value => value === before)
            if (beforeIdx > -1) {
                this._children.splice(beforeIdx, 0, rhs)
                this.content.insertBefore(rhs.root, before.root)
            }

            else console.warn(`${ this.name }: Component ${ before.name } not found.`)
        }

        else console.warn(`${ this.name }: No content.`)
    }

    erase(rhs: UIComponent) {
        if (this.content && (this.content instanceof HTMLElement)) {
            let idx = this._children.findIndex(value => value === rhs)
            if (idx > -1) {
                this._children.splice(idx, 1)
                // this.content.removeChild(rhs.root)
                rhs.parent = undefined
            }

            else console.warn(`${ this.name }: Component ${ rhs.name } not found.`)
        }

        else console.warn(`${ this.name }: No content.`)
    }

    clear() {
        if (this.content) this.content.innerHTML = ''
    }

    find(predicate: (lhs: UIComponent) => boolean) {
        return this.components.find(predicate)
    }

    public get content() {
        return this.findAttrib('content')?.element
    }

    public get components() {
        return this._children
    }
}