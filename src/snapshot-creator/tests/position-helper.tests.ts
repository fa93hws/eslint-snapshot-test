import { Linter } from '@typescript-eslint/experimental-utils/dist/ts-eslint';
import { PositionHelper, Position } from '../position-helper';

function createLintResult({
  column, line, endColumn, endLine,
}: {
  line: number;
  column: number;
  endLine?: number;
  endColumn?: number;
}): Linter.LintMessage {
  return {
    column,
    line,
    endColumn,
    endLine,
    ruleId: null,
    message: '',
    nodeType: '',
    severity: 0,
    source: null,
  };
}

describe('PositionHelper', () => {
  describe('getPosition', () => {
    it('offsets the line and column by -1', () => {
      const result = createLintResult({
        column: 2, line: 3, endColumn: 4, endLine: 5,
      });
      const position = PositionHelper.getPosition(result);
      expect(position).toEqual(expect.objectContaining({
        line: { start: 2, end: 4 },
        column: { start: 1, end: 3 },
      }));
    });
  });

  describe('getColumnOnLine', () => {
    const positionHelper = new PositionHelper([
      'a'.repeat(5),
      'a'.repeat(7),
      'a'.repeat(9),
    ]);

    it('return the start and end if both are given', () => {
      const position: Position = {
        line: { start: 1, end: 1 },
        column: { start: 2, end: 6 },
      };
      const got = positionHelper.getColumnOnLine(position);
      expect(got).toEqual({ start: 2, end: 6 });
    });

    it('ends at length if the column end is not given', () => {
      const position: Position = {
        line: { start: 1, end: 1 },
        column: { start: 2, end: undefined },
      };
      const got = positionHelper.getColumnOnLine(position);
      expect(got).toEqual({ start: 2, end: 7 });
    });
  });
});
