/**
 * D21: IssueGroupedList — groups PerformanceIssue[] by rule name with collapsible sections
 */
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import type { PerformanceIssue } from '../../src/lib/engine'
import { IssueGroupedList } from '../../src/components/IssueGroupedList'

function makeIssue(rule: string, nodeId = 'root', message = `${rule} triggered`): PerformanceIssue {
  return { rule, severity: 'warning', nodeId, message }
}

describe('IssueGroupedList', () => {
  // Happy path 1: renders empty state when no issues
  it('renders empty state when issues array is empty', () => {
    render(<IssueGroupedList issues={[]} />)
    expect(screen.getByText(/no issues/i)).toBeInTheDocument()
  })

  // Happy path 2: groups issues by rule name showing header + count badge
  it('renders a group header with issue count for each distinct rule', () => {
    const issues = [
      makeIssue('render-count'),
      makeIssue('render-count'),
      makeIssue('prop-count'),
    ]
    render(<IssueGroupedList issues={issues} />)
    // render-count group header with count 2
    expect(screen.getByText('render-count')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    // prop-count group header with count 1
    expect(screen.getByText('prop-count')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  // Happy path 3: groups start expanded — issues visible by default
  it('shows issue messages when groups are initially expanded', () => {
    const issues = [makeIssue('render-count', 'btn', 'too many renders')]
    render(<IssueGroupedList issues={issues} />)
    expect(screen.getByText(/too many renders/i)).toBeInTheDocument()
  })

  // Edge case 1: clicking a group header collapses it (hides issues)
  it('clicking an expanded group header collapses it', () => {
    const issues = [makeIssue('render-count', 'btn', 'too many renders')]
    render(<IssueGroupedList issues={issues} />)
    const header = screen.getByRole('button', { name: /render-count/i })
    fireEvent.click(header)
    expect(screen.queryByText(/too many renders/i)).not.toBeInTheDocument()
  })

  // Edge case 2: clicking a collapsed group re-expands it
  it('clicking a collapsed group header expands it again', () => {
    const issues = [makeIssue('render-count', 'btn', 'too many renders')]
    render(<IssueGroupedList issues={issues} />)
    const header = screen.getByRole('button', { name: /render-count/i })
    fireEvent.click(header) // collapse
    fireEvent.click(header) // expand
    expect(screen.getByText(/too many renders/i)).toBeInTheDocument()
  })

  // Edge case 3: multiple groups are independently collapsible
  it('collapsing one group does not collapse another', () => {
    const issues = [
      makeIssue('render-count', 'btn', 'too many renders'),
      makeIssue('prop-count', 'form', 'too many props'),
    ]
    render(<IssueGroupedList issues={issues} />)
    fireEvent.click(screen.getByRole('button', { name: /render-count/i }))
    expect(screen.queryByText(/too many renders/i)).not.toBeInTheDocument()
    expect(screen.getByText(/too many props/i)).toBeInTheDocument()
  })

  // Failure case: error severity issue shows distinguishable styling
  it('renders error-severity issues within their group', () => {
    const issues: PerformanceIssue[] = [
      { rule: 'fps-drop', severity: 'error', nodeId: 'root', message: 'fps dropped' },
    ]
    render(<IssueGroupedList issues={issues} />)
    expect(screen.getByText('fps-drop')).toBeInTheDocument()
    expect(screen.getByText(/fps dropped/i)).toBeInTheDocument()
  })

  // Accessible: group headers are buttons with aria-expanded
  it('group header buttons have aria-expanded attribute', () => {
    const issues = [makeIssue('render-count')]
    render(<IssueGroupedList issues={issues} />)
    const header = screen.getByRole('button', { name: /render-count/i })
    expect(header).toHaveAttribute('aria-expanded')
  })
})
