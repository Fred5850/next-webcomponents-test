import { LitElement, html, css } from "lit-element";
import { fetchingCredentials, obtainContent } from "../data/nextAPI.js";

class NextContent extends LitElement {
  static get styles() {
    return css`
      .nerds-iframe {
        height: calc(100vh - 95px) !important;
        width: 100% !important;
        float: left;
      }
    `;
  }
  static get properties() {
    return {
      hasError: { Type: Boolean },
      src: { Type: Array },
      credentials: { Type: String },
      invoiceId: { Type: String },
    };
  }

  constructor() {
    super();
    this.hasError = false;
    this.credentials = "";
    this.invoiceId = "";
    this.iframeSources = [];
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
          this.iframeSources = result;
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
      return html`<p>Content Error</p>`;
    }
    return html` <div>
      ${this.iframeSources.map(
        (src) => html`<iframe class="nerds-iframe" src="${src}"></iframe>`
      )}
    </div>`;
  }
}
customElements.define("next-content", NextContent);
