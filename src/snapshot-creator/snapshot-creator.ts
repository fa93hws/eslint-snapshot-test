import { RuleTesterConfig, Linter, RuleModule } from '@typescript-eslint/experimental-utils/dist/ts-eslint'
import { ErrorMarker } from './workers/error-marker';

export class SnapshotCreator {
  private readonly linter: Linter = new Linter();
  public constructor(private readonly config: RuleTesterConfig) {
    this.linter.defineParser(config.parser, require(config.parser));
  }

  public mark<TOption extends readonly any[]>({ code, ruleName, rule }: {
    code: string;
    ruleName: string;
    rule: RuleModule<any, TOption, any>
  }) {
    if (!this.linter.getRules().has(ruleName)) {
      this.linter.defineRule(ruleName, rule);
    }
    return new ErrorMarker<TOption>({
      code,
      ruleName,
      linter: this.linter,
      config: this.config,
    });
  }
}
