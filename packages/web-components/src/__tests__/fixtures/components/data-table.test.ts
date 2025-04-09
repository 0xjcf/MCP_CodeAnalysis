import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

interface TableData {
  [key: string]: string | number;
}

// Define a basic DataTable component using vanilla JavaScript
class DataTable extends HTMLElement {
  private _shadow: ShadowRoot;
  private _title: string = '';
  private _data: TableData[] = [];
  private _columns: string[] = [];

  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes(): string[] {
    return ['title', 'data'];
  }

  connectedCallback(): void {
    this.render();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (name === 'title' && oldValue !== newValue) {
      this._title = newValue;
      this.render();
    }
    if (name === 'data' && oldValue !== newValue) {
      try {
        this._data = JSON.parse(newValue) as TableData[];
        this._columns = this._data.length > 0 ? Object.keys(this._data[0]) : [];
      } catch (error) {
        console.error('Invalid data format:', error);
      }
      this.render();
    }
  }

  get data(): TableData[] {
    return this._data;
  }

  set data(value: TableData[]) {
    this._data = value;
    this._columns = this._data.length > 0 ? Object.keys(this._data[0]) : [];
    this.render();
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
    this.render();
  }

  private render(): void {
    if (!this._shadow) return;

    this._shadow.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: Arial, sans-serif;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1rem;
        }
        th, td {
          padding: 0.5rem;
          text-align: left;
          border: 1px solid #ddd;
        }
        th {
          background-color: #f5f5f5;
        }
        tr:hover {
          background-color: #f9f9f9;
          cursor: pointer;
        }
      </style>
      <div>
        <h2>${this._title}</h2>
        <table>
          <thead>
            <tr>
              ${this._columns.map(header => `<th>${header}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${this._data
              .map(
                (row, index) => `
              <tr data-index="${index}">
                ${this._columns.map(header => `<td>${row[header]}</td>`).join('')}
              </tr>
            `,
              )
              .join('')}
          </tbody>
        </table>
      </div>
    `;

    // Add click event listeners to rows
    const rows = this._shadow.querySelectorAll('tbody tr');
    rows.forEach(row => {
      row.addEventListener('click', () => {
        const index = row.getAttribute('data-index');
        if (index !== null) {
          this.dispatchEvent(
            new CustomEvent('row-select', {
              detail: { index },
              bubbles: true,
              composed: true,
            }),
          );
        }
      });
    });
  }
}

// Define the custom element before running tests
customElements.define('data-table', DataTable);

describe('DataTable Component', () => {
  let container: HTMLElement;
  let dataTable: DataTable;

  beforeEach(async () => {
    container = document.createElement('div');
    document.body.appendChild(container);
    dataTable = document.createElement('data-table') as DataTable;
    container.appendChild(dataTable as Node);

    // Wait for the component to be fully initialized
    await new Promise(resolve => setTimeout(resolve, 0));
  });

  afterEach(() => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  it('should render with title and data', async () => {
    const testData: TableData[] = [
      { name: 'John', age: 30 },
      { name: 'Jane', age: 25 },
    ];

    dataTable.setAttribute('title', 'Test Table');
    dataTable.data = testData;

    // Wait for the component to update
    await new Promise(resolve => setTimeout(resolve, 0));

    const shadowRoot = dataTable.shadowRoot;
    expect(shadowRoot).toBeTruthy();
    if (!shadowRoot) return;

    const title = shadowRoot.querySelector('h2');
    expect(title?.textContent).toBe('Test Table');

    const rows = shadowRoot.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
  });

  it('should handle row selection', async () => {
    const testData: TableData[] = [
      { name: 'John', age: 30 },
      { name: 'Jane', age: 25 },
    ];

    dataTable.setAttribute('title', 'Test Table');
    dataTable.data = testData;

    // Wait for the component to update
    await new Promise(resolve => setTimeout(resolve, 0));

    const rowSelectHandler = vi.fn();
    dataTable.addEventListener('row-select', rowSelectHandler);

    const shadowRoot = dataTable.shadowRoot;
    expect(shadowRoot).toBeTruthy();
    if (!shadowRoot) return;

    const firstRow = shadowRoot.querySelector('tbody tr') as HTMLElement;
    expect(firstRow).toBeTruthy();
    if (!firstRow) return;

    firstRow.click();
    expect(rowSelectHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { index: '0' },
      }),
    );
  });
});
