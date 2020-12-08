import { LitElement, html } from "lit-element";
import {
  changeAttributesForNextComponents,
  fetchingCredentials,
  deleteItem,
} from "../data/nextAPI.js";
class NextDeleteBtn extends LitElement {
  static get properties() {
    return {
      hasError: { Type: Boolean },
      invoiceId: { type: String },
      credentials: { type: String },
    };
  }

  constructor() {
    super();
    this.invoiceId = "";
    this.hasError = false;
    this.credentials = "";
  }

  attributeChangedCallback(name, oldval, newval) {
    super.attributeChangedCallback(name, oldval, newval);
    this.requestUpdate();
  }

  deleteStuff(invoiceId) {
    fetchingCredentials().then((result) => {
      this.credentials = result;
      deleteItem(invoiceId, this.credentials).then((result) => {
        if (200 == result) {
          this.hasError = false;
          //update list if item is deleted
          //send out event
          console.log("deleted " + invoiceId + " success");
          return;
        }
        this.hasError = true;
        console.log("cant delete " + invoiceId + ". ErrorMessage: " + result);
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
