import { LitElement, html } from "lit-element";

class MyElement extends LitElement {
  render() {
    return html` <div>This is my-element tag</div> `;
  }
}

customElements.define("my-element", MyElement);
