import { EOL } from 'os';
import { TSESLint } from '@typescript-eslint/utils';
import merge from 'lodash.merge';
import { PositionHelper } from './position-helper';
import { assertExist } from './utils/preconditions';
import { markResult as _markResult, MarkResultFn } from './mark-result';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TestConfig<TOption extends readonly any[]> = Omit<
  TSESLint.ValidTestCase<TOption>,
  'code' | 'options' | 'filename'
> &
  Partial<TSESLint.RuleTesterConfig>;

export type RenderResult = {
  snapshot: string;
  lintMessages: TSESLint.Linter.LintMessage[];
  fixedOutput: string | undefined;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class RuleRunner<TOption extends readonly any[]> {
  private _codeLines?: readonly string[];

  private ruleName: string;

  private ruleOption: TSESLint.Linter.RuleLevelAndOptions = ['error'];

  private filename?: string;

  private config: TSESLint.RuleTesterConfig;

  private readonly code: string;

  private readonly linter: TSESLint.Linter;

  private readonly positionHelper: PositionHelper;

  private readonly markResult: MarkResultFn;

  public constructor({
    code,
    config,
    linter,
    ruleName,
    markResult = _markResult,
  }: {
    code: string;
    linter: TSESLint.Linter;
    ruleName: string;
    config: TSESLint.RuleTesterConfig;
    markResult?: MarkResultFn;
  }) {
    this.code = code;
    this.config = config;
    this.linter = linter;
    this.ruleName = ruleName;
    this.markResult = markResult;
    this.positionHelper = new PositionHelper(this.codeLines);
  }

  private get codeLines() {
    if (this._codeLines == null) {
      this._codeLines = this.code.split(EOL);
    }
    return this._codeLines;
  }

  public withOptions(options: TOption): RuleRunner<TOption> {
    this.ruleOption = ['error', ...options];
    return this;
  }

  public overrideConfig(config: TestConfig<TOption>): RuleRunner<TOption> {
    this.config = merge(this.config, config);
    return this;
  }

  public withFileName(fileName: string): RuleRunner<TOption> {
    this.filename = fileName;
    return this;
  }

  private get parameter(): [
    string,
    TSESLint.Linter.Config,
    { filename?: string },
  ] {
    return [
      this.code,
      {
        ...this.config,
        rules: { [this.ruleName]: this.ruleOption },
      },
      { filename: this.filename },
    ];
  }

  public render(): {
    lintMessages: TSESLint.Linter.LintMessage[];
    snapshot: string;
    fixedOutput?: string;
  } {
    assertExist(this.ruleName, 'rule name must not be empty');
    const rule = this.linter.getRules().get(this.ruleName);
    assertExist(rule, `rule not found with name ${this.ruleName}`);
    const lintResult = this.linter.verify(...this.parameter);

    const fixReport = rule.meta?.fixable
      ? this.linter.verifyAndFix(...this.parameter)
      : undefined;

    const markedResult = this.markResult({
      lintResult,
      positionHelper: this.positionHelper,
      codeLines: this.codeLines,
    });
    return {
      lintMessages: lintResult,
      snapshot: markedResult,
      fixedOutput: fixReport?.output,
    };
  }
}
