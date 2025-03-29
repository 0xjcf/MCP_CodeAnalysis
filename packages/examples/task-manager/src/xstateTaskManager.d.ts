import { RenderArgs } from 'ignite-element';
import { taskManagerMachine } from './taskManagerMachine';
export declare class TaskList {
    render({ state, send }: RenderArgs<typeof taskManagerMachine>): import("lit-html", { with: { "resolution-mode": "import" } }).TemplateResult<1>;
}
export declare class ProgressBar {
    render({ state }: RenderArgs<typeof taskManagerMachine>): import("lit-html", { with: { "resolution-mode": "import" } }).TemplateResult<1>;
}
export declare class TaskForm {
    render({ send }: RenderArgs<typeof taskManagerMachine>): import("lit-html", { with: { "resolution-mode": "import" } }).TemplateResult<1>;
}
export declare class ConfettiEffect {
    render({ state, send }: RenderArgs<typeof taskManagerMachine>): import("lit-html", { with: { "resolution-mode": "import" } }).TemplateResult<1>;
}
export declare class TaskManager {
    render({ state }: RenderArgs<typeof taskManagerMachine>): import("lit-html", { with: { "resolution-mode": "import" } }).TemplateResult<1>;
}
