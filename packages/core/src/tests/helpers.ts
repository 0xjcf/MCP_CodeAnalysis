import { z } from 'zod';

import type { Tool } from '../tools/interfaces.js';

export const createMockTool = (
  name: string,
  schema = z.object({}),
  handler?: any,
): Tool<any, any> => ({
  id: name,
  name,
  description: `Mock tool: ${name}`,
  version: '1.0.0',
  category: 'test',
  execute:
    handler ||
    ((params: any) =>
      Promise.resolve({
        result: `Executed ${name} with ${JSON.stringify(params)}`,
      })),
});
