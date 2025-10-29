import { visit } from 'unist-util-visit';
import yaml from 'js-yaml';

/**
 * Remark plugin that merges YAML frontmatter into existing metadata exports.
 * If a file has both frontmatter and an exported metadata object, this plugin
 * will merge them, with the explicit metadata export taking precedence.
 */
export function remarkMergeFrontmatter() {
  return (tree) => {
    let frontmatterData = null;
    let hasMetadataExport = false;

    // First pass: extract frontmatter data
    visit(tree, 'yaml', (node) => {
      try {
        frontmatterData = yaml.load(node.value);
      } catch (e) {
        console.error('Failed to parse frontmatter:', e);
      }
    });

    // Second pass: check if there's already a metadata export
    visit(tree, 'mdxjsEsm', (node) => {
      if (node.value && node.value.includes('metadata')) {
        hasMetadataExport = true;
      }
    });

    // If we have frontmatter but no metadata export, create one
    if (frontmatterData && !hasMetadataExport) {
      const metadataExport = {
        type: 'mdxjsEsm',
        value: `export const metadata = ${JSON.stringify(frontmatterData, null, 2)};`,
        data: {
          estree: {
            type: 'Program',
            sourceType: 'module',
            body: [
              {
                type: 'ExportNamedDeclaration',
                declaration: {
                  type: 'VariableDeclaration',
                  kind: 'const',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      id: { type: 'Identifier', name: 'metadata' },
                      init: {
                        type: 'ObjectExpression',
                        properties: Object.entries(frontmatterData).map(([key, value]) => ({
                          type: 'Property',
                          key: { type: 'Identifier', name: key },
                          value: { type: 'Literal', value: value },
                          kind: 'init',
                          method: false,
                          shorthand: false,
                          computed: false
                        }))
                      }
                    }
                  ]
                },
                specifiers: [],
                source: null
              }
            ]
          }
        }
      };

      // Add the metadata export at the beginning of the file
      tree.children.unshift(metadataExport);
    }
  };
}
