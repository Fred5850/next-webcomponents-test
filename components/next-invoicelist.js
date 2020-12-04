import { LitElement, html } from "lit-element";
import {
  changeAttributesForNextComponents,
  fetchingCredentials,
  obtainInvoiceList,
  deleteItem,
} from "../data/nextAPI.js";

class NextInvoiceList extends LitElement {
  static get properties() {
    return {
      hasError: { Type: Boolean },
      invoice: { type: Array },
      credentials: { type: String },
    };
  }

  constructor() {
    super();
    this.invoice = [];
    this.hasError = false;
    this.credentials = "";
    this.obtainInvoices();
  }
  deleteStuff(invoiceId) {
    fetchingCredentials().then((result) => {
      this.credentials = result;
      deleteItem(invoiceId, this.credentials).then((result) => {
        if (200 == result) {
          //update list if item is deleted
          changeAttributesForNextComponents("");
          this.obtainInvoices();
        }
      });
    });
  }
  obtainInvoices() {
    fetchingCredentials().then((result) => {
      this.credentials = result;
      obtainInvoiceList(this.credentials, 10)
        .then((result) => {
          this.invoice = result;
          this.hasError = false;
          this.requestUpdate();
        })
        .catch(() => {
          this.hasError = true;
          this.requestUpdate();
        });
    });
  }

  render() {
    return html`
      <div id="nextinvoicelistDiv" style="border: 3px dotted rgb(0, 255, 0);">
        <table id="next-invoicelist">
          <input
            type="button"
            value="log list"
            @click=${() => this.obtainInvoices()}
          />
          <input
            type="button"
            value="see 141099"
            @click=${() => changeAttributesForNextComponents(141099)}
          />
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
                <td>
                  <input
                    type="button"
                    value="delete"
                    @click=${() => this.deleteStuff(i)}
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
