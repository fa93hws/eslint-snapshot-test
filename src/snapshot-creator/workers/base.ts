import { merge } from 'lodash';
import { RuleModule, ValidTestCase, RuleTesterConfig, Linter } from '@typescript-eslint/experimental-utils/dist/ts-eslint'

type TestConfig<TOption extends readonly any[]> = Omit<ValidTestCase<TOption>, 'code' | 'options'> & Partial<RuleTesterConfig>;

export abstract class BaseWorker<TOption extends readonly any[]> {
  protected rule?: RuleModule<any, TOption, any>;
  protected readonly linter: Linter = new Linter();
  protected ruleOption: TOption = [] as unknown as TOption;
  protected filename?: string;

  public constructor(protected config: RuleTesterConfig, protected readonly code: string) {
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

  public onRule(rule: RuleModule<any, TOption, any>) {
    this.rule = rule;
    return this;
  }

  abstract render(): string;
}
