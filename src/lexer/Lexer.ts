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
  add(T): ITransition<T>;
}

export class Transition<T extends ReturnType<typeof from>>
  implements ITransition<T>
{
  constructor(private table = {}) {}

  public add(fromToState: ReturnType<T['to']>) {
    console.log(fromToState);
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

transition.add(
  from(new IntLexem(/0-9/))
    .to(TokenType.INT)
    .to(TokenType.SEMI),
);
