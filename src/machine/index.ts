import { StateError } from '../errors';
import {
  TokenType,
  TokenClassType,
  IntLexem,
  SemiLexem,
  SymbolLexem,
  ILexem,
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
  at(start: ILexem['tokenClass']): void;
}

export class Machine<
  S extends string,
  T extends ITransition<ILexem, T>,
> implements IMachine<S, T>
{
  public currentState: ILexem['tokenClass'];
  constructor(public transition?: T) {}
  from(transition: T): IMachine<S, T> {
    this.transition = transition;
    return this;
  }
  at(start: ILexem['tokenClass']) {
    this.currentState = start;
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

const intLexem = new IntLexem(/0-9/);
const semiLexem = new SemiLexem(/;/);
const symbolLexem = new SymbolLexem(/a-z/);

transition
  .at(symbolLexem)
  .add(
    isItMatch(intLexem).moveTo(intLexem),
    isItMatch(semiLexem).moveTo(symbolLexem),
  );
// machine.next(input())
const stateMachine = new Machine();
stateMachine.from(transition).at('EPSILON');
stateMachine.next();
