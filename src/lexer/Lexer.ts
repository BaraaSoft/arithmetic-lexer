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
  T extends ReturnType<typeof from>,
> implements ITransition<T>
{
  constructor(private table = {}) {}
  private atSate: U[] = [];

  public add(...fromToState: ReturnType<T['to']>[]) {
    const orgState = this.atSate.pop();
    console.log(fromToState);
    return this;
  }
  public at(originState: U) {
    this.atSate.push(originState);
    return this;
  }
}

export interface LexemToStateType<
  T extends TokenKey,
  R extends ILexem,
> {
  lexem: R;
  toStates: T[];
}
export interface FromReturnType<LexemToStateType> {
  to(toState: TokenKey): FromReturnType<LexemToStateType>;
  __lexemToState: LexemToStateType;
}

export const from = <T extends TokenKey, R extends ILexem>(
  lexem: R,
): FromReturnType<LexemToStateType<T, R>> => {
  let lexemToState: LexemToStateType<T, R> = {
    lexem,
    toStates: [],
  };
  return {
    to(toState: T) {
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
    from(intLexem).to(TokenType.INT),
    from(semiLexem).to(TokenType.SEMI),
  );
