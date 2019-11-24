import { SnapshotCreator } from '../snapshot-creator';
import { createAssertConfigRule } from '../../utils/testing-rules/assert-config';

describe('when providing configs', () => {
  const parserOptions = {
    ecmaVersion: 2017,
    sourceType: 'module',
  } as const;
  const code = '';
  const ruleName = 'ruleName';

  let snapshotCreator: SnapshotCreator;

  beforeEach(() => {
    snapshotCreator = new SnapshotCreator({
      parser: '@typescript-eslint/parser',
      parserOptions,
    });
  });

  it('can parse the filename correctly', () => {
    const wantFileName = 'want.filename.tsx';
    let gotFilename = '';
    const rule = createAssertConfigRule((context) => { gotFilename = context.getFilename(); });
    snapshotCreator
      .mark({ code, ruleName, rule })
      .withFileName(wantFileName)
      .render();
    expect(gotFilename).toEqual(wantFileName);
  });

  it('get <intpu> if the filename is not provided', () => {
    let gotFilename = '';
    const rule = createAssertConfigRule((context) => { gotFilename = context.getFilename(); });
    snapshotCreator
      .mark({ code, ruleName, rule })
      .render();
    expect(gotFilename).toEqual('<input>');
  });

  it('can add the settings', () => {
    let gotSettings = {};
    const wantSetting = { a: 1, b: 2, c: 3 };
    const rule = createAssertConfigRule((context) => { gotSettings = context.settings; });
    snapshotCreator
      .mark({ code, ruleName, rule })
      .overrideConfig({ settings: wantSetting })
      .render();
    expect(gotSettings).toEqual(wantSetting);
  });

  it('overrides ecmaVersion in parserOptions', () => {
    let gotParserOptions = {};
    const wantParserOptions = {
      ...parserOptions,
      ecmaVersion: 6,
    };
    const rule = createAssertConfigRule((context) => { gotParserOptions = context.parserOptions; });
    snapshotCreator
      .mark({ code: '', ruleName: 'assert-parser-options', rule })
      .overrideConfig({ parserOptions: { ecmaVersion: 6 } })
      .render();
    expect(gotParserOptions).toEqual(expect.objectContaining(wantParserOptions));
  });
});
