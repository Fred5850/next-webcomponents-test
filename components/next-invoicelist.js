import { LitElement, html } from "lit-element";
import {
  fetchingCredentials,
  obtainContent,
  obtainMetaData,
  obtainItem,
  obtainSpecificContentRepresentation,
  clickclick,
  invoiceId,
  doMagic,
} from "../data/nextAPI.js";

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
        <h2>next-invoicelist</h2>
        <table id="next-invoicelist">
          ${this.invoice.map(
            (i) =>
              html`<tr>
                <td>${i}</td>
                <td>
                  <input
                    type="button"
                    value="clicktest"
                    @click="${clickclick}"
                  />
                </td>
                <td>
                  <input
                    type="button"
                    value="show data"
                    @click="${doMagic()}"
                  />
                </td>
              </tr>`
          )}
        </table>
        <p>----------------------</p>
      </div>
    `;
  }
}
customElements.define("next-invoicelist", NextInvoiceList);
