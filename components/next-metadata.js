import { LitElement, html } from "lit-element";
import {
  fetchingCredentials,
  obtainContent,
  obtainMetaData,
  obtainItem,
  obtainSpecificContentRepresentation,
} from "../data/nextAPI.js";

class NextMetadata extends LitElement {
  /*   static get properties() {
    return {
      invoice: { type: String },
      credentials: { type: String },
    };
  } */

  constructor() {
    super();
  }

  render() {
    return html`
      <div id="nextMetadataDiv" style="border: 3px dotted rgb(0, 0, 255);">
        <button @click="${obtainMetaData}">click me</button>

        <table style="width: 15%" id="next-metadata"></table>
      </div>
    `;
  }
}
customElements.define("next-metadata", NextMetadata);
