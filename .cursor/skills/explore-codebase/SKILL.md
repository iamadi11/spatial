---
name: explore-codebase
description: Navigate and understand codebase structure using code-review-graph MCP tools first.
---

# Explore Codebase

Use the code-review-graph MCP tools to explore and understand the codebase.

## Steps

1. Run `list_graph_stats` to see overall codebase metrics (if available).
2. Run `get_architecture_overview` for high-level community structure.
3. Use `list_communities` to find major modules, then `get_community` for details (if available).
4. Use `semantic_search_nodes` to find specific functions or classes.
5. Use `query_graph` with patterns like `callers_of`, `callees_of`, `imports_of` to trace relationships.
6. Use `list_flows` and `get_flow` to understand execution paths (if available).

## Tips

- Start broad (stats, architecture) then narrow down to specific areas.
- Use `children_of` on a file to see all its functions and classes (if supported).
- Use `find_large_functions` to identify complex code (if supported).
