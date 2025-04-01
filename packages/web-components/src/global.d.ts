declare global {
  interface ShadowRoot {
    mode: 'open' | 'closed';
    host: Element;
    innerHTML: string;
    children: HTMLCollection;
    childNodes: NodeList;
    firstChild: Node | null;
    lastChild: Node | null;
    childElementCount: number;
    firstElementChild: Element | null;
    lastElementChild: Element | null;
    activeElement: Element | null;
    styleSheets: StyleSheetList;
    adoptedStyleSheets: CSSStyleSheet[];
    getElementById(elementId: string): Element | null;
    getElementsByClassName(classNames: string): HTMLCollectionOf<Element>;
    getElementsByTagName(qualifiedName: string): HTMLCollectionOf<Element>;
    getElementsByTagNameNS(namespaceURI: string, localName: string): HTMLCollectionOf<Element>;
    querySelector(selectors: string): Element | null;
    querySelectorAll(selectors: string): NodeListOf<Element>;
  }

  interface Element {
    tagName: string;
    attributes: NamedNodeMap;
    children: HTMLCollection;
    childNodes: NodeList;
    firstChild: Node | null;
    lastChild: Node | null;
    childElementCount: number;
    firstElementChild: Element | null;
    lastElementChild: Element | null;
    nextElementSibling: Element | null;
    previousElementSibling: Element | null;
    parentElement: Element | null;
    parentNode: Node | null;
    getAttribute(name: string): string | null;
    setAttribute(name: string, value: string): void;
    removeAttribute(name: string): void;
    hasAttribute(name: string): boolean;
    getAttributeNode(name: string): Attr | null;
    setAttributeNode(attr: Attr): Attr | null;
    removeAttributeNode(attr: Attr): Attr;
    getElementsByClassName(classNames: string): HTMLCollectionOf<Element>;
    getElementsByTagName(qualifiedName: string): HTMLCollectionOf<Element>;
    getElementsByTagNameNS(namespaceURI: string, localName: string): HTMLCollectionOf<Element>;
    querySelector(selectors: string): Element | null;
    querySelectorAll(selectors: string): NodeListOf<Element>;
  }

  interface Node {
    nodeType: number;
    nodeName: string;
    parentNode: Node | null;
    childNodes: NodeList;
    firstChild: Node | null;
    lastChild: Node | null;
    nextSibling: Node | null;
    previousSibling: Node | null;
    textContent: string | null;
    hasChildNodes(): boolean;
    appendChild<T extends Node>(newChild: T): T;
    removeChild<T extends Node>(oldChild: T): T;
    replaceChild<T extends Node>(newChild: Node, oldChild: T): T;
    insertBefore<T extends Node>(newChild: Node, refChild: T | null): T;
    cloneNode(deep?: boolean): Node;
    isEqualNode(otherNode: Node | null): boolean;
    isSameNode(otherNode: Node | null): boolean;
    compareDocumentPosition(other: Node): number;
    contains(other: Node | null): boolean;
    lookupPrefix(namespaceURI: string | null): string | null;
    lookupNamespaceURI(prefix: string | null): string | null;
    isDefaultNamespace(namespaceURI: string | null): boolean;
  }

  interface HTMLCollection {
    length: number;
    item(index: number): Element | null;
    namedItem(name: string): Element | null;
    [index: number]: Element;
  }

  interface NamedNodeMap {
    length: number;
    item(index: number): Attr | null;
    getNamedItem(name: string): Attr | null;
    setNamedItem(attr: Attr): Attr | null;
    removeNamedItem(name: string): Attr;
    [index: number]: Attr;
  }

  interface Attr {
    name: string;
    value: string;
    specified: boolean;
    ownerElement: Element | null;
  }
}

export {};
