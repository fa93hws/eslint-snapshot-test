import { EOL } from 'os';
import { SnapshotCreator } from '../snapshot-creator';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const noUnusedVar = require('eslint/lib/rules/no-unused-vars');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const semi = require('eslint/lib/rules/semi');

describe('when marking error to snapshot', () => {
  const snapshotCreator = new SnapshotCreator({
    parserOptions: {
      ecmaVersion: 2017,
      sourceType: 'module',
    },
    parser: '@typescript-eslint/parser',
  });

  it('generates snapshot for one line code', () => {
    const code = 'var a = 1;';
    const result = snapshotCreator
      .mark({ code, ruleName: 'no-unused-var', rule: noUnusedVar })
      .render();
    expect(result).toMatchSnapshot();
  });

  it('generates snapshot with rule option', () => {
    const code = `a = 1;${EOL}var b = 2;`;
    const result = snapshotCreator
      .mark({ code, ruleName: 'no-unused-var', rule: noUnusedVar })
      .withOptions([{ vars: 'local' }])
      .render();
    expect(result).toMatchSnapshot();
  });

  it('generates snapshot for multiple one line error', () => {
    const code = `var a = 1;${EOL}var b = 1;${EOL}var foo = 1;${EOL}fn(b);`;
    const result = snapshotCreator
      .mark({ code, ruleName: 'no-unused-var', rule: noUnusedVar })
      .render();
    expect(result).toMatchSnapshot();
  });

  it('generates snapshot for the error at last column', () => {
    const code = 'var a = 1';
    const result = snapshotCreator
      .mark({ code, ruleName: 'semi', rule: semi })
      .render();
    expect(result).toMatchSnapshot();
  });
});