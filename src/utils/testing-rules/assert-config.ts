import type { TSESLint } from '@typescript-eslint/utils';
import { createRule } from './create-rule';

type MessageIds = 'config';
type Option = [];
export const name = 'assert-config';
const messages: Record<MessageIds, string> = {
  config: 'no error msg for this rule',
};

export function createAssertConfigRule(
  callback: (context: TSESLint.RuleContext<'config', []>) => void,
): TSESLint.RuleModule<'config', [], TSESLint.RuleListener> {
  return createRule<Option, MessageIds>({
    name,
    meta: {
      type: 'suggestion',
      schema: [],
      messages,
      docs: {
        description: '',
        recommended: 'error',
      },
    },
    defaultOptions: [],
    create: (context) => ({
      Program: () => callback(context),
    }),
  });
}
