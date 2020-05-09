import { UIComponent } from "./Component";
import { TabBar, TabBarElementClickEvent } from './TabBar'
import { Tab } from './Tab'
import { TabBarElement } from "./TabBarElement";
import { Collection } from "./Container";

var TabsViewHTML = `
<div>
    <div quark-attrib name="tabbar">
        <!-- Here lies the TabBar -->
    </div>
    <div quark-attrib name="content">
        <!-- Here lies the Tab views -->
    </div>
</div>`

/** @brief A Component that define a Tabs viewer.
 * 
 *  The Tabs is organized with a TabBar and a collection of Tab. You can set a Tab to an index corresponding
 *  to the TabBar li index.
 * 
 *  The TabsView is both a Collection of Tab and a Container for a TabBar. The TabBar is retrieved under the
 *  'tabbar' Attribute while Tabs are retrieved through the 'content' Attribute. When a TabBarElement is 
 *  clicked, it is activated and the TabBarElementClickEvent is intercepted by this class to show the Tab
 *  whose index is the same as the TabBarElement. This index is not the ordered place of the element in the
 *  bar but a unique index to associated an element to a tab.
 * 
 *  Attributes needed:
 *  - "tabbar": The TabBar we want for our view. Shall be a TabBar component but can be anything you
 *    want.
 *  - "content": The element that will hold every Tab component.
 * 
 */
export class TabsView extends Collection {

    /** @brief The currently selected tab. */
    protected currentTab?: Tab

    /** @brief Constructs a new TabsView
     *  @param tabBar The TabBar component to use. If undefined, a new TabBar is generated.
     */
    constructor(tabBar?: TabBar, parent?: HTMLElement, withShadowDOM?: boolean) {
        super('TabsView', TabsViewHTML, parent, withShadowDOM);
        if (tabBar) this.tabBar = tabBar
        else this.tabBar = new TabBar()
    }

    /** @brief Returns the TabBar for this element.
     * 
     */
    public get tabBar(): TabBar | undefined {
        return this.findAttrib('tabbar')?.value as (TabBar | undefined)
    }

    /** @brief Sets the TabBar for this view.
     * 
     */
    public set tabBar(val: TabBar | undefined) {
        this.setAttrib('tabbar', val)
        val?.addEventListener('tabbarelementclick', this.onTabBarElementClick.bind(this))
    }

    /** @brief Returns the list of tabs.
     * 
     */
    public get tabs() {
        return this.components
    }

    /** @brief Adds a Tab to this view.
     *  @param tabBarContent The content to set the TabBarElement with, generally a Text component but it may
     *  be any component of your own.
     *  @param tabContent The actual content of the tab.
     */
    addTab(tabBarContent: UIComponent, tabContent: UIComponent) {
        let index = this.tabBar?.addElement(tabBarContent)
        if (index === null || index === undefined) return

        let tab = new Tab(tabContent)
        tab.index = index
        tab.hide()

        this.add(tab)

        if (!this.currentTab) this.makeTabCurrent(tab.index)
    }

    /** @brief Inserts a Tab before index.
     *  @param index The index before which insert the Tab.
     *  @param tabBarContent The content to set the TabBarElement with, generally a Text component but it may
     *  be any component of your own.
     *  @param tabContent The actual content of the tab.
     */
    insertTabBefore(index: number, tabBarContent: UIComponent, tabContent: UIComponent) {
        let barEl = this.tabBar?.findElement((lhs: TabBarElement) => lhs.index === index)

        let tabEl = this.find((lhs: UIComponent): boolean => {
            if (lhs instanceof Tab) return lhs.index === index
            else return false
        })

        if (!barEl || !tabEl) {
            this.addTab(tabBarContent, tabContent)
            return
        }

        if (this.tabBar) {
            let newBarEl = this.tabBar?.makeTabBarElement(tabBarContent)
            this.tabBar?.insert(newBarEl, barEl)

            let newTab = new Tab(tabContent)
            newTab.index = newBarEl.index
            newTab.hide()

            this.insert(newTab, tabEl)
        }
    }

    /** @brief Removes a Tab from this view.
     *  If this Tab is the selected tab, select the new tab at given index if it has one.
     *  @param duration The animation duration to show/hide each Tab.
     *  @param onEndCbk A callback to call after showing the current tab.
     */
    removeTab(index: number, duration: number = 0, onEndCbk?: () => void) {
        let barEl = this.tabBar?.findElement((lhs: TabBarElement) => lhs.index === index)

        let tabEl = this.find((lhs: UIComponent): boolean => {
            if (lhs instanceof Tab) return lhs.index === index
            else return false
        })

        if (barEl) this.tabBar?.removeElement(barEl as TabBarElement)
        if (tabEl) this.erase(tabEl)

        if (tabEl === this.currentTab) {
            if (this.components.length > index + 1) {
                this.makeTabCurrent(index, duration, onEndCbk)
                return
            } else {
                this.makeTabCurrent(0, duration, onEndCbk)
                return
            }
        }     
    }

    /** @brief Handles the TabBarElementClickEvent event. */
    onTabBarElementClick(event: Event) {
        this.makeTabCurrent((event as TabBarElementClickEvent).index)
    }

    /** @brief Makes the given tab the current tab.
     *  @param index The tab index to make current.
     *  @param duration The animation duration to show/hide each Tab.
     *  @param onEndCbk A callback to call after showing the current tab.
     */
    makeTabCurrent(index: number, duration: number = 0, onEndCbk?: () => void) {
        let barEl = this.tabBar?.findElement((lhs: TabBarElement) => lhs.index === index) as (TabBarElement | undefined)

        let tabEl = this.find((lhs: UIComponent): boolean => {
            if (lhs instanceof Tab) return lhs.index === index
            else return false
        }) as (Tab | undefined)

        var handler = (() => {
            if (!barEl || !tabEl) {
                return
            }

            this.tabBar?.makeCurrentElement(barEl)
            this.currentTab = tabEl
            this.currentTab.show(duration, onEndCbk)
        }).bind(this)

        if (this.currentTab) this.currentTab.hide(duration, handler)
        else handler()
    }
}