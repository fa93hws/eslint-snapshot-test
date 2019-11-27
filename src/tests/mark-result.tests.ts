import { Linter } from '@typescript-eslint/experimental-utils/dist/ts-eslint';
import { EOL } from 'os';
import { markResult } from '../mark-result';
import { PositionHelper } from '../position-helper';

describe('markResult', () => {
  const oneLineCode = '1234567890';
  const createLines = (num: number) => new Array(num).fill(oneLineCode);
  const createLintMessage = ({
    line,
    endLine = line,
    column,
    endColumn,
    message = 'message',
  }: {
    line: number;
    endLine?: number;
    column: number;
    message?: string;
    endColumn?: number;
  }): Linter.LintMessage => ({
    line,
    endLine,
    column,
    endColumn,
    ruleId: null,
    message,
    severity: 0,
    nodeType: 'any',
    source: null,
  });

  it('generates for one line code to the end without endColumn', () => {
    const codeLines = createLines(3);
    const lintResult: Linter.LintMessage[] = [
      createLintMessage({ line: 1, column: 3 }),
    ];
    const positionHelper = new PositionHelper(codeLines);
    const markedResult = markResult({ codeLines, lintResult, positionHelper });
    expect(markedResult.split(EOL)).toEqual([
      '',
      codeLines[0],
      '  ~~~~~~~~    [message]',
      codeLines[1],
      codeLines[2],
    ]);
  });

  it('generates for one line error to the endColumn', () => {
    const codeLines = createLines(4);
    const lintResult: Linter.LintMessage[] = [
      createLintMessage({ line: 1, column: 3, endColumn: 6 }),
    ];
    const positionHelper = new PositionHelper(codeLines);
    const markedResult = markResult({ codeLines, lintResult, positionHelper });
    expect(markedResult.split(EOL)).toEqual([
      '',
      codeLines[0],
      '  ~~~    [message]',
      codeLines[1],
      codeLines[2],
      codeLines[3],
    ]);
  });

  it('generates multiple one line errors', () => {
    const codeLines = createLines(3);
    const lintResult: Linter.LintMessage[] = [
      createLintMessage({ line: 1, column: 3, endColumn: 6 }),
      createLintMessage({ line: 3, column: 3 }),
    ];
    const positionHelper = new PositionHelper(codeLines);
    const markedResult = markResult({ codeLines, lintResult, positionHelper });
    expect(markedResult.split(EOL)).toEqual([
      '',
      codeLines[0],
      '  ~~~    [message]',
      codeLines[1],
      codeLines[2],
      '  ~~~~~~~~    [message]',
    ]);
  });

  it('generates for multiple one line errors in multiple lines in order', () => {
    const codeLines = createLines(3);
    const lintResult: Linter.LintMessage[] = [
      createLintMessage({ line: 3, column: 3 }),
      createLintMessage({ line: 1, column: 3, endColumn: 6 }),
    ];
    const positionHelper = new PositionHelper(codeLines);
    const markedResult = markResult({ codeLines, lintResult, positionHelper });
    expect(markedResult.split(EOL)).toEqual([
      '',
      codeLines[0],
      '  ~~~    [message]',
      codeLines[1],
      codeLines[2],
      '  ~~~~~~~~    [message]',
    ]);
  });

  it('generates for one error across two lines without endColumn', () => {
    const codeLines = createLines(5);
    const lintResult: Linter.LintMessage[] = [
      createLintMessage({ line: 1, column: 3, endLine: 3 }),
    ];
    const positionHelper = new PositionHelper(codeLines);
    const markedResult = markResult({ codeLines, lintResult, positionHelper });
    expect(markedResult.split(EOL)).toEqual([
      '',
      codeLines[0],
      '  ~~~~~~~~    [message]',
      codeLines[1],
      '~~~~~~~~~~    [message]',
      codeLines[2],
      '~~~~~~~~~~    [message]',
      codeLines[3],
      codeLines[4],
    ]);
  });

  it('generates for one error across two lines with endColumn', () => {
    const codeLines = createLines(5);
    const lintResult: Linter.LintMessage[] = [
      createLintMessage({ line: 1, column: 3, endLine: 3, endColumn: 4 }),
    ];
    const positionHelper = new PositionHelper(codeLines);
    const markedResult = markResult({ codeLines, lintResult, positionHelper });
    expect(markedResult.split(EOL)).toEqual([
      '',
      codeLines[0],
      '  ~~~~~~~~    [message]',
      codeLines[1],
      '~~~~~~~~~~    [message]',
      codeLines[2],
      '~~~    [message]',
      codeLines[3],
      codeLines[4],
    ]);
  });

  it('generates for error after last column', () => {
    const codeLines = ['1'];
    const lintResult: Linter.LintMessage[] = [
      createLintMessage({ line: 1, column: 2 }),
    ];
    const positionHelper = new PositionHelper(codeLines);
    const markedResult = markResult({
      codeLines,
      lintResult,
      positionHelper,
    });
    expect(markedResult).toEqual(`${EOL}1${EOL} ~    [message]`);
  });

  it('return the code nothing if there is no error', () => {
    const codeLines = createLines(3);
    const lintResult: Linter.LintMessage[] = [];
    const positionHelper = new PositionHelper(codeLines);
    const markedResult = markResult({
      codeLines,
      lintResult,
      positionHelper,
    });
    expect(markedResult).toEqual(['', ...codeLines].join(EOL));
  });
});
