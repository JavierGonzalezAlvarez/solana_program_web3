import * as borsh from 'borsh';

export class Token {
    lamports = 0;

    constructor(fields: {lamports: number} | undefined = undefined) {
      if (fields) {
        this.lamports = fields.lamports;      
      }
    }
}

export const TotalTokensSchema = new Map([
    [Token, {kind: 'struct', fields: [['lamports', 'u32']]}],
]);
  

export const SIZE = borsh.serialize(
    TotalTokensSchema,
    new Token({ lamports: 50891949 }),
).length;


  