import { LitElement, html } from "lit-element";

export class NextMetadata extends LitElement {
  render() {
    return html` <p>Hello world! From my-element</p> `;
  }
}

customElements.define("next-metadata", NextMetadata);
