import { tool } from 'ai'
import { z } from 'zod'

export const rallyTools = {
  writeFile: tool({
    description:
      "Write or update a file in the student's project. Always provide complete file contents.",
    inputSchema: z.object({
      path: z
        .string()
        .describe(
          "File path relative to project root, e.g. 'src/app/dashboard/page.tsx'",
        ),
      content: z.string().describe('Complete file content'),
    }),
  }),

  readFile: tool({
    description: "Read the current contents of a file in the student's project",
    inputSchema: z.object({
      path: z
        .string()
        .describe('File path relative to project root'),
    }),
  }),

  listFiles: tool({
    description: "List files and directories in a path in the student's project",
    inputSchema: z.object({
      path: z
        .string()
        .describe(
          "Directory path relative to project root, e.g. 'src/app' or 'src/components'",
        ),
    }),
  }),
}
