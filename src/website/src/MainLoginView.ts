import * as Quark from './Quark'

/** @brief The Main Login View.
 *  HTML: main-login-page.html
 *  CSS: main-login-page.css
 */
export class MainLoginView extends Quark.UI.UIComponent {
    /** @brief Constructor. */
    constructor(parent?: HTMLElement, withShadowDOM?: boolean) {
        super('MainLoginView', 
            Quark.UI.UIComponent.HTMLFromFile('main-login-page.html'), 
            parent, 
            withShadowDOM)
        this.stylize('', Quark.UI.UIComponent.SourceFromFile('/out/website/css/main-login-page.css'))
    }
}