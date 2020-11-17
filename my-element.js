import { LitElement, html } from "./node_modules/lit-element/lit-element";

class MyElement extends LitElement {
  render() {
    return html` <div>Hello from MyElement!</div> `;
  }
}

customElements.define("my-element", MyElement);
