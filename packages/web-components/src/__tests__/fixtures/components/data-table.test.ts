import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Define a basic DataTable component using vanilla JavaScript
class DataTable extends HTMLElement {
  private _shadow: ShadowRoot;
  private _title: string = '';
  private _data: any[] = [];

  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['title'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'title' && oldValue !== newValue) {
      this._title = newValue;
      this.render();
    }
  }

  get data(): any[] {
    return this._data;
  }

  set data(value: any[]) {
    this._data = value;
    this.render();
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
    this.render();
  }

  private render() {
    if (!this._shadow) return;

    this._shadow.innerHTML = `
      <style>
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          padding: 8px;
          border: 1px solid #ddd;
          text-align: left;
        }
        th {
          background-color: #f4f4f4;
        }
        tr:hover {
          background-color: #f5f5f5;
          cursor: pointer;
        }
      </style>
      <div>
        ${this._title ? `<h2>${this._title}</h2>` : ''}
        <table>
          <thead>
            <tr>
              ${
                this._data.length > 0
                  ? Object.keys(this._data[0])
                      .map(key => `<th>${key}</th>`)
                      .join('')
                  : ''
              }
            </tr>
          </thead>
          <tbody>
            ${this._data
              .map(
                (row, index) => `
              <tr data-index="${index}">
                ${Object.values(row)
                  .map(value => `<td>${value}</td>`)
                  .join('')}
              </tr>
            `,
              )
              .join('')}
          </tbody>
        </table>
      </div>
    `;

    // Add click handlers to rows
    this._shadow.querySelectorAll('tbody tr').forEach(row => {
      row.addEventListener('click', e => {
        const index = (e.currentTarget as HTMLElement).dataset.index;
        this.dispatchEvent(
          new CustomEvent('row-select', {
            bubbles: true,
            composed: true,
            detail: { index },
          }),
        );
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
    container.appendChild(dataTable);

    // Wait for the component to be fully initialized
    await new Promise(resolve => setTimeout(resolve, 0));
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should render with title and data', async () => {
    const testData = [
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
    const testData = [
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
