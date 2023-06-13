import { StateError } from '../errors';
import {
  TokenType,
  TokenClassType,
  ILexem,
  EpsilonState,
  IntState,
  FloatState,
  SemiState,
  SymbolState,
  OperatorState,
  ParenState,
  GenericEvent,
  EqlState,
} from '../Lexem';
import {
  Transition,
  isItMatch,
  ITransition,
} from '../transition';

export interface IMachine<
  S extends string,
  T extends ITransition<ILexem, T>,
> {
  from(transition: T): IMachine<S, T>;
  next(inputValue: S): ILexem['tokenClass'];
  transition?: T;
  currentState: ILexem['tokenClass'];
  at(start: ILexem['tokenClass']): IMachine<S, T>;
}

export class Machine<
  S extends string,
  T extends ITransition<ILexem, T>,
> implements IMachine<S, T>
{
  public currentState: ILexem['tokenClass'];
  constructor(public transition: T) {}
  from(transition: T): IMachine<S, T> {
    this.transition = transition;
    return this;
  }
  at(start: ILexem['tokenClass']) {
    this.currentState = start;
    return this;
  }
  next(inputValue: S): ILexem['tokenClass'] {
    const [, nextState] = this.transition.table[
      this.currentState
    ].find(([regex]) => regex.test(inputValue));
    if (!nextState) throw new StateError();
    this.currentState = nextState;
    return nextState;
  }
}

const transition = new Transition({});
// State Events. Will correspond to an actual state in the machine (State + Event)
const epsilonState = new EpsilonState();
const intState = new IntState(/0-9/);
const floatState = new FloatState();
const semiState = new SemiState(/;/);
const symbolState = new SymbolState(/a-z/);
const operatorState = new OperatorState(/[+|-|\*|\/]/);
const parenState = new ParenState(/[\)|\()]/);
const eqlState = new EqlState(/[=]/);
// Generic Events. These have no associated state in the machine (Event only)
const alphanumericEvent = new GenericEvent(/[a-z0-9]/);
const dotEvent = new GenericEvent(/[.]/);
const charEvent = new GenericEvent(/[\s*]/);
transition
  .at(epsilonState)
  .add(isItMatch(alphanumericEvent).moveTo(symbolState))
  .at(symbolState)
  .add(
    isItMatch(alphanumericEvent).moveTo(symbolState),
    isItMatch(eqlState).moveTo(eqlState),
    isItMatch(parenState).moveTo(parenState),
    isItMatch(charEvent).moveTo(symbolState),
    isItMatch(operatorState).moveTo(operatorState),
  );
// machine.next(input())
const stateMachine = new Machine(transition).at('EPSILON');
console.log(stateMachine.next('10'));
console.log(stateMachine.next('='));
