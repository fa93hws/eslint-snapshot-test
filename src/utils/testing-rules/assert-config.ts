import type {
  RuleContext,
  RuleListener,
  RuleModule,
} from '@typescript-eslint/experimental-utils/dist/ts-eslint';
import { createRule } from './create-rule';

type MessageIds = 'config';
type Option = [];
export const name = 'assert-config';
const messages: Record<MessageIds, string> = {
  config: 'no error msg for this rule',
};

export function createAssertConfigRule(
  callback: (context: RuleContext<'config', []>) => void,
): RuleModule<'config', [], RuleListener> {
  return createRule<Option, MessageIds>({
    name,
    meta: {
      type: 'suggestion',
      schema: [],
      messages,
      docs: {
        description: '',
        category: 'Best Practices',
        recommended: 'error',
      },
    },
    defaultOptions: [],
    create: (context) => ({
      Program: () => callback(context),
    }),
  });
}
