import { Linter } from '@typescript-eslint/experimental-utils/dist/ts-eslint';
import { markResult } from '../mark-result';
import { PositionHelper } from '../position-helper';

describe('ResultMarker', () => {
  const createLintMessage = ({
    line,
    column,
    endColumn,
    message = 'message',
  }: {
    line: number;
    column: number;
    message?: string;
    endColumn?: number;
  }): Linter.LintMessage => ({
    line,
    column,
    endColumn,
    ruleId: null,
    message,
    severity: 0,
    nodeType: 'any',
    source: null,
  });

  it('transforms one line error without column end', () => {
    const lintResult: Linter.LintMessage[] = [
      createLintMessage({ line: 1, column: 3 }),
    ];
    const positionHelper = new PositionHelper(['123456789']);
    const markedResult = markResult({ lintResult, positionHelper });
    expect(markedResult).toEqual([
      {
        afterLine: 0,
        text: '  ~~~~~~~    [message]',
      },
    ]);
  });

  it('transforms one line error', () => {
    const lintResult: Linter.LintMessage[] = [
      createLintMessage({ line: 1, column: 3, endColumn: 6 }),
    ];
    const positionHelper = new PositionHelper(['']);
    const markedResult = markResult({ lintResult, positionHelper });
    expect(markedResult).toEqual([
      {
        afterLine: 0,
        text: '  ~~~    [message]',
      },
    ]);
  });

  it('transforms multiple one line errors in multiple lines', () => {
    const lintResult: Linter.LintMessage[] = [
      createLintMessage({ line: 1, column: 3, endColumn: 6 }),
      createLintMessage({ line: 3, column: 3 }),
    ];
    const positionHelper = new PositionHelper(['', '', '123456789']);
    const markedResult = markResult({ lintResult, positionHelper });
    expect(markedResult).toEqual([
      {
        afterLine: 0,
        text: '  ~~~    [message]',
      },
      {
        afterLine: 2,
        text: '  ~~~~~~~    [message]',
      },
    ]);
  });
});
