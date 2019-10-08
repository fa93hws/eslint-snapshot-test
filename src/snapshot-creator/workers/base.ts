import { RuleModule, ValidTestCase, RuleTesterConfig } from '@typescript-eslint/experimental-utils/dist/ts-eslint'

type TestConfig<TOption extends readonly any[]> = Omit<ValidTestCase<TOption>, 'code'> & RuleTesterConfig;

export abstract class BaseWorker<TOption extends readonly any[]> {
  protected config: TestConfig<TOption>;
  protected rule?: RuleModule<any, TOption, any>;

  public constructor(config: RuleTesterConfig, protected readonly code: string) {
    this.config = config;
  }

  public withConfig(config: TestConfig<TOption>) {
    Object.assign(this.config, config);
    return this;
  }

  public onRule(rule: RuleModule<any, TOption, any>) {
    this.rule = rule;
    return this;
  }

  abstract render(): string;
}
