import { LitElement, html } from "lit-element";
import {
  fetchingCredentials,
  obtainContent,
  obtainMetaData,
  obtainItem,
  obtainSpecificContentRepresentation,
} from "../data/fetchingCred.js";

class NextMetadata extends LitElement {
  static get properties() {
    return {
      invoice: { type: String },
    };
  }

  constructor() {
    super();
  }

  render() {
    return html`
      <div id="nextMetadataDiv">
        <h1>hehs</h1>
        <table style="width: 15%" id="next-metadata"></table>
      </div>
    `;
  }
}
customElements.define("next-metadata", NextMetadata);
