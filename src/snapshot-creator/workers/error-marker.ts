import { Linter } from 'eslint';
import { assertExist } from '../../utils/preconditions';
import { EOL } from 'os';
import { BaseWorker } from "./base";
import { PositionHelper } from '../position-helper';

export class ErrorMarker<TOption extends readonly any[]> extends BaseWorker<TOption> {
  // EOL will be inserted at the first line
  private lineAdded: number = 1;

  render() {
    assertExist(this.ruleName, 'rule name must not be empty');
    const lintResult = this.linter.verify(this.code, {
      ...this.config,
      rules: { [this.ruleName]: this.ruleOption },
    }, this.filename);
    return this.markError(lintResult);
  }

  private markError(lintResults: Linter.LintMessage[]) {
    const codeLines = [EOL, ...this.code.split(EOL), EOL];
    lintResults.forEach(lintResult => {
      const position = PositionHelper.getPosition(lintResult);
      // TODO: an error across multiple lines
      const errorPositionColumn = this.positionHelper.getColumnOnLine(position)
      const waveString = ErrorMarker.getWaveString(errorPositionColumn);
      const { message } = lintResult;
      const newLine = `${waveString}    [${message}]`;
      codeLines.splice(position.line.start + this.lineAdded + 1, 0, newLine);
      this.lineAdded++;
    });
    return codeLines.join(EOL);
  }

  private static getWaveString({
    start: columnStart,
    end: columnEnd,
  }: { start: number, end: number }) {
    const leadingSpaces = ' '.repeat(columnStart);
    const waveLength = Math.max((columnEnd - columnStart), 1)
    const waves = "~".repeat(waveLength);

    return leadingSpaces + waves;
  }
}
