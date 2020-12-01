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
      .x-hide-display {
        display: none !important;
      }
      .nextcomponent-content-tabs {
        position: relative;
        clear: both;
        margin: 0px;
        padding-top: 2px;
        width: 100% !important;
        height: 45px;
        white-space: nowrap;
        overflow-x: auto;
        overflow-y: hidden;
      }
      .nextcomponent-content-tabs-tab {
        display: inline-block;
        vertical-align: top;
      }
    `;
  }
  static get properties() {
    return {
      hasError: { Type: Boolean },
      iframeSources: { Type: Array },
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

  hideAndShowContent(id) {
    const contentDiv = this.shadowRoot.getElementById(
      "nextcomponent-content-iframes"
    );
    var content = Array.from(contentDiv.children);

    content.forEach((element) => {
      if (element.id == id) {
        if (element.classList.contains("x-hide-display")) {
          element.classList.remove("x-hide-display");
        }
      } else {
        if (!element.classList.contains("x-hide-display")) {
          element.classList.add("x-hide-display");
        }
      }
    });
  }

  render() {
    //render this, if error
    if (this.hasError) {
      return html`<p>Content Error</p>`;
    }
    //if no invoice
    if (this.invoiceId == "") {
      return html`<p>click on document to see content</p>`;
    }
    // render this, if only 1 src
    if (this.iframeSources.length == 1) {
      return html` <div id="nextcomponent-content-iframe">
        <div id="nextcomponent-content-iframe">
          ${this.iframeSources.map(
            (src) => html`<p>only one content: ${src.name}</p>
              <iframe class="nerds-iframe" src="${src.url}"></iframe>`
          )}
        </div>
      </div>`;
    }
    //else render this
    return html` <div id="nextcomponent-content">
      <div class="nextcomponent-content-tabs">
        ${this.iframeSources.map(
          (src) =>
            html`
              <div class="nextcomponent-content-tabs-tab">
                <input
                  type="button"
                  value="${src.name}"
                  @click=${() => this.hideAndShowContent(src.name)}
                />
              </div>
            `
        )}
      </div>
      <div id="nextcomponent-content-iframes">
        ${this.iframeSources.map(
          (src, index) =>
            html`
              <iframe
                class="nerds-iframe ${index !== 0 ? "x-hide-display" : ""}"
                id="${src.name}"
                src="${src.url}"
              ></iframe>
            `
        )}
      </div>
    </div>`;
  }
}
/*
     ${this.iframeSources.map(
          (src, index) =>
            html`
              <iframe
                class="nerds-iframe ${index !== 0 ? "x-hide-display" : ""}"
                id="${src.name}"
                src="${src.url}"
              ></iframe>
            `
        )}
*/
customElements.define("next-content", NextContent);
