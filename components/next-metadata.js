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
    this.credentials =
      "9S2NGN2ZENS6WEKDENP78TB1E9HPGTBPCMX7AWV5E8X42H2D9570_9R85PJG9GW65Z2JYJG79PS8";
    this.invoiceId = "385987";
    this.metadata = [[]];
    obtainMetaData(this.credentials, this.invoiceId)
      .then((result) => {
        console.log(result);
        this.metadata = result;
        this.requestUpdate();
      })
      .catch(() => {
        this.hasError = true;
        this.requestUpdate();
      });
  }

  //<button @click="${obtainMetaData}">click me</button>
  render() {
    if (this.hasError) {
      return html`<p>Metadata Error :(</p>`;
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
