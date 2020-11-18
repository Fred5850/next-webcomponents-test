import { LitElement, html } from "lit-element";
import {
  fetchingCredentials,
  obtainContent,
  obtainMetaData,
  obtainItem,
  obtainSpecificContentRepresentation,
  clickclick,
} from "../data/nextAPI.js";

class NextContent extends LitElement {
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
      <div id="nextContentDiv" style="border: 3px dotted rgb(255, 0, 0);">
        <h1>next-content</h1>
        <iframe id="nextIframe" src=""></iframe>
        <p>----------------------</p>
      </div>
    `;
  }
}
customElements.define("next-content", NextContent);
