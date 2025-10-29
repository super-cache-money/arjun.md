---
name: notion-to-mdx
description: Automatically converts Notion markdown exports to Next.js MDX format with proper metadata and formatting. Use this skill when working with Notion markdown files that need to be converted to page.mdx files in this Next.js repository. Handles title extraction, strikethrough conversion, and interactive dropdown creation.
---

# Notion to MDX Converter

## Overview

This skill automates the conversion of Notion markdown exports into Next.js MDX-compatible format for this repository. It handles metadata extraction, formatting transformations, and interactive conversion of expandable sections.

## When to Use This Skill

Use this skill when:
- Converting Notion markdown exports to page.mdx files in this repository
- A file needs MDX frontmatter metadata added
- Notion-specific markdown syntax needs to be transformed to Next.js MDX format
- User mentions converting Notion content or asks to work with Notion markdown

## Conversion Workflow

### Step 1: Identify the Source File

When a user requests conversion of Notion markdown, identify the target file:
- User may provide a file path directly
- User may have a file open in their editor (check system reminders)
- User may paste Notion markdown content directly

### Step 2: Run the Conversion Script

Execute the conversion script with the appropriate file path:

```bash
python .claude/skills/notion-to-mdx/scripts/convert_notion_to_mdx.py <input_file> [output_file]
```

**Parameters:**
- `<input_file>`: Path to the Notion markdown file (required)
- `[output_file]`: Optional output path (defaults to overwriting input file)

**The script will:**
1. Extract the title from the first top-level heading (`# Title`)
2. Add MDX frontmatter with the title metadata
3. Convert all `~~strikethrough~~` syntax to `<del>strikethrough</del>` HTML tags
4. Identify bullet list sections and interactively prompt about expandable dropdowns

### Step 3: Interactive Dropdown Conversion

The script will identify bullet list sections in the document and prompt the user:

```
--- Section 1 (lines 45-52) ---
- First bullet point
- Second bullet point
- Third bullet point

Convert this to expandable dropdown? (y/n):
```

If the user responds 'y', the script prompts for summary text:

```
Enter the summary text (what appears when collapsed):
```

The script then converts the bullet list to:

```html
<details>
  <summary>User's summary text</summary>

- First bullet point
- Second bullet point
- Third bullet point
</details>
```

### Step 4: Verify the Output

After conversion, review the generated MDX file to ensure:
- Title metadata is correct in the frontmatter
- All strikethrough text is properly converted
- Expandable dropdowns are correctly formatted
- File structure matches Next.js MDX requirements

## Conversion Details

### Title Extraction

The script extracts the title from the first top-level heading in the markdown:

```markdown
# My Document Title

Content here...
```

Becomes:

```mdx
---
title: "My Document Title"
---

# My Document Title

Content here...
```

If no top-level heading is found, defaults to "Untitled".

### Strikethrough Conversion

Notion's markdown strikethrough syntax is automatically converted:

**Before:** `This is ~~deleted~~ text`
**After:** `This is <del>deleted</del> text`

This ensures compatibility with Next.js MDX rendering.

### Expandable Dropdowns

Regular bullet lists in Notion exports appear as standard markdown bullets. The script identifies these sections and allows interactive conversion to HTML `<details>` elements:

**Before (Notion bullet list):**
```markdown
- Point one
- Point two
- Point three
```

**After (if converted to dropdown):**
```html
<details>
  <summary>Click to expand</summary>

- Point one
- Point two
- Point three
</details>
```

## Example Usage

**User request:** "Convert the Notion markdown in app/my-post/page.mdx"

**Actions:**
1. Run: `python .claude/skills/notion-to-mdx/scripts/convert_notion_to_mdx.py app/my-post/page.mdx`
2. Script extracts title, converts strikethrough automatically
3. Script prompts user about bullet list sections for dropdown conversion
4. User responds to prompts interactively
5. File is updated with converted content

## Non-Interactive Mode

To skip the interactive dropdown prompts (useful when no dropdowns are needed), modify the script call in code:

```python
convert_notion_to_mdx(input_path, output_path, interactive=False)
```

This will perform title extraction and strikethrough conversion only.

## Resources

### scripts/convert_notion_to_mdx.py

Python script that performs the markdown-to-MDX conversion. Handles:
- Title extraction from top-level headings
- MDX frontmatter generation
- Strikethrough syntax conversion
- Interactive dropdown creation with user prompts

The script can be executed directly from the command line or imported as a Python module for programmatic use.
