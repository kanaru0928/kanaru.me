import type { Root } from "mdast";
import { visit } from "unist-util-visit";

/**
 * URLのみの段落をLinkCardコンポーネントへ変換するRemarkプラグイン
 */
export function remarkLinkCard() {
  return (tree: Root) => {
    visit(tree, "paragraph", (node, _index, _parent) => {
      if (node.children.length !== 1) return;
      if (node.children[0].type !== "link") return;

      const text = node.children[0].url;

      // URLのみを渡す（OGP情報は渡さない）
      // @ts-expect-error - MDX JSX型定義の不一致
      node.type = "mdxJsxFlowElement";
      // @ts-expect-error - MDX JSX型定義の不一致
      node.name = "LinkCard";
      // @ts-expect-error - MDX JSX型定義の不一致
      node.attributes = [{ type: "mdxJsxAttribute", name: "url", value: text }];
      node.children = [];
    });
  };
}
