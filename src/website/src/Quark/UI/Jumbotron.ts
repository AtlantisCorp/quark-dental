import { UIComponent } from './Component'

var JumbotronHTML = `
<div>
    <style scoped>
        .jumbotron {
            <% if (locals.style?.centered) { %>
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            <% } %>

            width: 80%;
            height:  80%;
            overflow: scroll;
            color: white;
            text-align: center;
        }
    </style>
    <div class="jumbotron">
        <div quark-attrib name="header"></div>
        <hr />
        <div quark-attrib name="content"></div>
    </div>
</div>`

/** @brief A big container with a header and a content.
 * 
 */
export class Jumbotron extends UIComponent {
    /** @brief Constructs a new Jumbotron.
     *  @param header The header attribute.
     *  @param content The content attribute.
     *  @param centered Boolean true if you want the Jumbotron to be centered from 
     *  the parent's element point of view. True is the default value.
     */
    constructor(header: any, content: any, public centered?: boolean, parent?: HTMLElement, withShadowDOM?: boolean) {
        super('Jumbotron', JumbotronHTML, parent, withShadowDOM)
        this.setAttrib('header', header)
        this.setAttrib('content', content)
    }

    /** @brief Returns the data for the HTML source.
     * 
     */
    data() {
        return {
            centered: this.centered
        }
    }

    /** @brief Returns the header attribute. */
    public get header() { return this.findAttrib('header')?.value }

    /** @brief Modifies the header attribute. */
    public set header(value: any) { this.setAttrib('header', value) }

    /** @brief Returns the content attribute. */
    public get content() { return this.findAttrib('content')?.value }

    /** @brief Modifies the header attribute. */
    public set content(value: any) { this.setAttrib('content', value) }
}