import BaseBuilder, { mapData } from "./base-builder";
import Block from "../components/block";
import StructureType from "../const/structure-type";

class HtmlBuilder extends BaseBuilder<string> {
  static bulider: HtmlBuilder;
  static getInstance() {
    if (!this.bulider) {
      this.bulider = new HtmlBuilder();
    }
    return this.bulider;
  }

  formatStyle(styleName: string) {
    return styleName.replace(/([A-Z])/, "-$1").toLocaleLowerCase();
  }

  getStyle(style: mapData) {
    let styleFormat = Object.keys(style).map(
      (key) => `${this.formatStyle(key)}:${style[key]};`,
    );
    if (styleFormat.length) {
      return ` style="${styleFormat.join("")}"`;
    }
    return "";
  }

  getData(data: mapData) {
    let format = Object.keys(data).map((key) => `data-${key}=${data[key]};`);
    if (format.length) {
      return ` ${format.join(" ")}"`;
    }
    return "";
  }

  buildHtml(
    tag: string,
    className: string,
    style: mapData,
    children: string,
    data: mapData = {},
  ): string {
    return `<${tag}${className ? ` class=${className}` : ""}${this.getStyle(
      style,
    )}${this.getData(data)}>${children}</${tag}>`;
  }

  buildArticle(
    id: string,
    getChildren: () => string[],
    style: mapData,
    data: mapData,
  ): string {
    return this.buildHtml(
      "article",
      "zebra-editor-article",
      style,
      getChildren().join(""),
    );
  }

  buildCustomerCollection(
    id: string,
    tag: string,
    getChildren: () => string[],
    style: mapData,
    data: mapData,
  ): string {
    return this.buildHtml(
      "div",
      "zebra-editor-customer-collection",
      style,
      getChildren().join(""),
    );
  }

  buildTable(
    id: string,
    getChildren: () => string[],
    style: mapData,
    data: mapData,
  ) {
    let table = this.buildHtml(
      "table",
      "",
      {
        minWidth: "100%",
        borderCollapse: "collapse",
      },
      getChildren().join(""),
    );
    return this.buildHtml("figure", "zebra-editor-table", style, table);
  }

  buildTableRow(
    id: string,
    getChildren: () => string[],
    style: mapData,
    data: mapData,
  ) {
    return this.buildHtml(
      "tr",
      "zebra-editor-tr",
      style,
      getChildren().join(""),
    );
  }

  buildTableCell(
    id: string,
    cellType: "th" | "td",
    getChildren: () => string[],
    style: mapData,
    data: mapData,
  ) {
    return this.buildHtml(
      cellType,
      `zebra-editor-${cellType}`,
      style,
      getChildren().join(""),
    );
  }

  buildList(
    id: string,
    getChildren: () => string[],
    style: mapData,
    data: mapData,
  ): string {
    return this.buildHtml(
      data.tag || "ul",
      "zebra-editor-list",
      style,
      getChildren().join(""),
    );
  }

  buildListItem(block: Block, onlyDecorate: boolean = false): string {
    let children = block.render(onlyDecorate);
    let style: mapData = {};
    if (block.structureType !== StructureType.content) {
      style.display = "block";
    }
    return this.buildHtml("li", "zebra-editor-list-item", style, children);
  }

  buildParagraph(
    id: string,
    getChildren: () => string[],
    style: mapData,
    data: mapData,
  ): string {
    let tag = data.tag || "p";
    return this.buildHtml(
      tag,
      `zebra-editor-${tag}`,
      style,
      `<span>${getChildren().join("") || "<br />"}</span>`,
    );
  }

  buildCode(
    id: string,
    content: string,
    language: string,
    style: mapData,
    data: mapData,
  ): string {
    return `<pre class="zebra-editor-code" ${this.getStyle({
      ...style,
      position: "relative",
    })}${this.getData(data)}><span ${this.getStyle({
      position: "absolute",
      right: "10px",
      top: "10px",
      textTransform: "uppercase",
      color: "#ccc",
    })}>${language}</span><code>${content}</code></pre>`;
  }

  buildeImage(id: string, src: string, style: mapData, data: mapData): string {
    let image = `<img src="${src}" alt="${data.alt}" />`;
    if (data.link) {
      image = `<a href="${data.link}">${image}</a>`;
    }
    let className = `zebra-editor-image`;
    return `<figure class="${className}"${this.getStyle(
      style,
    )}>${image}</figure>`;
  }

  buildeAudio(id: string, src: string, style: mapData, data: mapData): string {
    let image = `<audio src="${src}" alt="${data.alt}" />`;
    let className = `zebra-editor-image`;
    return `<figure class="${className}"${this.getStyle(
      style,
    )}>${image}</figure>`;
  }

  buildeVideo(id: string, src: string, style: mapData, data: mapData): string {
    let image = `<video src="${src}" alt="${data.alt}" />`;
    let className = `zebra-editor-image`;
    return `<figure class="${className}"${this.getStyle(
      style,
    )}>${image}</figure>`;
  }

  buildCharacterList(
    id: string,
    charList: string,
    style: mapData,
    data: mapData,
  ): string {
    let content = charList;
    if (data.link) {
      content = `<a href=${data.link}>${content}</a>`;
    }
    if (data.bold) {
      content = `<strong>${content}</strong>`;
    }
    if (data.italic) {
      content = `<em>${content}</em>`;
    }
    if (data.deleteText) {
      content = `<s>${content}</s>`;
    }
    if (data.underline) {
      content = `<u>${content}</u>`;
    }
    if (data.code) {
      content = `<code>${content}</code>`;
    }
    content = `<span${this.getStyle(style)}>${content}</span>`;
    return content;
  }

  buildInlineImage(
    id: string,
    src: string,
    style: mapData,
    data: mapData,
  ): string {
    let image = `<img src="${src}" alt="${data.alt || ""}" />`;
    if (data.link) {
      image = `<a href="${data.link}">${image}</a>`;
    }
    let className = `zebra-editor-inline-image`;
    return `<span class="${className}"${this.getStyle(style)}>${image}</span>`;
  }
}

export default HtmlBuilder;
