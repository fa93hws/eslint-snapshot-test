import { RuleModule, ValidTestCase } from '@typescript-eslint/experimental-utils/dist/ts-eslint'

export const enum WorkerType {
  MARK,
  FIX,
}

type TestConfig<TOption extends readonly any[]> = Omit<ValidTestCase<TOption>, 'code'>;

export class Worker<TOption extends readonly any[]> {
  private ruleConfig: TestConfig<TOption> = {};
  private rule?: RuleModule<any, TOption, any>;
  private readonly type: WorkerType;

  public constructor(type: WorkerType) {
    this.type = type;
  }

  public withConfig(config: TestConfig<TOption>) {
    this.ruleConfig = config;
    return this;
  }

  public onRule(rule: RuleModule<any, TOption, any>) {
    this.rule = rule;
    return this;
  }
}
