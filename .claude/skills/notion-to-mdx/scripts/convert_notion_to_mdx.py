#!/usr/bin/env python3
"""
Convert Notion markdown export to Next.js MDX format.

This script handles:
1. Extracting title from the highest-level heading
2. Adding MDX frontmatter metadata
3. Converting strikethrough (~~text~~) to HTML <del> tags
4. Converting bullet lists to <details>/<summary> blocks (interactive mode)
"""

import re
import sys
from pathlib import Path


def extract_title(content):
    """Extract the first top-level heading (# Title) as the title."""
    match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
    if match:
        return match.group(1).strip()
    return "Untitled"


def convert_strikethrough(content):
    """Convert ~~strikethrough~~ to <del>strikethrough</del>."""
    return re.sub(r'~~(.+?)~~', r'<del>\1</del>', content)


def extract_bullet_lists(content):
    """Extract all bullet list sections from the content."""
    # Pattern to match bullet lists (lines starting with - or *)
    lines = content.split('\n')
    bullet_sections = []
    current_section = []
    in_bullet_list = False
    start_idx = 0

    for i, line in enumerate(lines):
        # Check if line is a bullet point
        is_bullet = re.match(r'^[\s]*[-*]\s+', line)

        if is_bullet:
            if not in_bullet_list:
                start_idx = i
                in_bullet_list = True
            current_section.append(line)
        else:
            if in_bullet_list and current_section:
                bullet_sections.append({
                    'content': '\n'.join(current_section),
                    'start_line': start_idx,
                    'end_line': i - 1
                })
                current_section = []
                in_bullet_list = False

    # Don't forget the last section if it ends with bullets
    if in_bullet_list and current_section:
        bullet_sections.append({
            'content': '\n'.join(current_section),
            'start_line': start_idx,
            'end_line': len(lines) - 1
        })

    return bullet_sections


def prompt_for_details_conversion(bullet_sections, content):
    """
    Interactive prompt to convert bullet lists to <details> blocks.

    Returns the converted content.
    """
    if not bullet_sections:
        return content

    lines = content.split('\n')
    replacements = []  # Store (start_line, end_line, replacement_text) tuples

    print("\n" + "="*60)
    print("EXPANDABLE DROPDOWN CONVERSION")
    print("="*60)
    print("\nFound bullet list sections that might be expandable dropdowns.")
    print("For each section, specify if it should be converted to <details>.\n")

    for idx, section in enumerate(bullet_sections, 1):
        print(f"\n--- Section {idx} (lines {section['start_line']}-{section['end_line']}) ---")
        print(section['content'][:200] + ("..." if len(section['content']) > 200 else ""))
        print()

        response = input(f"Convert this to expandable dropdown? (y/n): ").strip().lower()

        if response == 'y':
            summary = input("Enter the summary text (what appears when collapsed): ").strip()
            if summary:
                # Convert the bullet list to details block
                details_content = '\n'.join([
                    '<details>',
                    f'  <summary>{summary}</summary>',
                    '  ',
                    section['content'],
                    '</details>'
                ])
                replacements.append((
                    section['start_line'],
                    section['end_line'],
                    details_content
                ))

    # Apply replacements in reverse order to maintain line numbers
    for start_line, end_line, replacement in reversed(replacements):
        lines[start_line:end_line + 1] = [replacement]

    return '\n'.join(lines)


def add_frontmatter(content, title):
    """Add MDX frontmatter with title metadata."""
    frontmatter = f"""---
title: "{title}"
---

"""
    return frontmatter + content


def convert_notion_to_mdx(input_path, output_path=None, interactive=True):
    """
    Convert a Notion markdown file to Next.js MDX format.

    Args:
        input_path: Path to input markdown file
        output_path: Path to output MDX file (optional, defaults to input path)
        interactive: Whether to prompt for details conversion (default: True)

    Returns:
        The converted content as a string
    """
    input_file = Path(input_path)

    if not input_file.exists():
        raise FileNotFoundError(f"Input file not found: {input_path}")

    # Read the content
    content = input_file.read_text(encoding='utf-8')

    # Extract title from first heading
    title = extract_title(content)

    # Convert strikethrough
    content = convert_strikethrough(content)

    # Handle expandable dropdowns (interactive)
    if interactive:
        bullet_sections = extract_bullet_lists(content)
        if bullet_sections:
            content = prompt_for_details_conversion(bullet_sections, content)

    # Add frontmatter
    content = add_frontmatter(content, title)

    # Write to output file
    if output_path is None:
        output_path = input_path

    output_file = Path(output_path)
    output_file.write_text(content, encoding='utf-8')

    print(f"\n✅ Conversion complete!")
    print(f"   Title: {title}")
    print(f"   Output: {output_path}")

    return content


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python convert_notion_to_mdx.py <input_file> [output_file]")
        print("\nExample:")
        print("  python convert_notion_to_mdx.py notion_export.md")
        print("  python convert_notion_to_mdx.py notion_export.md page.mdx")
        sys.exit(1)

    input_path = sys.argv[1]
    output_path = sys.argv[2] if len(sys.argv) > 2 else None

    try:
        convert_notion_to_mdx(input_path, output_path, interactive=True)
    except Exception as e:
        print(f"❌ Error: {e}", file=sys.stderr)
        sys.exit(1)
