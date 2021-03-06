import { LitElement, html } from "lit-element";
import { fetchingCredentials, deleteItem } from "../logic/nextAPI.js";
class NextDeleteBtn extends LitElement {
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
    window.removeEventListener("InvoiceClicked", (e) =>
      this.InvoiceClickedEventHandler(e)
    );
    super.disconnectedCallback();
  }

  deleteStuff(invoiceId) {
    fetchingCredentials().then((result) => {
      this.credentials = result;
      deleteItem(invoiceId, this.credentials).then((result) => {
        if (200 === result) {
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
      <div id="nextdeleteBtnDiv" style="border: 3px dotted rgb(0, 0, 255);">
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
