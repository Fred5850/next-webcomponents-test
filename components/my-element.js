import { LitElement, html } from "lit-element";
import {
  fetchingCredentials,
  obtainContent,
  obtainMetaData,
  obtainItem,
  obtainSpecificContentRepresentation,
} from "../data/nextAPI.js";

class MyElement extends LitElement {
  constructor() {
    super();
  }

  render() {
    return html`<p>Error :(</p>`;
  }
}

customElements.define("my-element", MyElement);
