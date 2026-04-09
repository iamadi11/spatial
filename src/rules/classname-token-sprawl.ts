import type { Rule } from '../rule-registry'

const DEFAULT_MAX_TOKENS = 30
const DEFAULT_MAX_LENGTH = 400

export type ClassnameTokenSprawlOptions = {
  /** Whitespace-separated class tokens above this count trigger (default 30). */
  maxTokens?: number
  /** Character length above this triggers (default 400), measured after trim. */
  maxLength?: number
}

function countClassNameTokens(className: string): number {
  const trimmed = className.trim()
  if (trimmed.length === 0) return 0
  return trimmed.split(/\s+/).length
}

/**
 * Rule: classname-token-sprawl
 * Flags oversized `props.className` strings (utility / Tailwind sprawl).
 * Only inspects `className` when it is a string; non-strings are ignored.
 */
export function createClassnameTokenSprawlRule(options: ClassnameTokenSprawlOptions = {}): Rule {
  const maxTokens = options.maxTokens ?? DEFAULT_MAX_TOKENS
  const maxLength = options.maxLength ?? DEFAULT_MAX_LENGTH

  return {
    name: 'classname-token-sprawl',
    detect: (node, _metrics) => {
      const raw = node.props?.className
      if (typeof raw !== 'string') {
        return { triggered: false }
      }

      const len = raw.trim().length
      const tokens = countClassNameTokens(raw)

      const overLength = len > maxLength
      const overTokens = tokens > maxTokens

      if (!overLength && !overTokens) {
        return { triggered: false }
      }

      const parts: string[] = []
      if (overTokens) parts.push(`${tokens} class tokens (max ${maxTokens})`)
      if (overLength) parts.push(`${len} characters (max ${maxLength})`)

      return {
        triggered: true,
        issue: {
          rule: 'classname-token-sprawl',
          severity: 'warning',
          message: `className sprawl: ${parts.join('; ')}`,
          nodeId: node.id,
        },
      }
    },
  }
}
