import { LitElement, html } from "lit-element";
import { css } from "lit-element";
import {
  fetchingCredentials,
  obtainContent,
  obtainMetaData,
  obtainItem,
  obtainSpecificContentRepresentation,
} from "../data/nextAPI.js";

class NextContent extends LitElement {
  static get styles() {
    return css`
      .nerds-iframe {
        height: calc(100vh - 95px) !important;
        width: 45% !important;
        float: left;
      }
    `;
  }
  static get properties() {
    return {
      hasError: { Type: Boolean },
      src: { Type: String },
      credentials: { Type: String },
      invoiceId: { Type: String },
    };
  }

  constructor() {
    super();
    this.hasError = false;
    this.credentials = "";
    this.invoiceId = "";
    this.src = "";
  }
  attributeChangedCallback(name, oldval, newval) {
    super.attributeChangedCallback(name, oldval, newval);
    this.changeContent();
  }

  changeContent() {
    if (this.invoiceId == "") {
      return;
    }
    fetchingCredentials().then((result) => {
      this.credentials = result;
      obtainContent(this.credentials, this.invoiceId)
        .then((result) => {
          this.src = result;
          this.hasError = false;
          this.requestUpdate();
        })
        .catch(() => {
          this.hasError = true;
          this.requestUpdate();
        });
    });
  }
  // Function loads the iframe data. The returned promise resolves with the requested URL if the request is successful and rejects if it's not.
  // This can be outside of this class of course!
  /* inside render() method
   */
  render() {
    if (this.hasError) {
      return html`<p>Content Error :(</p>`;
    }
    return html` <div>
      <iframe class="nerds-iframe" src="${this.src}"></iframe>
    </div>`;
  }
}
customElements.define("next-content", NextContent);
