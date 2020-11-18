import { LitElement, html } from "lit-element";
import {
  fetchingCredentials,
  obtainContent,
  obtainMetaData,
  obtainItem,
  obtainSpecificContentRepresentation,
  clickclick,
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
        <h2>next-metadata</h2>
        <h5>${this.invoice}</h5>
        <button @click="${obtainMetaData}">click me</button>

        <table style="width: 15%" id="next-metadata"></table>
        <p>----------------------</p>
      </div>
    `;
  }
}
customElements.define("next-metadata", NextMetadata);
