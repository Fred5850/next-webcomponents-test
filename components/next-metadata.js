import { LitElement, html } from "lit-element";
import {
  fetchingCredentials,
  obtainContent,
  obtainMetaData,
  obtainItem,
  obtainSpecificContentRepresentation,
} from "../data/nextAPI.js";

class NextMetadata extends LitElement {
  static get properties() {
    return {
      hasError: { type: Boolean },
      credentials: { type: String },
      invoiceId: { type: String },
      metadata: { type: Map },
    };
  }

  constructor() {
    super();
    this.hasError = false;
    this.credentials = "";
    this.invoiceId = "";
    this.metadata = [[]];
  }
  attributeChangedCallback(name, oldval, newval) {
    super.attributeChangedCallback(name, oldval, newval);
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
  //<button @click="${obtainMetaData}">click me</button>
  render() {
    if (this.hasError) {
      return html`<p>Metadata Error :(</p>`;
    }
    if (this.invoiceId == "") {
      return html`<p>click on document to see metadata</p>`;
    }
    return html`
      <div id="nextMetadataDiv" style="border: 3px dotted rgb(0, 0, 255);">
        <p>MetaDataTabel</p>
        <table style="width: 15%" id="next-metadata">
          ${Array.from(this.metadata).map(
            (value) =>
              html`<tr>
                <td>${value[0]}</td>
                <td>${value[1]}</td>
              </tr>`
          )}
        </table>
      </div>
    `;
  }
}
customElements.define("next-metadata", NextMetadata);
