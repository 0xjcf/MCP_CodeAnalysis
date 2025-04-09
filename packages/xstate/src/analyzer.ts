/**
 * XState analyzer for state machine analysis
 * @module @mcp/xstate
 */

import {
  createMachine,
  type StateNodeConfig,
  ProvidedActor,
  ParameterizedObject,
  EventObject,
  AnyEventObject,
} from 'xstate';

import type { IXStateAnalysisData, IAnalyzerOptions, IAnalyzerResult } from './types.js';

interface MachineContext {
  [key: string]: unknown;
}

type MachineConfig = StateNodeConfig<
  MachineContext,
  AnyEventObject,
  ProvidedActor,
  ParameterizedObject,
  ParameterizedObject,
  string,
  string,
  string,
  EventObject,
  EventObject
>;

type TransitionConfig = string | Array<unknown> | Record<string, unknown>;

export class XStateAnalyzer {
  constructor() {}

  private parseMachineConfig(sourceCode: string): MachineConfig {
    if (!sourceCode || typeof sourceCode !== 'string') {
      throw new Error('Invalid source code: must be a non-empty string');
    }

    // Try to parse as JSON first
    try {
      const parsed = JSON.parse(sourceCode);
      if (typeof parsed !== 'object' || parsed === null) {
        throw new Error('Invalid machine configuration: must be an object');
      }
      return parsed as MachineConfig;
    } catch {
      // Not JSON, try to extract machine config
      const cleanSource = sourceCode
        .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '') // Remove comments
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();

      // Find the machine configuration
      const match = cleanSource.match(/createMachine\s*\(\s*({[^]*?})\s*\)/);
      if (!match) {
        // Try to find just the configuration object
        const configMatch = cleanSource.match(/(?:machine\s*=\s*)?({[^]*})/);
        if (!configMatch) {
          throw new Error('No machine configuration found');
        }
        const parsed = this.parseConfig(configMatch[1] || '{}');
        if (typeof parsed !== 'object' || parsed === null) {
          throw new Error('Invalid machine configuration: must be an object');
        }
        return parsed;
      }
      const parsed = this.parseConfig(match[1] || '{}');
      if (typeof parsed !== 'object' || parsed === null) {
        throw new Error('Invalid machine configuration: must be an object');
      }
      return parsed;
    }
  }

  private parseConfig(configStr: string): MachineConfig {
    if (!configStr || typeof configStr !== 'string') {
      throw new Error('Invalid configuration string');
    }

    // Convert JavaScript object literal to valid JSON
    const jsonStr = configStr
      .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":') // Quote property names
      .replace(/'/g, '"') // Convert single quotes to double quotes
      .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
      .replace(/undefined/g, 'null'); // Convert undefined to null

    try {
      const parsed = JSON.parse(jsonStr);
      if (typeof parsed !== 'object' || parsed === null) {
        throw new Error('Invalid machine configuration: must be an object');
      }
      return parsed as MachineConfig;
    } catch (error) {
      throw new Error(
        `Invalid machine configuration: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  private getTransitionTarget(transition: TransitionConfig, defaultState: string): string {
    if (typeof transition === 'string') {
      return transition;
    }

    if (Array.isArray(transition) && transition.length > 0) {
      const firstTransition = transition[0];
      if (typeof firstTransition === 'string') {
        return firstTransition;
      }

      if (firstTransition && typeof firstTransition === 'object') {
        const target = (firstTransition as Record<string, unknown>).target;
        if (Array.isArray(target) && target.length > 0) {
          const firstTarget = target[0];
          if (firstTarget && typeof firstTarget === 'object' && 'key' in firstTarget) {
            const key = (firstTarget as { key?: string }).key;
            return key || defaultState;
          }
        }
        if (typeof target === 'string') {
          return target;
        }
        return defaultState;
      }
      return defaultState;
    }

    if (transition && typeof transition === 'object') {
      const target = (transition as Record<string, unknown>).target;
      if (Array.isArray(target) && target.length > 0) {
        const firstTarget = target[0];
        if (firstTarget && typeof firstTarget === 'object' && 'key' in firstTarget) {
          const key = (firstTarget as { key?: string }).key;
          return key || defaultState;
        }
      }
      if (typeof target === 'string') {
        return target;
      }
      return defaultState;
    }

    return defaultState;
  }

  async analyze(options: IAnalyzerOptions): Promise<IAnalyzerResult> {
    try {
      const { sourceCode } = options;

      if (!sourceCode || typeof sourceCode !== 'string') {
        return {
          success: false,
          error: 'Invalid source code: must be a non-empty string',
        };
      }

      // Parse the machine configuration
      const config = await Promise.resolve(this.parseMachineConfig(sourceCode));

      if (!config || typeof config !== 'object') {
        return {
          success: false,
          error: 'Failed to parse machine configuration',
        };
      }

      const machine = createMachine(config);

      // Analyze the machine
      const states = Object.keys(machine.states || {});
      const events = new Set<string>();
      const transitions: IXStateAnalysisData['transitions'] = [];
      const services: IXStateAnalysisData['services'] = [];
      const guards: IXStateAnalysisData['guards'] = [];
      const actions: IXStateAnalysisData['actions'] = [];

      // Analyze each state
      for (const state of states) {
        const stateNode = machine.states?.[state];
        if (!stateNode) continue;

        // Analyze transitions
        if (stateNode.on) {
          for (const [event, transition] of Object.entries(stateNode.on)) {
            events.add(event);
            const target = this.getTransitionTarget(transition as TransitionConfig, state);
            transitions.push({
              source: state,
              target,
              event,
            });
          }
        }
      }

      // Calculate metrics
      const stateCount = states.length;
      const transitionCount = transitions.length;
      const serviceCount = services.length;
      const guardCount = guards.length;
      const actionCount = actions.length;
      const complexityScore = this.calculateComplexityScore(
        stateCount,
        transitionCount,
        serviceCount,
      );
      const complexityLevel =
        complexityScore < 10 ? 'low' : complexityScore < 20 ? 'medium' : 'high';

      return {
        success: true,
        data: {
          states,
          events: Array.from(events),
          transitions,
          services,
          guards,
          actions,
          metrics: {
            stateCount,
            transitionCount,
            serviceCount,
            guardCount,
            actionCount,
            complexityScore,
            complexityLevel,
          },
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  private calculateComplexityScore(
    stateCount: number,
    transitionCount: number,
    serviceCount: number,
  ): number {
    return Math.round(
      (stateCount * 2 + transitionCount * 1.5 + serviceCount * 3) / (stateCount || 1),
    );
  }
}
