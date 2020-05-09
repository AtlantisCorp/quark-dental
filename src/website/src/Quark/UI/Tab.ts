import { Container } from "./Container";

/** @brief The default tab template. */
var TabHTML = `
<div quark-attrib name="content" class="tab">
</div>
`

/** @brief Defines a Tab which is only a container with class '.tab'.
 * 
 */
export class Tab extends Container {
 
    /** @brief An index for the Tab. This index can be used to associate the Tab to a TabBarElement,
     *  like does TabsView.
     */
    public index: number = 0

    /** @brief Constructs a new Tab.
     *  @param content The content element.
     */
    constructor(content: any, parent?: HTMLElement, withShadowDOM?: boolean) {
        super('Tab', TabHTML, content, parent, withShadowDOM)
    }
}