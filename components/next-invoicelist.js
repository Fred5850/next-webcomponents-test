import { LitElement, html } from "lit-element";
import { changeAttributesForNextComponents } from "../data/nextAPI.js";

class NextInvoiceList extends LitElement {
  static get properties() {
    return {
      invoice: { type: Array },
    };
  }

  constructor() {
    super();
    this.invoice = ["141099", "385987", "387061", "384043", "384040", "384035"];
  }

  render() {
    return html`
      <div id="nextinvoicelistDiv" style="border: 3px dotted rgb(0, 255, 0);">
        <table id="next-invoicelist">
          ${this.invoice.map(
            (i) =>
              html` <tr>
                <td>Invoice: ${i}</td>
                <td>
                  <input
                    type="button"
                    value="see"
                    @click=${() => changeAttributesForNextComponents(i)}
                  />
                </td>
              </tr>`
          )}
        </table>
      </div>
    `;
  }
}
customElements.define("next-invoicelist", NextInvoiceList);
