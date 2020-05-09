import { UIComponent } from "./Component";

var DialogHTML = `
<div>
    <style scoped>
        .frame {
            position: absolute;
            left: 50%;
            bottom: 0;
            color: white;
            padding: 10px 20px 10px 20px;
            transform: translate(-50%, -5px);
            width: 90%;

            background-color: rgb(59, 113, 184);
            border-radius: 5px;
            border: white 2px solid;
            transition: all .4s linear;
        }

        .frame .title {
            font-size: 24;
        }
    </style>

    <div class="frame">
        <div class="title" quark-attrib name="title"></div>
        <hr />
        <div class="content" quark-attrib name="content"></div>
    </div>
</div>`

/** @brief A very simple class that gives a Dialog template. 
 * 
 */
export class Dialog extends UIComponent {
    /** @brief Constructs a new Dialog from the source 'Dialog.html'.
     *  @param title The dialog's title.
     *  @param content The dialog's content.
     */
    constructor(title: any, content: any, parent?: HTMLElement, withShadowDOM?: boolean) {
        super('Dialog', DialogHTML, parent, withShadowDOM)
        this.setAttrib('title', title)
        this.setAttrib('content', content)
    }

    /** @brief Returns the title's attribute. */
    public get title() { return this.findAttrib('title')?.value }

    /** @brief Modifies the title. */
    public set title(value: any) { this.setAttrib('title', value) }

    /** @brief Returns the title's attribute. */
    public get content() { return this.findAttrib('content')?.value }

    /** @brief Modifies the title. */
    public set content(value: any) { this.setAttrib('content', value) }
}