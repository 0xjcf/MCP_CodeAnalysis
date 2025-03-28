/**
 * XState analyzer for state machine analysis
 * @module @mcp/xstate
 */

import { Analyzer, AnalysisResult, AnalysisOptions } from '@mcp/core';
import { createMachine, AnyStateMachine } from 'xstate';
import { inspect } from '@xstate/inspect';

export interface XStateAnalysisData {
  states: string[];
  transitions: Array<{
    from: string;
    to: string;
    event: string;
    guards?: string[];
    actions?: string[];
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

  constructor(options: AnalysisOptions = {}) {
    this.options = {
      strict: true,
      verbose: false,
      timeout: 5000,
      ...options,
    };
  }

  async analyze(source: string): Promise<AnalysisResult> {
    try {
      // Parse the source code to extract the state machine definition
      const machine = this.parseStateMachine(source);

      // Analyze the state machine
      const analysis = this.analyzeStateMachine(machine);

      return {
        success: true,
        data: analysis,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        errors: [error instanceof Error ? error : new Error(String(error))],
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
          const transitionConfig = Array.isArray(transition) ? transition[0] : transition;
          const target =
            typeof transitionConfig.target === 'string'
              ? transitionConfig.target
              : Array.isArray(transitionConfig.target)
                ? transitionConfig.target[0]
                : state;

          transitions.push({
            from: state,
            to: target,
            event,
            guards: transitionConfig.guard ? [String(transitionConfig.guard)] : undefined,
            actions: transitionConfig.actions ? transitionConfig.actions.map(String) : undefined,
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

    // Calculate performance metrics
    const performance = {
      stateCount: states.length,
      transitionCount: transitions.length,
      serviceCount: services.length,
      complexity: this.calculateComplexity(states.length, transitions.length, services.length),
    };

    return {
      states,
      transitions,
      services,
      guards,
      actions,
      performance,
    };
  }

  private calculateComplexity(
    stateCount: number,
    transitionCount: number,
    serviceCount: number,
  ): 'low' | 'medium' | 'high' {
    const complexityScore = stateCount * 2 + transitionCount + serviceCount * 3;

    if (complexityScore < 10) return 'low';
    if (complexityScore < 30) return 'medium';
    return 'high';
  }
}
