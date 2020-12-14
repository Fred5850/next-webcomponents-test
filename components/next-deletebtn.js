import { LitElement, html } from "lit-element";
import { fetchingCredentials, deleteItem } from "../data/nextAPI.js";
class NextDeleteBtn extends LitElement {
  static get properties() {
    return {
      invoiceId: { type: String },
      credentials: { type: String },
    };
  }

  constructor() {
    super();
    this.invoiceId = "";
    this.credentials = "";
  }

  InvoiceClickedEventHandler(e) {
    this.invoiceId = e.detail.invoiceId;
    this.requestUpdate();
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("InvoiceClicked", (e) =>
      this.InvoiceClickedEventHandler(e)
    );
  }

  disconnectedCallback() {
    window.removeEventListener("InvoiceClicked");
    super.disconnectedCallback();
  }

  deleteStuff(invoiceId) {
    fetchingCredentials().then((result) => {
      this.credentials = result;
      deleteItem(invoiceId, this.credentials).then((result) => {
        if (200 == result) {
          //update list if item is deleted
          //send out event
          window.dispatchEvent(
            new CustomEvent("updateComponents", {
              detail: {
                invoiceId: invoiceId,
                update: true,
              },
            })
          );
          return;
        }
        console.error(
          "-cant delete " + invoiceId + ". ErrorMessage: " + result
        );
      });
    });
  }

  render() {
    return html`
      <div id="nextdeleteBtnDiv" style="border: 3px dotted rgb(255, 0, 0);">
        <input
          type="button"
          value="delete"
          @click=${() => this.deleteStuff(this.invoiceId)}
        />
      </div>
    `;
  }
}
customElements.define("next-deletebtn", NextDeleteBtn);
