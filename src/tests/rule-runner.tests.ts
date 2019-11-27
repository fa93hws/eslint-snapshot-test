import { Linter } from '@typescript-eslint/experimental-utils/dist/ts-eslint';
import { RuleRunner } from '../rule-runner';
import { SnapshotCreator } from '../index';
import { createAssertConfigRule } from '../utils/testing-rules/assert-config';

describe('ruleRunner', () => {
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
      const rule = createAssertConfigRule(context => {
        gotFilename = context.getFilename();
      });
      snapshotCreator
        .mark({ code, ruleName, rule })
        .withFileName(wantFileName)
        .render();
      expect(gotFilename).toEqual(wantFileName);
    });

    it('get <intpu> if the filename is not provided', () => {
      let gotFilename = '';
      const rule = createAssertConfigRule(context => {
        gotFilename = context.getFilename();
      });
      snapshotCreator.mark({ code, ruleName, rule }).render();
      expect(gotFilename).toEqual('<input>');
    });

    it('can add the settings', () => {
      let gotSettings = {};
      const wantSetting = { a: 1, b: 2, c: 3 };
      const rule = createAssertConfigRule(context => {
        gotSettings = context.settings;
      });
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
      const rule = createAssertConfigRule(context => {
        gotParserOptions = context.parserOptions;
      });
      snapshotCreator
        .mark({ code: '', ruleName: 'assert-parser-options', rule })
        .overrideConfig({ parserOptions: { ecmaVersion: 6 } })
        .render();
      expect(gotParserOptions).toEqual(
        expect.objectContaining(wantParserOptions),
      );
    });
  });

  describe('when calling render', () => {
    const markResult = jest.fn();

    function mockLinter({
      lintMessages,
      fixReport,
    }: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      lintMessages: readonly any[];
      fixReport?: { output: string };
    }): Linter {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const linter: any = {
        verify: () => lintMessages,
        verifyAndFix: () => fixReport,
        getRules: () => ({
          get: () => ({
            meta: {
              fixable: fixReport == null ? false : 'code',
            },
          }),
        }),
      };
      return (linter as unknown) as Linter;
    }

    function createRuleRunner({
      code = '',
      fixReport,
      lintMessages,
    }: {
      code?: string;
      fixReport?: { output: string };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      lintMessages: readonly any[];
    }) {
      return new RuleRunner({
        code,
        config: { parser: 'any' },
        linter: mockLinter({ lintMessages, fixReport }),
        ruleName: 'any',
        markResult,
      });
    }

    beforeEach(() => {
      markResult.mockClear();
    });

    it('returns lintMessages if the rule is not fixable', () => {
      const ruleRunner = createRuleRunner({ lintMessages: [{ a: 1 }] });
      const { lintMessages } = ruleRunner.render();
      expect(lintMessages).toEqual([{ a: 1 }]);
    });

    it('returns empty fixedOutput if the rule is not fixable', () => {
      const ruleRunner = createRuleRunner({ lintMessages: [{ a: 1 }] });
      const { fixedOutput } = ruleRunner.render();
      expect(fixedOutput).toEqual(undefined);
    });

    it('returns the snapshot from markResult', () => {
      markResult.mockReturnValue('return value');
      const ruleRunner = createRuleRunner({ lintMessages: [{ a: 1 }] });
      const { snapshot } = ruleRunner.render();
      expect(snapshot).toEqual('return value');
    });

    it('returns the lintMessages if the rule is fixable', () => {
      const ruleRunner = createRuleRunner({
        lintMessages: [{ a: 1 }],
        fixReport: { output: 'fixed' },
      });
      const { lintMessages } = ruleRunner.render();
      expect(lintMessages).toEqual([{ a: 1 }]);
    });

    it('returns the fixedSnapshot if the rule is fixable', () => {
      const ruleRunner = createRuleRunner({
        lintMessages: [{ a: 1 }],
        fixReport: { output: 'fixed' },
      });
      const { fixedOutput } = ruleRunner.render();
      expect(fixedOutput).toEqual('fixed');
    });

    it('returns the snapshot from markResult if the rule is fixable', () => {
      markResult.mockReturnValue('return value');
      const ruleRunner = createRuleRunner({
        lintMessages: [{ a: 1 }],
        fixReport: { output: 'fixed' },
      });
      const { snapshot } = ruleRunner.render();
      expect(snapshot).toEqual('return value');
    });
  });
});
