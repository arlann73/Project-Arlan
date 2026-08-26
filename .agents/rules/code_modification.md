---
trigger: always_on
---

# Code Modification Practices

1. **Prefer Native Tools:** Always prefer the `replace_file_content` or `multi_replace_file_content` tools over writing custom Python scripts for simple text substitution. The native tools provide precise line-level matching and diffs, avoiding reference and scope errors.
2. **Robust Python Replacements:** If a Python script MUST be used for text replacement (e.g. dynamic injection across multiple files simultaneously), NEVER use naive non-greedy regex (e.g., `[\s\S]*?`) without strict termination constraints. Ensure the entire logical block is consumed, or use string splitting / AST parsing instead.
