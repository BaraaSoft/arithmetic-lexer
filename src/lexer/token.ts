export const TokenType = {
  SYMBOL: 1,
  EPSILON: 0,
  EQL: 2,
  INT: 3,
  FLOAT: 4,
  SEMI: 5,
  PAREN: 6,
  OPERATOR: 7,
} as const;

export type TokenClassType = keyof typeof TokenType;
export type TokenKey = typeof TokenType[TokenClassType];
