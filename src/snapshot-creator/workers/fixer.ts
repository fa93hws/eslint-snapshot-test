import { assertExist } from '../../utils/preconditions';
import { BaseWorker } from './base';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class FixWorker<TOption extends readonly any[]> extends BaseWorker<
  TOption
> {
  render() {
    assertExist(this.ruleName, 'rule name must not be empty');
    const fixReport = this.linter.verifyAndFix(
      this.code,
      {
        ...this.config,
        rules: { [this.ruleName]: this.ruleOption },
      },
      this.filename,
    );
    return {
      lintMessages: fixReport.messages,
      snapshot: fixReport.output,
    };
  }
}
