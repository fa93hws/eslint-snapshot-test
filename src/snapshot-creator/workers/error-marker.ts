import { EOL } from 'os';
import { assertExist } from '../../utils/preconditions';
import { BaseWorker } from './base';
import { MarkedLine } from '../mark-result';

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
    const markedResult = this.markResult({
      lintResult,
      positionHelper: this.positionHelper,
    });
    return this.markError(markedResult);
  }

  private markError(markedResult: readonly MarkedLine[]) {
    if (markedResult.length === 0) {
      return EOL + this.code;
    }

    const markedCodes = [''];
    let markedIterIdx = 0;
    for (let i = 0; i < this.codeLines.length; i += 1) {
      markedCodes.push(this.codeLines[i]);
      if (
        markedIterIdx < markedResult.length &&
        i === markedResult[markedIterIdx].afterLine
      ) {
        markedCodes.push(markedResult[markedIterIdx].text);
        markedIterIdx += 1;
      }
    }
    return markedCodes.join(EOL);
  }
}
