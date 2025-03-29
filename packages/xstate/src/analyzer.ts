/**
 * XState analyzer for state machine analysis
 * @module @mcp/xstate
 */

import { Analyzer, AnalysisOptions, AnalysisResult } from '@mcp/types';
import { createMachine, AnyStateMachine } from 'xstate';

export interface XStateAnalysisData {
  machineDefinition?: object;
  states: string[];
  events: string[];
  transitions: Array<{
    source: string;
    target: string;
    event: string;
  }>;
  services: Array<{
    name: string;
    type: string;
    implementation?: string;
  }>;
  guards: Array<{
    name: string;
    implementation?: string;
  }>;
  actions: Array<{
    name: string;
    implementation?: string;
  }>;
  performance: {
    stateCount: number;
    transitionCount: number;
    serviceCount: number;
    complexity: 'low' | 'medium' | 'high';
  };
}

export class XStateAnalyzer implements Analyzer {
  private options: AnalysisOptions;

  constructor(options: AnalysisOptions = { sourceCode: '' }) {
    this.options = {
      strict: true,
      verbose: false,
      timeout: 5000,
      ...options,
    };
  }

  async analyze(options: AnalysisOptions): Promise<AnalysisResult> {
    try {
      const { sourceCode } = options;
      const machine = this.parseStateMachine(sourceCode);
      const analysis = this.analyzeStateMachine(machine);

      // Calculate performance metrics
      const stateCount = analysis.states.length;
      const transitionCount = analysis.transitions.length;
      const serviceCount = analysis.services.length;
      const complexity =
        stateCount + transitionCount + serviceCount <= 5
          ? 'low'
          : stateCount + transitionCount + serviceCount <= 15
            ? 'medium'
            : 'high';

      return {
        success: true,
        data: {
          ...analysis,
          performance: {
            stateCount,
            transitionCount,
            serviceCount,
            complexity,
          },
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  private parseStateMachine(source: string): AnyStateMachine {
    try {
      // Create a temporary module context
      const moduleContext = {
        exports: {} as Record<string, unknown>,
        createMachine,
      };

      // Extract the machine definition from the source code
      const machineDefMatch = source.match(/createMachine\(\s*({[\s\S]*})\s*\)/);
      if (!machineDefMatch) {
        throw new Error('No state machine definition found in source code');
      }

      const machineConfig = machineDefMatch[1];

      // Wrap the machine config in a module-like structure
      const wrappedSource = `
        const exports = moduleContext.exports;
        const createMachine = moduleContext.createMachine;
        exports.machine = createMachine(${machineConfig});
      `;

      // Evaluate the source code in the context
      const fn = new Function('moduleContext', wrappedSource);
      fn(moduleContext);

      // Find the state machine definition
      let machine: AnyStateMachine | undefined;

      // Check exports object
      if (moduleContext.exports.machine && typeof moduleContext.exports.machine === 'object') {
        machine = moduleContext.exports.machine as AnyStateMachine;
      }

      if (!machine) {
        throw new Error('No state machine found in source code');
      }

      // Ensure the machine is properly initialized
      if (!machine.states) {
        throw new Error('Invalid state machine: missing states');
      }

      return machine;
    } catch (error) {
      throw new Error(
        `Failed to parse state machine: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  private analyzeStateMachine(machine: AnyStateMachine): XStateAnalysisData {
    const states = Object.keys(machine.states);
    const transitions: XStateAnalysisData['transitions'] = [];
    const services: XStateAnalysisData['services'] = [];
    const guards: XStateAnalysisData['guards'] = [];
    const actions: XStateAnalysisData['actions'] = [];
    const events = new Set<string>();

    // Helper function to extract actions from a transition config
    const extractActions = (config: any) => {
      if (!config || !config.actions) return [];
      return Array.isArray(config.actions) ? config.actions : [config.actions];
    };

    // Analyze each state
    for (const state of states) {
      const stateNode = machine.states[state];

      // Analyze transitions
      if (stateNode.on) {
        for (const [event, transition] of Object.entries(stateNode.on)) {
          events.add(event);
          const transitionConfig = Array.isArray(transition) ? transition[0] : transition;
          const target =
            typeof transitionConfig.target === 'string'
              ? transitionConfig.target
              : Array.isArray(transitionConfig.target)
                ? transitionConfig.target[0]
                : state;

          transitions.push({
            source: state,
            target: typeof target === 'string' ? target : target.key,
            event,
          });

          // Collect actions from transitions
          const transitionActions = extractActions(transitionConfig);
          for (const action of transitionActions) {
            if (!actions.some(a => a.name === String(action))) {
              actions.push({
                name: String(action),
              });
            }
          }
        }
      }

      // Analyze services
      if (stateNode.invoke) {
        const serviceConfigs = Array.isArray(stateNode.invoke)
          ? stateNode.invoke
          : [stateNode.invoke];

        for (const service of serviceConfigs) {
          const serviceName = typeof service.src === 'string' ? service.src : 'anonymous';

          services.push({
            name: serviceName,
            type: typeof service.src === 'string' ? 'external' : 'internal',
            implementation: typeof service.src === 'string' ? service.src : undefined,
          });

          // Collect actions from service callbacks
          if (typeof service.onDone === 'object') {
            const doneActions = extractActions(service.onDone);
            for (const action of doneActions) {
              if (!actions.some(a => a.name === String(action))) {
                actions.push({
                  name: String(action),
                });
              }
            }
          }

          if (typeof service.onError === 'object') {
            const errorActions = extractActions(service.onError);
            for (const action of errorActions) {
              if (!actions.some(a => a.name === String(action))) {
                actions.push({
                  name: String(action),
                });
              }
            }
          }
        }
      }
    }

    return {
      machineDefinition: machine,
      states,
      events: Array.from(events),
      transitions,
      services,
      guards,
      actions,
      performance: {
        stateCount: states.length,
        transitionCount: transitions.length,
        serviceCount: services.length,
        complexity: 'low',
      },
    };
  }
}
