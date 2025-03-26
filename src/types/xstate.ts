export interface StateMachine<TContext = any, TEvent = any, TState = any> {
  id: string;
  initial: string;
  context: TContext;
  states: Record<string, any>;
}

export interface StateNode {
  id: string;
  type: string;
  key: string;
  path: string[];
  initial?: string;
  states?: Record<string, StateNode>;
  on?: Record<string, any>;
  entry?: any[];
  exit?: any[];
  meta?: any;
  data?: any;
}

export interface Transition {
  target: string;
  actions?: any[];
  cond?: any;
  event?: string;
}

export interface Guard {
  type: string;
  name: string;
  predicate: (context: any, event: any) => boolean;
}

export interface Action {
  type: string;
  exec: (context: any, event: any) => void;
}
