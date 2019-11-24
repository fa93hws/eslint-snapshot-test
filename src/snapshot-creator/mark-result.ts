import { Linter } from '@typescript-eslint/experimental-utils/dist/ts-eslint';
import { PositionHelper } from './position-helper';

export type MarkedLine = {
  // To be inserted in the original code, start from 0
  afterLine: number;
  text: string;
};

export type MarkResultFn = (param: {
  lintResult: readonly Linter.LintMessage[];
  positionHelper: PositionHelper;
}) => MarkedLine[];

function drawWaveString({
  start: columnStart,
  end: columnEnd,
}: {
  start: number;
  end: number;
}) {
  const leadingSpaces = ' '.repeat(columnStart);
  const waveLength = Math.max(columnEnd - columnStart, 1);
  const waves = '~'.repeat(waveLength);

  return leadingSpaces + waves;
}

const sortFn = (a: MarkedLine, b: MarkedLine) => a.afterLine - b.afterLine;

export const markResult: MarkResultFn = ({ lintResult, positionHelper }) => {
  const result: MarkedLine[] = [];
  lintResult.forEach(r => {
    const range = PositionHelper.getRange(r);
    const positions = positionHelper.parsePosition(range);
    positions.forEach(position => {
      const waveString = drawWaveString(position.column);
      result.push({
        afterLine: position.line,
        text: `${waveString}    [${r.message}]`,
      });
    });
  });
  result.sort(sortFn);
  return result;
};
