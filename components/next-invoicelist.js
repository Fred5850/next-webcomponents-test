import { LitElement, html } from "lit-element";
import { doMagic, changeAttributesForNextComponents } from "../data/nextAPI.js";

class NextInvoiceList extends LitElement {
  static get properties() {
    return {
      invoice: { type: Array },
    };
  }

  constructor() {
    super();
    this.invoice = ["385987", "387061"];
  }

  render() {
    return html`
      <div id="nextinvoicelistDiv" style="border: 3px dotted rgb(0, 255, 0);">
        <table id="next-invoicelist">
          ${this.invoice.map(
            (i) =>
              html`<tr>
                <td>document: ${i}</td>
                <td>
                  <input
                    type="button"
                    value=${i}
                    @click="${changeAttributesForNextComponents})"
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
