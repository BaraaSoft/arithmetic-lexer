import { ILexem } from './ILexem';
import { TokenType, TokenClassType } from '../token';

export class IntLexem implements ILexem {
  public readonly tokenClass: TokenClassType = 'INT';
  public readonly tokenKey: typeof TokenType[TokenClassType] = 3;
  constructor(public readonly matchers: RegExp) {}
}

export class SymbolLexem implements ILexem {
  public readonly tokenClass: TokenClassType = 'SYMBOL';
  public readonly tokenKey: typeof TokenType[TokenClassType] = 3;
  constructor(public readonly matchers: RegExp) {}
}

export class SemiLexem implements ILexem {
  public readonly tokenClass: TokenClassType = 'SEMI';
  public readonly tokenKey: typeof TokenType[TokenClassType] = 5;
  constructor(public readonly matchers: RegExp) {}
}

export class EpsilonLexem implements ILexem {
  public readonly tokenClass: TokenClassType = 'EPSILON';
  public readonly tokenKey: typeof TokenType[TokenClassType] = 0;
  constructor(public readonly matchers: RegExp) {}
}
