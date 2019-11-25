import { Linter } from '@typescript-eslint/experimental-utils/dist/ts-eslint';
import { EOL } from 'os';
import { ErrorWorker } from '../workers/error-worker';
import { MarkResultFn } from '../mark-result';

describe('SnapshotCreator', () => {
  const linter = ({ verify: () => [] } as unknown) as Linter;
  function createErrorWorker({
    code,
    markResult,
  }: {
    code: string;
    markResult: MarkResultFn;
  }) {
    return new ErrorWorker({
      code,
      config: { parser: 'any' },
      linter,
      ruleName: 'any',
      markResult,
    });
  }

  it('marks error after the line', () => {
    const markResult = jest
      .fn()
      .mockReturnValue([{ afterLine: 0, text: 'error' }]);
    const errorWorker = createErrorWorker({
      code: ['1', '2'].join(EOL),
      markResult,
    });
    const { snapshot } = errorWorker.render();
    expect(snapshot).toEqual(['', '1', 'error', '2'].join(EOL));
  });

  it('marks error correctly at the last line', () => {
    const markResult = jest
      .fn()
      .mockReturnValue([{ afterLine: 1, text: 'error' }]);
    const errorWorker = createErrorWorker({
      code: ['1', '2'].join(EOL),
      markResult,
    });
    const { snapshot } = errorWorker.render();
    expect(snapshot).toEqual(['', '1', '2', 'error'].join(EOL));
  });

  it('marks error in multiple lines', () => {
    const markResult = jest.fn().mockReturnValue([
      { afterLine: 0, text: 'error0' },
      { afterLine: 1, text: 'error1' },
    ]);
    const errorWorker = createErrorWorker({
      code: ['1', '2'].join(EOL),
      markResult,
    });
    const { snapshot } = errorWorker.render();
    expect(snapshot).toEqual(['', '1', 'error0', '2', 'error1'].join(EOL));
  });

  it('does nothing if there is no error', () => {
    const markResult = jest.fn().mockReturnValue([]);
    const errorWorker = createErrorWorker({
      code: ['1', '2'].join(EOL),
      markResult,
    });
    const { snapshot } = errorWorker.render();
    expect(snapshot).toEqual(['', '1', '2'].join(EOL));
  });
});
