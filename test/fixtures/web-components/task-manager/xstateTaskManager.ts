import { html } from "lit-html";
import { igniteCore } from "../../IgniteCore";
import { RenderArgs } from "../../RenderArgs";
import { taskManagerMachine } from "./taskManagerMachine";
import { setGlobalStyles } from "../../globalStyles";

setGlobalStyles("./dist/styles.css");

// Initialize Ignite-core
const { Shared } = igniteCore({
  adapter: "xstate",
  source: taskManagerMachine,
});

@Shared("task-list")
export class TaskList {
  render({ state, send }: RenderArgs<typeof taskManagerMachine>) {
    const { tasks } = state;

    return html`
      <div class="p-6 bg-green-50 border border-green-300 rounded-lg shadow-lg">
        <h3 class="text-xl font-semibold text-green-800 mb-4">Task List</h3>
        <ul class="space-y-4">
          ${tasks.map((task, index) => {
            // Determine background color based on priority
            const priorityColor =
              task.priority === "High"
                ? "bg-red-400"
                : task.priority === "Medium"
                ? "bg-yellow-400"
                : "bg-green-400";

            return html` <li
              class="grid p-4 border rounded-lg shadow-sm hover:shadow-md transition ${priorityColor}"
              style="grid-template-columns: 1fr auto; align-items: center"
            >
              <span
                class="text-md ${task.completed
                  ? "line-through text-gray-500"
                  : "text-gray-900"}"
              >
                ${task.name}
              </span>
              <button
                @click=${() => send({ type: "TOGGLE", index })}
                class="text-sm bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                ${task.completed ? "Undo" : "Complete"}
              </button>
            </li>`;
          })}
        </ul>
      </div>
    `;
  }
}

@Shared("progress-bar")
export class ProgressBar {
  render({ state }: RenderArgs<typeof taskManagerMachine>) {
    const { tasks } = state.context;
    const completed = tasks.filter((t) => t.completed).length;
    const total = tasks.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;

    const backgroundStyle =
      percentage === 100
        ? "background: #22c55e;"
        : `background: linear-gradient(
            90deg,
            rgba(34, 197, 94, 1) 0%,
            rgba(251, 191, 36, 1) 50%,
            rgba(209, 213, 219, 0.1) 100%
          );`;

    return html`
      <div class="p-4 bg-blue-100 border rounded-md mt-2 mb-2">
        <h3 class="text-lg font-bold">Progress</h3>
        <div class="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            class="h-4 rounded-full transition-all duration-700 ease-out"
            style="width: ${percentage}%; ${backgroundStyle}"
          ></div>
        </div>
        <p class="mt-2">${completed}/${total} tasks completed</p>
      </div>
    `;
  }
}

@Shared("task-form")
export class TaskForm {
  render({ send }: RenderArgs<typeof taskManagerMachine>) {
    return html`
      <div class="p-4 bg-yellow-100 border rounded-md mb-2">
        <h3 class="text-lg font-bold">Add Task</h3>
        <form
          @submit=${(e: Event) => {
            e.preventDefault();
            const formElement = e.target as HTMLFormElement;
            const formData = new FormData(formElement);
            const name = formData.get("name") as string;
            const priority = formData.get("priority") as string;
            if (name.trim()) {
              send({ type: "ADD", name, priority });
              formElement.reset();
            }
          }}
          class="space-y-4"
        >
          <input
            type="text"
            name="name"
            class="border p-2 w-full"
            placeholder="Task Name"
            required
          />
          <select
            name="priority"
            class="border p-2 w-full rounded shadow-sm bg-white pr-8 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <button
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add Task
          </button>
        </form>
      </div>
    `;
  }
}

@Shared("confetti-effect")
export class ConfettiEffect {
  render({ state, send }: RenderArgs<typeof taskManagerMachine>) {
    const { tasks } = state;
    const total = tasks.length;

    return html`
      <div class="relative h-64 overflow-hidden">
        <!-- Celebration Message -->
        <div class="text-center mt-16">
          <h3 class="text-2xl font-bold text-green-700">
            🎉 Congratulations! 🎉
          </h3>
          <p class="text-md text-gray-600">You completed all ${total} tasks!</p>
          <button
            @click=${() => send({ type: "RESET" })}
            class="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Reset Tasks
          </button>
        </div>
      </div>
    `;
  }
}

@Shared("task-manager")
export class TaskManager {
  render({ state }: RenderArgs<typeof taskManagerMachine>) {
    const isCompleted = state.matches("completed");

    return html`
      <div class="p-4 space-y-4 max-w-fit mx-auto">
        ${isCompleted
          ? html`<confetti-effect></confetti-effect>`
          : html`
              <task-list></task-list>
              <progress-bar></progress-bar>
              <task-form></task-form>
            `}
      </div>
    `;
  }
}
