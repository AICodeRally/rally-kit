import { tool } from 'ai'
import { z } from 'zod'

export const rallyTools = {
  writeApp: tool({
    description:
      "Write or update the student's app. Provide a complete, self-contained HTML document with React components, Tailwind styling, and all pages. The HTML renders immediately in the preview panel. Always include the full app — this replaces the previous version entirely.",
    inputSchema: z.object({
      html: z
        .string()
        .describe(
          'Complete HTML document including CDN script tags, Tailwind config, styles, and all React components in a single <script type="text/babel"> block',
        ),
    }),
  }),
}
