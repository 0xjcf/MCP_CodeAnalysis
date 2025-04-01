class TaskManager extends HTMLElement {
  private _shadow: ShadowRoot;
  private _tasks: Array<{ name: string; completed: boolean }> = [];

  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  get tasks(): Array<{ name: string; completed: boolean }> {
    return this._tasks;
  }

  set tasks(value: Array<{ name: string; completed: boolean }>) {
    this._tasks = value;
    this.render();
  }

  private addTask(name: string) {
    if (name.trim()) {
      this._tasks.push({ name: name.trim(), completed: false });
      this.render();
      this.dispatchEvent(
        new CustomEvent('task-added', {
          bubbles: true,
          composed: true,
          detail: { task: this._tasks[this._tasks.length - 1] },
        }),
      );
    }
  }

  private toggleTask(index: number) {
    this._tasks[index].completed = !this._tasks[index].completed;
    this.render();
    this.dispatchEvent(
      new CustomEvent('task-toggled', {
        bubbles: true,
        composed: true,
        detail: { index, task: this._tasks[index] },
      }),
    );
  }

  private render() {
    if (!this._shadow) return;

    this._shadow.innerHTML = `
      <style>
        .task-manager {
          padding: 1rem;
          max-width: 600px;
          margin: 0 auto;
        }
        .task-form {
          margin-bottom: 1rem;
        }
        .task-input {
          padding: 0.5rem;
          margin-right: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .add-button {
          padding: 0.5rem 1rem;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .task-list {
          list-style: none;
          padding: 0;
        }
        .task-item {
          display: flex;
          align-items: center;
          padding: 0.5rem;
          margin-bottom: 0.5rem;
          background-color: #f5f5f5;
          border-radius: 4px;
        }
        .task-item.completed {
          background-color: #e0e0e0;
        }
        .task-checkbox {
          margin-right: 0.5rem;
        }
        .task-name {
          flex-grow: 1;
        }
        .completed .task-name {
          text-decoration: line-through;
          color: #666;
        }
      </style>
      <div class="task-manager">
        <div class="task-form">
          <input type="text" class="task-input" placeholder="Add a new task">
          <button class="add-button">Add Task</button>
        </div>
        <ul class="task-list">
          ${this._tasks
            .map(
              (task, index) => `
            <li class="task-item ${task.completed ? 'completed' : ''}" data-index="${index}">
              <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
              <span class="task-name">${task.name}</span>
            </li>
          `,
            )
            .join('')}
        </ul>
      </div>
    `;

    // Add event listeners
    const input = this._shadow.querySelector('.task-input') as HTMLInputElement;
    const addButton = this._shadow.querySelector('.add-button') as HTMLButtonElement;
    const taskList = this._shadow.querySelector('.task-list') as HTMLUListElement;

    addButton.addEventListener('click', () => {
      this.addTask(input.value);
      input.value = '';
    });

    input.addEventListener('keypress', e => {
      if (e.key === 'Enter') {
        this.addTask(input.value);
        input.value = '';
      }
    });

    taskList.addEventListener('click', e => {
      const target = e.target as HTMLElement;
      const taskItem = target.closest('.task-item');
      if (taskItem) {
        const index = parseInt(taskItem.getAttribute('data-index') || '0');
        this.toggleTask(index);
      }
    });
  }
}

// Define the custom element
customElements.define('task-manager', TaskManager);
