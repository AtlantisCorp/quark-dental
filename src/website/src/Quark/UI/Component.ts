import * as path from 'path'
import $ from 'jquery'

const { remote } = window.require('electron')
const EJS = require('ejs-html')

/** @brief Defines an Attribute in a UIComponent.
 * 
 */
export class Attribute {
    /** @brief Constructs a new Attribute.
     *  @param name The Attribute's name.
     *  @param element The Attribute's HTMLElement.
     *  @param value The initial value. While this parameter is of 'any' type, if this is a 
     *  UIComponent the value will be computed through the render() function.
     */
    constructor(private _name: string, private _element: HTMLElement, private _value: any) {
        if (_value instanceof UIComponent) {
            // _element.appendChild(_value.root)
            _value.parent = _element
        }
        else if (_value instanceof HTMLElement) _element.appendChild(_value)
        else _element.innerHTML = String(_value)
    }

    /** @brief Returns the Attribute's name. 
     * 
     */
    public get name() { return this._name }

    /** @brief Returns the Attribute's element.
     * 
     */
    public get element() { return this._element }

    /** @brief Returns the Attribute's value.
     * 
     */
    public get value() { return this._value }

    /** @brief Modifies the Attribute's value.
     * 
     */
    public set value(value: any) {
        // if (this._value instanceof UIComponent) this._element.removeChild(this._value.root)
        if (this._value instanceof HTMLElement) this._element.removeChild(this._value)

        if (value instanceof UIComponent) {
            // _element.appendChild(_value.root)
            value.parent = this._element
        }
        else if (value instanceof HTMLElement) this._element.appendChild(value) 
        else this._element.innerHTML = String(value ? value : '')

        this._value = value
    }
}

/** @brief A Component for the Quark UI.
 * 
 *  Creates a new Component simply by using new Component(template, args). The component will look for your
 *  file in the directory. The path looked for in loadUIResource is '/out/website/html'.
 * 
 *  ## 1 Template Management
 * 
 *  The component shall loads its template from an HTML source string. This HTML may have one or more 
 *  elements. The component creates a 'template' element along with a ShadowDOM, and append all elements
 *  from the template in this ShadowDOM.
 * 
 *  ```html
 *  <style> /* Some style here. </style>
 *  <ul>
 *    <li>Item 1</li>
 *    <li>Item 2</li>
 *  </ul>
 *  ```
 * 
 *  This example will be translated to:
 * 
 *  ```html
 *  <template>
 *    # Shadow DOM Root
 *    <style> /* Some style here. </style>
 *    <ul>
 *      <li>Item 1</li>
 *      <li>Item 2</li>
 *    </ul>
 *  <template>
 *  ```
 * 
 *  ## 2 Attributes management 
 * 
 *  Attributes are registered directly from the HTML source: all elements with the attribute 'quark-attrib'
 *  is considered as a Quark Attribute. To be validated, an element shall have a 'name' attribute to be
 *  modified by the Quark Component. You can specify a default initial value with the 'value' attribute.
 *  All Attributes can hold any value that can be translated to a string: even a UIComponent with the render()
 *  function. When you want to set an Attribute, use setAttrib(name, value). As all UIComponent lies inside
 *  a 'template' element, the UIComponent doesn't reload it when reloading itself and thus, we don't need
 *  to track for the component's changes.
 *  
 *  ## 3 Reloading the component
 * 
 *  When you change something to the template of the component, always call reload(). This will cause the 
 *  reloading of the HTML template. The attributes doesn't need to be reloaded: each attribute template will
 *  be set for each attribute.
 * 
 *  ## About HTMLElement and how i chose to handle this
 *  
 *  Unfortunately, we can extend from HTMLElement and then call new on our component. In order to do this
 *  we have to register the component as a custom element. So we have two choice: we can extend from 
 *  HTMLElement and register all our components with customElements.define(), but the constructor must 
 *  be default constructed, or we can create a new element that has no effect.
 *  If we choose to create a 'template' element, it will maintain a copy of the component but the component
 *  itself will be elsewhere. We don't want to clone our element structure.
 *  We thus use a DIV element as the root element of the component.
 * 
 */
export class UIComponent {

    /** @brief The component's name. Ideally the class name.
     * 
     */
    protected _name: string 

    /** @brief Returns the component's name.
     * 
     */
    public get name() { return this._name }

    /** @brief The root DIV element.
     * 
     */
    private _root: HTMLElement

    /** @brief Returns this element.
     * 
     */
    public get root() { return this._root }

    /** @brief The ShadowDOM associated to this component's root element.
     * 
     */
    private _shadow?: ShadowRoot

    /** @brief Returns the Shadow DOM for this element.
     * 
     */
    public get shadow() { return this._shadow }

    /** @brief Boolean true if we want to use a ShadowDOM, false otherwise.
     * 
     */
    protected withShadowDOM: boolean

    /** @brief Returns the root or the shadow DOM depending on the value of withShadowDOM.
     * 
     */
    public get shadowOrRoot(): ShadowRoot | HTMLElement { 
        if (this.withShadowDOM) {
            if (!this._shadow) {
                this._shadow = this._root.attachShadow({ mode:'open' })
            }
            return this._shadow
        } else {
            return this.root
        }
    }

    /** @brief The source for this component.
     *  Any change in the source HTML must be followed with a call to reload().
     */
    public source: string 

    /** @brief The attributes for our component.
     * 
     */
    protected _attributes: Array < Attribute >

    /** @brief Constructs a new UIComponent.
     *  @param name The component's name.
     *  @param source The component's HTML source.
     *  @param parent The parent of this component. It effectively adds this component to the parent,
     *  you don't need to call addChild().
     *  @param withShadowDOM Boolean true if you want a specific ShadowDOM for your element.
     */
    constructor(name: string, source: string | HTMLElement, parent?: HTMLElement, withShadowDOM?: boolean) {
        this._name = name 
        this.source = source instanceof HTMLElement ? source.outerHTML : source
        this._attributes = new Array()
        this.withShadowDOM = withShadowDOM === undefined ? false : withShadowDOM
        this._root = this.withShadowDOM ? document.createElement('div') : document.createElement('slot')

        if (parent)
            this.parent = parent
        
        this.reload()
    }

    /** @brief Reloads the component.
     *  
     */
    reload(args?: any) {

        // Save the current attributes. We will try to rebind them after rendering.

        let attributes = this._attributes

        // Renders the component.

        this.render()

        // Now tries to rebind the attributes.

        attributes.forEach(attrib => this.setAttrib(attrib.name, attrib.value))
    }

    /** @brief Renders the HTML source.
     *  The source is rendered with EJS. This function uses data() to pass to EJS the HTML parameters
     *  and successfully compiling the template. Then, it looks for attributes and compile them.
     */
    render() {

        // Renders the HTML source.

        this.shadowOrRoot.innerHTML = EJS.render(this.source, this.data())
        this._template = [...this.shadowOrRoot.children] as HTMLElement[]
        if (!this._template.length) this._template_innerText = this.shadowOrRoot.innerHTML

        // Looks for attributes in the new source.

        let attributes = this.shadowOrRoot.querySelectorAll('[quark-attrib]')

        attributes.forEach(value => {
            let attribName = value.getAttribute('name')

            if  (!attribName) {
                console.warn(`HTMLElement ${ value.tagName } is marked with quark-attrib but has no name attrib.`)
                return
            }

            let attrib = new Attribute(attribName, value as HTMLElement, value.getAttribute('value'))
            this._attributes.push(attrib)
        })

        // Now we can return. We have rendered the HTML source and all attributes.

        /*

        // Renders the HTML source.

        let fragment = document.createDocumentFragment()
        let vroot = fragment.appendChild(document.createElement('main'))
        
        vroot.innerHTML = EJS.render(this.source, this.data())

        this._template = [...vroot.children] as HTMLElement[]
        if (!this._template.length) this._template_innerText = vroot.innerHTML

        // Looks for attributes in the new source.

        let attributes = vroot.querySelectorAll('[quark-attrib]')

        attributes.forEach(value => {
            let attribName = value.getAttribute('name')

            if  (!attribName) {
                console.warn(`HTMLElement ${ value.tagName } is marked with quark-attrib but has no name attrib.`)
                return
            }

            let attrib = new Attribute(attribName, value as HTMLElement, value.getAttribute('value'))
            this._attributes.push(attrib)
        })

        // Now we can return. We have rendered the HTML source and all attributes.

        */
    }

    /** @brief Returns a new initialization of the data for this component.
     * 
     */
    data(): any {
        return {}
    }

    /** @brief Hides the whole element.
     * 
     */
    hide(duration: number = 0, callback?: any) {
        $(this.root).hide(duration, callback)
    }

    /** @brief Shows the whole element.
     * 
     */
    show(duration: number = 0, callback?: any) {
        $(this.root).show(duration, callback)
    }

    /** @brief Equivalent to querySelector but for the shadow DOM in this component.
     * 
     */
    select(selector: string): HTMLElement | null {
        return < HTMLElement | null > this.shadowOrRoot.querySelector(selector)
    }

    /** @brief Sets an Attribute in this component.
     *  If the attribute doesn't exists, nothing is done but a warning is emitted.
     *  @param name The attribute name (see the element in your HTML source with quark-attrib).
     *  @param value The value for the attribute. If this value is a UIComponent, the root element
     *  is used to bind this element as a child to the attribute's element.
     */
    setAttrib(name: string, value: any) {

        let attrib = this.findAttrib(name)

        if (!attrib) {
            console.warn(`Attribute ${ name } doesn't exist in component ${ this.name }.`)
            return 
        }

        attrib.value = value
    }

    /** @brief Returns the Attribute for given name, or undefined if no Attribute were found.
     * 
     */
    findAttrib(name: string): Attribute | undefined {
        return this._attributes.find(value => value.name === name)
    }

    /** @brief Adds a stylesheet from a CSS source.
     *  @param name The name of the stylesheet for this component.
     *  @param source A CSS string we encapsulates inside a <style> element.
     */
    stylize(name: string, source: string) {
        let CSSEl = this.shadowOrRoot.querySelector(`style[name="${ name }"]`)

        if (!CSSEl) {
            CSSEl = document.createElement('style')
            CSSEl.innerHTML = source
            this.shadowOrRoot.prepend(CSSEl)
        } else {
            CSSEl.innerHTML = source
        }
    }

    /** @brief Adds an event listener to the root div element of this component.
     * 
     */
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions | undefined) {
        this.root.addEventListener(type, listener, options)
        this._listeners.set(type, { listener: listener, options: options })
    }

    /** @brief Removes an event listener from the root div element of this component.
     * 
     */
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions | undefined) {
        this.root.removeEventListener(type, listener, options)
        this._listeners.delete(type)
    }

    /** @brief Dispatches an event from the root DIV element.
     * 
     */
    dispatchEvent(event: Event) {
        this.root.dispatchEvent(event)
    }

    /** @brief Returns the source from an EJS file.
     * 
     */
    static SourceFromFile(filename: string): string {
        return remote.getGlobal('global').loadResource(filename)
    }

    /** @brief Returns the Source from the default HTML Resources Path.
     * 
     */
    static HTMLFromFile(filename: string): string {
        return this.SourceFromFile(path.join(remote.getGlobal('global').HTMLResourcesPath, filename))
    }

    private _template: HTMLElement[] = new Array()
    private _template_innerText: string = ''

    private _parent?: HTMLElement 

    public get parent() {
        return this._parent
    }

    public set parent(val: HTMLElement | undefined) {
        if (this._parent) {
            this._template.forEach(element => element.remove())
            this._listeners.forEach((value, key) => this.root.removeEventListener(key, value.listener, value.options))
        }

        if (val) {
            this._root = val
            this._listeners.forEach((value, key) => this._root.addEventListener(key, value.listener, value.options))

            if (this.withShadowDOM) {
                this._shadow = val?.attachShadow({ mode: 'open' })
            }

        } else {
            this._root = document.createElement('div')
            if (this.withShadowDOM) this._shadow = this._root.attachShadow({ mode: 'open' })
        }

        if (this._template.length) this.shadowOrRoot.append(...this._template)
        else this.shadowOrRoot.innerHTML = this._template_innerText

        this._parent = val
    }

    private _listeners: Map < string, { listener: EventListenerOrEventListenerObject, options: any } > = new Map()
}

/** @brief Returns true if the passed arg is a UIComponent. */
export function isComponent(rhs?: any): rhs is UIComponent {

    if (!rhs) return false

    return (rhs as UIComponent).shadowOrRoot !== undefined;
}