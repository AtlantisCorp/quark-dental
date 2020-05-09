import { Container } from "./Container";

/** @brief The default HTML for TabBarElement. */
var TabBarElementHTML = `
<li quark-attrib name="content">
</li>
`

/** @brief Represents an element in a TabBar.
 * 
 */
export class TabBarElement extends Container {

    /** @brief The index of the element. Can be used to associate a TabBar with some Tabs.
     * 
     */
    public index: number

    /** @brief Constructs a new TabBarElement.
     *  @param content The UIComponent to use to display the TabBarElement.
     */
    constructor(content: any, parent?: HTMLElement, withShadowDOM?: boolean) {
        super('TabBarElement', TabBarElementHTML, content, parent, withShadowDOM)
        this.index = 0
    }

    /** @brief Modifies the 'active' state of this element.
     *  This has the effect to add the attribute 'active' to this element. You can then retrieve
     *  this attribute with the CSS li[active].
     */
    public set active(value: boolean) {
        if (value) this.findAttrib('content')?.element.setAttribute('active', '')
        else this.findAttrib('content')?.element.removeAttribute('active')
    }

    /** @brief Returns true if the active attribute is present.
     * 
     */
    public get active(): boolean {
        return this.findAttrib('active') !== undefined
    }

    /** @brief Toggle active mode. */
    toggleActive() {
        this.active = !this.active
    }
}