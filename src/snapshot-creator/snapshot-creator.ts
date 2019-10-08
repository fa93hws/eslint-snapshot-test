import { Linter, RuleTesterConfig } from '@typescript-eslint/experimental-utils/dist/ts-eslint'
import { Worker, WorkerType } from './worker';

const linter = new Linter();

export class SnapshotCreator {
  private readonly config: RuleTesterConfig;
  public constructor(config: RuleTesterConfig) {
    this.config = config;
  }

  public mark<TOption extends readonly any[]>(code: string) {
    return new Worker<TOption>(WorkerType.MARK);
  }
}
