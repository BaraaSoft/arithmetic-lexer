import { StateError } from '../errors';
import {
  TokenType,
  TokenClassType,
  IntLexem,
  SemiLexem,
  SymbolLexem,
  ILexem,
  FloatLexem,
  OperatorLexem,
  ParenLexem,
  EqlLexem,
  EpsilonLexem,
  GenericLexem,
  EpsilonState,
  IntState,
  FloatState,
  SemiState,
  SymbolState,
  OperatorState,
  ParenState,
  GenericMatch,
  GenericEvent,
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
// State events
const epsilonState = new EpsilonState();
const intState = new IntState(/0-9/);
const floatState = new FloatState();
const semiState = new SemiState(/;/);
const symbolState = new SymbolState(/a-z/);
const operatorState = new OperatorState(/[+|-|\*|\/]/);
const parenState = new ParenState(/[\)|\()]/);
const eqlState = new EpsilonState(/[=]/);
// Generic events only
const alphanumericMatch = new GenericEvent(/[a-z0-9]/);
const dotMatch = new GenericEvent(/[.]/);
const charMatch = new GenericEvent(/[\s*]/);
transition
  .at(epsilonState)
  .add(isItMatch(alphanumericMatch).moveTo(symbolState))
  .at(symbolState)
  .add(
    isItMatch(alphanumericMatch).moveTo(symbolState),
    isItMatch(eqlState).moveTo(eqlState),
    isItMatch(parenState).moveTo(parenState),
    isItMatch(charMatch).moveTo(symbolState),
    isItMatch(operatorState).moveTo(operatorState),
  );
// machine.next(input())
const stateMachine = new Machine(transition).at('EPSILON');
stateMachine.next('10');
