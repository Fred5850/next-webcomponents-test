import { LitElement, html, css } from "lit-element";
import { fetchingCredentials, obtainMetaData } from "../logic/nextAPI.js";

class NextMetadata extends LitElement {
  static get styles() {
    return css`
      .nextKey {
        text-align: right;
        vertical-align: top;
        padding: 1px 0px;
        width: 50%;
        cursor: inherit !important;
      }
      .nextValue {
        vertical-align: bottom;
        width: 50%;
        padding: 1px 0px;
        padding-left: 10px;
        cursor: inherit !important;
      }
      .nextTable {
        margin: 5px 0px;
        padding: 0px 10px;
        width: 100%;
        overflow: hidden;
        cursor: default !important;
      }
      .nextMetadataDiv {
        height: auto;
        width: auto;
      }
      table {
        display: table;
        border-collapse: separate;
        box-sizing: border-box;
        border-spacing: 2px;
        border-color: grey;
      }
    `;
  }
  constructor() {
    super();
    this.hasError = false;
    this.credentials = "";
    this.invoiceId = "";
    this.metadata = [[]];
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("InvoiceClicked", (e) =>
      this.InvoiceClickedEventHandler(e)
    );
    window.addEventListener("updateComponents", (e) => this.changeMetaData());
  }

  disconnectedCallback() {
    window.removeEventListener("InvoiceClicked", (e) =>
      this.InvoiceClickedEventHandler(e)
    );
    window.removeEventListener("updateComponents", (e) =>
      this.changeMetaData()
    );
    super.disconnectedCallback();
  }

  InvoiceClickedEventHandler(e) {
    this.invoiceId = e.detail.invoiceId;
    this.changeMetaData();
  }

  changeMetaData() {
    if (this.invoiceId == "") {
      return;
    }
    fetchingCredentials().then((result) => {
      this.credentials = result;
      obtainMetaData(this.credentials, this.invoiceId)
        .then((result) => {
          this.metadata = result;
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
    if (this.hasError) {
      return html`<p>
        Couldn't receive metadata from Invoice: ${this.invoiceId}
      </p>`;
    }
    if (this.invoiceId === "") {
      return html`<p>click on an invoice to see metadata</p>`;
    }
    return html`
      <div class="nextMetadataDiv" style="border: 3px dotted rgb(255, 0, 0);">
        <table class="nextTable">
          ${Array.from(this.metadata).map(
            (value) =>
              html`<tr>
                <td class="nextKey">${value[0]}:</td>
                <td class="nextValue">${value[1]}</td>
              </tr>`
          )}
        </table>
      </div>
    `;
  }
}
customElements.define("next-metadata", NextMetadata);
