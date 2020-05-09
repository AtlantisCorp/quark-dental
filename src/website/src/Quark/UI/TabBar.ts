import { TabBarElement } from './TabBarElement'
import { Collection } from "./Container";
import { UIComponent } from './Component';

var TabBarHTML = `<ul quark-attrib name="content"></ul>`

/** @brief Represents a click on one of the TabBarElement of a TabBar. */
export class TabBarElementClickEvent extends Event {
    /** @brief Constructs a new TabBarElementClickEvent.
     *  @param element The TabBarElement component that was clicked.
     *  @param tabBar The TabBar this element is from.
     *  @param index The index of the TabBarElement clicked in the TabBar array.
     */
    constructor(
        public readonly element: TabBarElement, 
        public readonly tabBar: TabBar, 
        public readonly index: number) {
        super('tabbarelementclick')
    }
}

/** @brief A TabBar component.
 *  For a TabsView, creates under and ul/li a list of components and emits an event
 *  when a TabBarElement is clicked on. You should listen to event TabBarElementClickedEvent, 
 *  via 'tabbarelementclick'.
 *  
 *  @section Managing TabBarElement states
 * 
 *  When a TabBarElement is clicked, the TabBar automatically adds the 'active' class to this
 *  element. So design your TabBarElement CSS taking account on that.
 */
export class TabBar extends Collection {

    /** @brief The current bar element (or active). */
    protected currentElement?: TabBarElement

    /** @brief Constructs a new TabBar.
     * 
     */
    constructor(name: string = 'TabBar', source: string = TabBarHTML, parent?: HTMLElement, withShadowDOM?: boolean) {
        super(name, source, parent, withShadowDOM)
    }

    /** @brief Makes a TabBarElement for this bar. */
    makeTabBarElement(content: any, withShadowDOM: boolean = false): TabBarElement {
        let element = (content instanceof TabBarElement) ? content : new TabBarElement(content, undefined, withShadowDOM)
        element.index = TabBar.makeIndex()
        element.select('li')?.addEventListener('click', this.onElementClick.bind(this, element))
        return element
    }

    /** @brief Adds an element at the end of the elements list.
     *  @param content The content of the TabBarElement.
     */
    addElement(content: any): number {
        if (content instanceof TabBarElement) {
            this.add(content)
            return content.index
        } else {
            let el = this.makeTabBarElement(content)
            this.add(el)
            return el.index
        }
    }

    /** @brief Removes an element. */
    removeElement(element: TabBarElement) {
        this.erase(element)

        if (element === this.currentElement) {
            this.currentElement = undefined
        }
    }

    /** @brief Find an element in the bar.
     *  @param predicate The comparator predicate to use.
     */
    findElement(predicate: (lhs: TabBarElement) => boolean) {
        return this.components.find((value: UIComponent) => {  
            if (value instanceof TabBarElement) {
                return predicate(value)
            } else {
                return false
            }
        })
    }

    /** @brief Makes the index element the active element. */
    makeCurrentIndex(index: number) {
        this.makeCurrentElement(this.components[index] as TabBarElement)
    }

    /** @brief Makes an element the active element. */
    makeCurrentElement(element: TabBarElement) {
        if (this.currentElement === element) return
        if (this.currentElement) this.currentElement.active = false

        this.currentElement = element
        this.currentElement.active = true
    }

    /** @brief Emits the 'tabbarelementclick'.
     *  Also sets the element as the current bar element. If the current element is
     *  already this element, does nothing.
     */
    onElementClick(element: TabBarElement) {
        this.makeCurrentElement(element)

        this.dispatchEvent(new TabBarElementClickEvent(
            element, 
            this,
            element.index
        ))
    }

    /** @brief The next index value.
     * 
     */
    private static __nextIndex: number = 0

    /** @brief Returns an identifier for each TabBarElement created by this bar.
     * 
     */
    protected static makeIndex(): number {
        let result = this.__nextIndex
        this.__nextIndex++
        return result
    }

    /** @brief Returns true if an object conform to this type.
     * 
     */
    public static isTabBar(rhs: any): rhs is TabBar {
        if (!rhs) return false 
        return 'makeTabBarElement' in rhs &&
               'addElement' in rhs &&
               'removeElement' in rhs &&
               'makeCurrentElement' in rhs
    }
}