import { Linter } from '@typescript-eslint/experimental-utils/dist/ts-eslint';
import { markResult } from '../mark-result';
import { PositionHelper } from '../position-helper';

describe('ResultMarker', () => {
  const createLintMessage = ({
    line,
    column,
    message = 'message',
  }: {
    line: number;
    column: number;
    message?: string;
  }): Linter.LintMessage => ({
    line,
    column,
    ruleId: null,
    message,
    severity: 0,
    nodeType: 'any',
    source: null,
  });

  it('finds the one line error without column end', () => {
    const lintResult: Linter.LintMessage[] = [
      createLintMessage({ line: 1, column: 3 }),
    ];
    const code = 'There is an error!';
    const positionHelper = new PositionHelper([code]);
    const markedResult = markResult({ lintResult, positionHelper });
    expect(markedResult).toEqual([
      {
        afterLine: 0,
        text: '  ~~~~~~~~~~~~~~~~    [message]',
      },
    ]);
  });
});
