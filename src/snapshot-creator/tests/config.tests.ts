import { SnapshotCreator } from "../snapshot-creator";
import { createAssertConfigRule } from "../../utils/testing-rules/assert-config";

describe('when providing configs', () => {
  const snapshotCreator = new SnapshotCreator({
    parser: '@typescript-eslint/parser',
  });

  it('can parse the filename correctly', () => {
    const wantFileName = 'want.filename.tsx';
    let gotFilename: string = '';
    const rule = createAssertConfigRule(context => gotFilename = context.getFilename());
    snapshotCreator
      .mark({ code: '', ruleName: 'assert-filename', rule })
      .withFileName(wantFileName)
      .render();
    expect(gotFilename).toEqual(wantFileName);
  });
});
