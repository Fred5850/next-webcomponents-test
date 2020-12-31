import { LitElement, html, css } from "lit-element";
import { fetchingCredentials, obtainContent } from "../logic/nextAPI.js";

class NextContent extends LitElement {
  static get styles() {
    return css`
      .iframe-style {
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
  constructor() {
    super();
    this.hasError = false;
    this.credentials = "";
    this.invoiceId = "";
    this.iframeSources = [];
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("InvoiceClicked", (e) =>
      this.InvoiceClickedEventHandler(e)
    );
    window.addEventListener("updateComponents", (e) => this.changeContent());
  }

  disconnectedCallback() {
    window.removeEventListener("InvoiceClicked", (e) =>
      this.InvoiceClickedEventHandler(e)
    );
    window.removeEventListener("updateComponents", (e) => this.changeContent());
    super.disconnectedCallback();
  }
  InvoiceClickedEventHandler(e) {
    this.invoiceId = e.detail.invoiceId;
    this.changeContent();
  }

  changeContent() {
    if (this.invoiceId === "") {
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
  //selects all iframes and iterates through them. if the iframes id is the same
  //as the parameter is removes "x-hide-display" class, else add class it to the element
  hideAndShowContent(id) {
    this.shadowRoot
      .querySelectorAll("#nextcomponent-content-iframes > *")
      .forEach((element) => {
        const operation = element.id === id ? "remove" : "add";
        element.classList[operation]("x-hide-display");
      });
  }

  render() {
    //render this, if error
    if (this.hasError) {
      return html`<p>
        Couldn't receive content from Invoice: ${this.invoiceId}
      </p>`;
    }
    //if no invoice (Default)
    if (this.invoiceId === "") {
      return html`<p>click on an invoice to see content</p>`;
    }
    // render this, if only 1 src
    if (this.iframeSources.length === 1) {
      return html`
        <div id="nextcomponent-content-iframe">
          ${this.iframeSources.map(
            (src) => html`<h2>${src.name}</h2>
              <iframe class="iframe-style" src="${src.url}"></iframe>`
          )}
        </div>
      `;
    }
    //render this if there is more than 1 content
    return html` <div id="nextcomponent-content">
      <div class="nextcomponent-content-tabs">
        ${this.iframeSources.map(
          (src, index) =>
            html`
              <div class="nextcomponent-content-tabs-tab">
                <input
                  type="button"
                  value="${src.name}"
                  @click=${() => this.hideAndShowContent(index + src.name)}
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
                class="iframe-style${index !== 0 ? " x-hide-display" : ""}"
                id="${index + src.name}"
                src="${src.url}"
              ></iframe>
            `
        )}
      </div>
    </div>`;
  }
}
customElements.define("next-content", NextContent);
