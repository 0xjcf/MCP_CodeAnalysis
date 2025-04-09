export interface IStateMachine<TContext = Record<string, unknown>> {
  id: string;
  initial: string;
  context: TContext;
  states: Record<string, IStateNode>;
}

export interface IStateNode {
  id: string;
  type: string;
  key: string;
  path: string[];
  initial?: string;
  states?: Record<string, IStateNode>;
  on?: Record<string, ITransition>;
  entry?: IAction[];
  exit?: IAction[];
  meta?: Record<string, unknown>;
  data?: Record<string, unknown>;
}

export interface ITransition {
  target: string;
  actions?: IAction[];
  cond?: IGuard;
  event?: string;
}

export interface IGuard<TContext = Record<string, unknown>, TEvent = Record<string, unknown>> {
  type: string;
  name: string;
  predicate: (context: TContext, event: TEvent) => boolean;
}

export interface IAction<TContext = Record<string, unknown>, TEvent = Record<string, unknown>> {
  type: string;
  exec: (context: TContext, event: TEvent) => void;
}
