import { AnyStateMachine, StateNode, TransitionDefinition, EventObject } from 'xstate';

export interface XStateAnalysisResult {
  stateCount: number;
  transitionCount: number;
  guardCount: number;
  actionCount: number;
  serviceCount: number;
  hasParallelStates: boolean;
  hasHistoryStates: boolean;
  hasFinalStates: boolean;
  complexity: number;
}

export class XStateAnalyzer {
  private machine: AnyStateMachine;

  constructor(machine: AnyStateMachine) {
    this.machine = machine;
  }

  analyze(): XStateAnalysisResult {
    const states = this.getAllStates(this.machine.root);

    return {
      stateCount: states.length - 1, // Exclude root state
      transitionCount: this.countTransitions(states),
      guardCount: this.countGuards(states),
      actionCount: this.countActions(states),
      serviceCount: this.countServices(states),
      hasParallelStates: this.hasParallelStates(states),
      hasHistoryStates: this.hasHistoryStates(states),
      hasFinalStates: this.hasFinalStates(states),
      complexity: this.calculateComplexity(states),
    };
  }

  private getAllStates(node: StateNode): StateNode[] {
    const states: StateNode[] = [node];
    for (const child of Object.values(node.states)) {
      states.push(...this.getAllStates(child));
    }
    return states;
  }

  private countTransitions(states: StateNode[]): number {
    return states.reduce((count, state) => count + Object.keys(state.on || {}).length, 0);
  }

  private countGuards(states: StateNode[]): number {
    return states.reduce((count, state) => {
      const transitions = Object.values(state.on || {}).flat() as TransitionDefinition<
        any,
        EventObject
      >[];
      return (
        count +
        transitions.reduce((guardCount, transition) => {
          const hasGuard =
            ('guards' in transition &&
              Array.isArray(transition.guards) &&
              transition.guards.length > 0) ||
            ('guard' in transition && transition.guard !== undefined);
          return guardCount + (hasGuard ? 1 : 0);
        }, 0)
      );
    }, 0);
  }

  private countActions(states: StateNode[]): number {
    return states.reduce((count, state) => {
      const actions = state.entry || [];
      return count + actions.length;
    }, 0);
  }

  private countServices(states: StateNode[]): number {
    return states.reduce((count, state) => {
      const services = state.invoke || [];
      return count + services.length;
    }, 0);
  }

  private hasParallelStates(states: StateNode[]): boolean {
    return states.some(state => state.type === 'parallel');
  }

  private hasHistoryStates(states: StateNode[]): boolean {
    return states.some(state => state.type === 'history');
  }

  private hasFinalStates(states: StateNode[]): boolean {
    return states.some(state => state.type === 'final');
  }

  private calculateComplexity(states: StateNode[]): number {
    return states.reduce((complexity, state) => {
      const transitions = Object.keys(state.on || {}).length;
      const actions = (state.entry || []).length;
      const services = (state.invoke || []).length;
      const guards = Object.values(state.on || {}).reduce((guardCount, transitions) => {
        const transitionArray = Array.isArray(transitions) ? transitions : [transitions];
        return (
          guardCount +
          transitionArray.reduce((count, transition) => {
            const hasGuard =
              ('guards' in transition &&
                Array.isArray(transition.guards) &&
                transition.guards.length > 0) ||
              ('guard' in transition && transition.guard !== undefined);
            return count + (hasGuard ? 1 : 0);
          }, 0)
        );
      }, 0);
      return complexity + transitions + actions + services + guards;
    }, 0);
  }
}
