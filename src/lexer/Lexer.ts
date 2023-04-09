import {
  EpsilonLexem,
  IntLexem,
  SymbolLexem,
  SemiLexem,
  ILexem,
} from './Lexem';
import {
  TokenClassType,
  TokenKey,
  TokenType,
} from './token';

export interface ITransition<T> {
  add(...fromState: any[]): ITransition<T>;
  at(state: any): ITransition<T>;
}

export class Transition<
  U extends ILexem,
  T extends ReturnType<typeof isItMatch>,
> implements ITransition<T>
{
  constructor(private table = {}) {}
  private atSate: U[] = [];

  public add(...fromToState: ReturnType<T['moveTo']>[]) {
    const orgState = this.atSate.pop();
    console.log(fromToState);
    return this;
  }
  public at(originState: U) {
    this.atSate.push(originState);
    return this;
  }
}

export interface LexemToStateType<T extends ILexem> {
  lexem: T;
  toStates: T[];
}
export interface FromReturnType<
  T extends LexemToStateType<ILexem>,
> {
  moveTo(toState: ILexem): FromReturnType<T>;
  __lexemToState: T;
}

export const isItMatch = <T extends ILexem>(
  lexem: T,
): FromReturnType<LexemToStateType<T>> => {
  let lexemToState: LexemToStateType<T> = {
    lexem,
    toStates: [],
  };
  return {
    moveTo(toState: T) {
      lexemToState.toStates.push(toState);
      return this;
    },
    __lexemToState: lexemToState,
  };
};

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
