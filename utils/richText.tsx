import {
  documentToReactComponents,
  Options,
} from "@contentful/rich-text-react-renderer";
import { BLOCKS, Document, MARKS, Text } from "@contentful/rich-text-types";
import { ReactNode } from "react";

const Bold = ({ children }: { children: ReactNode }) => (
  <strong className="font-bold">{children}</strong>
);

const Paragraph = ({ children }: { children: ReactNode }) => <p>{children}</p>;

const UnorderedList = ({ children }: { children: ReactNode }) => (
  <ul className="list-disc">{children}</ul>
);

const OrderedList = ({ children }: { children: ReactNode }) => (
  <ol className="list-decimal">{children}</ol>
);

const ListItem = ({ children }: { children: ReactNode }) => <li>{children}</li>;

// TODO: other marks and blocks
const options: Options = {
  renderMark: {
    [MARKS.BOLD]: (text) => <Bold>{text}</Bold>,
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => <Paragraph>{children}</Paragraph>,
    [BLOCKS.UL_LIST]: (node, children) => (
      <UnorderedList>{children}</UnorderedList>
    ),
    [BLOCKS.OL_LIST]: (node, children) => <OrderedList>{children}</OrderedList>,
    [BLOCKS.LIST_ITEM]: (node, children) => <ListItem>{children}</ListItem>,
  },
};

export function renderRichText(richText: Document) {
  return documentToReactComponents(richText, options);
}
