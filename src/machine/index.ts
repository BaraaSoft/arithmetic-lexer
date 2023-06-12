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
  T extends ITransition<ILexem, T>,
> {
  from(fromState: T): IMachine<T>;
}

export class Machine<T extends ITransition<ILexem, T>>
  implements IMachine<T>
{
  from(fromState: T): IMachine<T> {
    throw new Error('Method not implemented.');
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
// machine().from()
const stateMachine = new Machine();
stateMachine.from(transition);
