import { Linter } from '@typescript-eslint/experimental-utils/dist/ts-eslint';
import { EOL } from 'os';
import { assertExist } from '../../utils/preconditions';
import { BaseWorker } from './base';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class ErrorWorker<TOption extends readonly any[]> extends BaseWorker<
  TOption
> {
  render() {
    assertExist(this.ruleName, 'rule name must not be empty');
    const lintResult = this.linter.verify(
      this.code,
      {
        ...this.config,
        rules: { [this.ruleName]: this.ruleOption },
      },
      this.filename,
    );
    return this.markError(lintResult);
  }

  private markError(lintResult: Linter.LintMessage[]) {
    const resultMarker = this.markResult({
      lintResult,
      positionHelper: this.positionHelper,
    });
    if (resultMarker.length === 0) {
      return EOL + this.code;
    }

    const markedCodes = [''];
    let markedIterIdx = 0;
    for (let i = 0; i < this.codeLines.length; i += 1) {
      markedCodes.push(this.codeLines[i]);
      if (
        markedIterIdx < resultMarker.length &&
        i === resultMarker[markedIterIdx].afterLine
      ) {
        markedCodes.push(resultMarker[markedIterIdx].text);
        markedIterIdx += 1;
      }
    }
    return markedCodes.join(EOL);
  }
}
