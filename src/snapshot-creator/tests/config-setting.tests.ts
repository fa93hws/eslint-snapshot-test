import { SnapshotCreator } from '../snapshot-creator';
const semiRule = require('eslint/lib/rules/semi');

describe('when set the config', () => {
  const snapshotCreator = new SnapshotCreator({
    parserOptions: {
      ecmaVersion: 2017,
      sourceType: 'module',
    },
    parser: '@typescript-eslint/parser',
  });
  const code = 'const a = 1';
  const config = {
    options: ['always'],
  };

  it('should combine the config to worker', () => {
    snapshotCreator
      .mark(code)
      .onRule(semiRule)
      .withConfig(config);

    expect((snapshotCreator as any).config).toEqual({
      parserOptions: {
        ecmaVersion: 2017,
        sourceType: 'module',
      },
      parser: '@typescript-eslint/parser',
      options: ['always'],
    });
  });
});
