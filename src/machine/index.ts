import { StateError } from '../errors';
import {
  TokenType,
  TokenClassType,
  IntLexem,
  SemiLexem,
  SymbolLexem,
} from '../Lexem';
import { Transition, isItMatch } from '../transition';

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
machine.from(transition);
