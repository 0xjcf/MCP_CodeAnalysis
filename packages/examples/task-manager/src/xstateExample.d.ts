import { RenderArgs } from 'ignite-element';
import { advancedMachine } from './advancedCounterMachine';
export declare class AdvancedSharedCounter {
    render({ state, send }: RenderArgs<typeof advancedMachine>): import("lit-html", { with: { "resolution-mode": "import" } }).TemplateResult<1>;
}
