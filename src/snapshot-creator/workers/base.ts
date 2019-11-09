import { merge } from 'lodash';
import { RuleModule, ValidTestCase, RuleTesterConfig, Linter } from '@typescript-eslint/experimental-utils/dist/ts-eslint'

type TestConfig<TOption extends readonly any[]> = Omit<ValidTestCase<TOption>, 'code' | 'options'> & Partial<RuleTesterConfig>;

export abstract class BaseWorker<TOption extends readonly any[]> {
  protected ruleName?: string;
  protected ruleOption: TOption = [] as unknown as TOption;
  protected filename?: string;
  protected config: RuleTesterConfig;
  protected readonly code: string;
  protected readonly linter: Linter;

  public constructor({ config, code, linter }: {
    config: RuleTesterConfig;
    code: string;
    linter: Linter;
  }) {
    this.config = config;
    this.code = code;
    this.linter = linter;
  }

  public withOptions(options: TOption) {
    this.ruleOption = options;
    return this;
  }

  public overrideConfig(config: TestConfig<TOption>) {
    this.config = merge(this.config, config);
    config.filename != null && (this.filename = config.filename);
    return this;
  }

  public withFileName(fileName: string) {
    this.filename = fileName;
  }

  public onRule(ruleName: string, rule: RuleModule<any, TOption, any>) {
    this.linter.defineRule(ruleName, rule);
    this.ruleName = ruleName;
    return this;
  }

  abstract render(): string;
}
