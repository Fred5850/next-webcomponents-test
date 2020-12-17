import { LitElement, html } from "lit-element";
import { fetchingCredentials, obtainInvoiceList } from "../data/nextAPI.js";

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
    this.invoices = [];
    this.hasError = false;
    this.credentials = "";
    this.obtainInvoices();
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("updateComponents", () => this.obtainInvoices());
  }

  disconnectedCallback() {
    window.removeEventListener("updateComponents", () => this.obtainInvoices());
    super.disconnectedCallback();
  }
  //fetches the last 10 invoices
  obtainInvoices() {
    fetchingCredentials().then((result) => {
      this.credentials = result;
      obtainInvoiceList(this.credentials, 10)
        .then((result) => {
          this.invoices = result;
          this.hasError = false;
          this.requestUpdate();
        })
        .catch(() => {
          this.hasError = true;
          this.requestUpdate();
        });
    });
  }
  /*
   * send a InvoiceCliked event
   */
  sendInvoiceIdEvent(invoiceId) {
    window.dispatchEvent(
      new CustomEvent("InvoiceClicked", {
        detail: {
          invoiceId: invoiceId,
        },
      })
    );
  }

  render() {
    if (this.hasError) {
      return html`<p>Couldn't receive Invoices</p>`;
    }

    return html`
      <div id="nextinvoicelistDiv">
        <table id="next-invoicelist">
          <input
            type="button"
            value="see invoice with 2 documents"
            @click=${() => this.sendInvoiceIdEvent(141099)}
          />
          ${this.invoices.map(
            (i) =>
              html` <tr>
                <td>Invoice: ${i}</td>
                <td>
                  <input
                    type="button"
                    value="see"
                    @click=${() => this.sendInvoiceIdEvent(i)}
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
