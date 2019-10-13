import { SnapshotCreator } from "../snapshot-creator";
const semi = require('eslint/lib/rules/semi');

describe('when marking error to snapshot', () => {
  const snapshotCreator = new SnapshotCreator({
    parserOptions: {
      ecmaVersion: 2017,
      sourceType: 'module',
    },
    parser: '@typescript-eslint/parser',
  });
  const code = 'const a = 1';

  it('should generate the snapshot correctly', () => {
    snapshotCreator.mark(code)
    .onRule(semi)
    .withOptions(['error'])
    .render();

    expect(1).toBe(1);
  });
});
