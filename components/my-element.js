import { LitElement, html } from "lit-element";

class MyElement extends LitElement {
  static get properties() {
    return {
      iframeData: {
        hasError: false,
        src: "",
      },
    };
  }
  constructor() {
    super();
    // Load the iframe data, updating the properties depending on the result and requesting a rerender of the component to apply the changes.
    loadIframeData(theUrlYouPassIntoThatScreenshottedMethod)
      .then((url) => {
        this.iframeData.src = url;
        this.requestUpdate();
      })
      .catch(() => {
        this.iframeData.hasError = true;
        this.requestUpdate();
      });
  }
  // Function loads the iframe data. The returned promise resolves with the requested URL if the request is successful and rejects if it's not.
  // This can be outside of this class of course!
  /*     loadIframeData(url) {
    return new Promise((resolve, reject) => {
      fetch(url, {
        // some stuff that I think is hidden in the screenshot
        console.log(response);
        if (response.status === 200) {
          resolve(url);
        else {
          console.log("Response status is not 200, error");
          reject();
        }
      });
    };
  } */

  render() {
    if (this.iframeData.hasError) {
      return html`<p>Error :(</p>`;
    }

    return html` <iframe src="${this.iframeData.src}"></iframe> `;
  }
}

customElements.define("my-element", MyElement);
