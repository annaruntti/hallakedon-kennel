import {
  documentToReactComponents,
  Options,
} from "@contentful/rich-text-react-renderer";
import { BLOCKS, MARKS, INLINES } from "@contentful/rich-text-types";
import { createElement, ReactNode } from "react";
import { ContentWithLinks } from "./api";

const Text = ({
  type,
  children,
}: {
  type:
    | "span"
    | "bold"
    | "italic"
    | "underline"
    | "code"
    | "superscript"
    | "subscript";
  children: ReactNode;
}) => {
  switch (type) {
    case "bold":
      return <strong className="font-bold">{children}</strong>;
    case "italic":
      return <em className="italic">{children}</em>;
    case "underline":
      return <u className="underline">{children}</u>;
    case "code":
      return <code className="font-mono">{children}</code>;
    case "superscript":
      return <sup>{children}</sup>;
    case "subscript":
      return <sub>{children}</sub>;
    default:
      return <span>{children}</span>;
  }
};

const Heading = ({
  level,
  children,
}: {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
}) => {
  return createElement(`h${level}`, { className: "font-bold", children });
};

const Paragraph = ({ children }: { children: ReactNode }) => <p>{children}</p>;

const UnorderedList = ({ children }: { children: ReactNode }) => (
  <ul className="list-disc pl-4">{children}</ul>
);

const OrderedList = ({ children }: { children: ReactNode }) => (
  <ol className="list-decimal">{children}</ol>
);

const ListItem = ({ children }: { children: ReactNode }) => <li>{children}</li>;

const Divider = () => <hr className="border-t-1 border-black mt-6 mb-6" />;

const Blockquote = ({ children }: { children: ReactNode }) => (
  <blockquote className="border-l-4 border-black pl-2">{children}</blockquote>
);
const Table = ({ children }: { children: ReactNode }) => (
  <table className="border-collapse border border-black">
    <tbody>{children}</tbody>
  </table>
);
const TableRow = ({ children }: { children: ReactNode }) => <tr>{children}</tr>;
const TableCell = ({
  colSpan,
  rowSpan,
  children,
}: {
  colSpan?: number;
  rowSpan?: number;
  children: ReactNode;
}) => (
  <td colSpan={colSpan} rowSpan={rowSpan} className="border">
    {children}
  </td>
);
const TableHeaderCell = ({ children }: { children: ReactNode }) => (
  <th className="border">{children}</th>
);

const Link = ({ href, children }: { href: string; children: ReactNode }) => (
  <a
    href={href}
    target={
      process.env.BASE_URL && !href.startsWith(process.env.BASE_URL)
        ? "_blank"
        : "_self"
    }
    rel={
      process.env.BASE_URL && !href.startsWith(process.env.BASE_URL)
        ? "noopener noreferrer"
        : ""
    }
  >
    {children}
  </a>
);

const Image = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <div>
      <img className="pt-4 mb-4" src={src} alt={alt} />
      <div>
        <span className="img-description">{alt}</span>
      </div>
      <br />
    </div>
  );
};

const renderOptions = (contentWithLinks: ContentWithLinks): Options => {
  // create an asset block map
  const assetBlockMap = new Map<
    string,
    ContentWithLinks["links"]["assets"]["block"][number]
  >();
  // loop through the assets and add them to the map
  for (const asset of contentWithLinks.links.assets.block) {
    assetBlockMap.set(asset.sys.id, asset);
  }

  return {
    renderMark: {
      [MARKS.BOLD]: (text) => <Text type="bold">{text}</Text>,
      [MARKS.ITALIC]: (text) => <Text type="italic">{text}</Text>,
      [MARKS.UNDERLINE]: (text) => <Text type="underline">{text}</Text>,
      [MARKS.CODE]: (text) => <Text type="code">{text}</Text>,
      [MARKS.SUPERSCRIPT]: (text) => <Text type="superscript">{text}</Text>,
      [MARKS.SUBSCRIPT]: (text) => <Text type="subscript">{text}</Text>,
    },

    renderNode: {
      [BLOCKS.HEADING_1]: (node, children) => (
        <Heading level={1}>{children}</Heading>
      ),
      [BLOCKS.HEADING_2]: (node, children) => (
        <Heading level={2}>{children}</Heading>
      ),
      [BLOCKS.HEADING_3]: (node, children) => (
        <Heading level={3}>{children}</Heading>
      ),
      [BLOCKS.HEADING_4]: (node, children) => (
        <Heading level={4}>{children}</Heading>
      ),
      [BLOCKS.HEADING_5]: (node, children) => (
        <Heading level={5}>{children}</Heading>
      ),
      [BLOCKS.HEADING_6]: (node, children) => (
        <Heading level={6}>{children}</Heading>
      ),
      [BLOCKS.PARAGRAPH]: (node, children) => <Paragraph>{children}</Paragraph>,
      [BLOCKS.UL_LIST]: (node, children) => (
        <UnorderedList>{children}</UnorderedList>
      ),
      [BLOCKS.OL_LIST]: (node, children) => (
        <OrderedList>{children}</OrderedList>
      ),
      [BLOCKS.LIST_ITEM]: (node, children) => <ListItem>{children}</ListItem>,
      [BLOCKS.HR]: (node, children) => <Divider />,
      [BLOCKS.QUOTE]: (node, children) => <Blockquote>{children}</Blockquote>,
      [BLOCKS.TABLE]: (node, children) => <Table>{children}</Table>,
      [BLOCKS.TABLE_ROW]: (node, children) => <TableRow>{children}</TableRow>,
      [BLOCKS.TABLE_CELL]: (node, children) => (
        <TableCell colSpan={node.data.colspan} rowSpan={node.data.rowSpan}>
          {children}
        </TableCell>
      ),
      [BLOCKS.TABLE_HEADER_CELL]: (node, children) => (
        <TableHeaderCell>{children}</TableHeaderCell>
      ),
      [BLOCKS.EMBEDDED_ASSET]: (node, next) => {
        // find the asset in the assetBlockMap by ID
        const asset = assetBlockMap.get(node.data.target.sys.id);

        if (asset) {
          // render the asset accordingly
          return (
            <Image src={asset.url} alt={asset.description || asset.title} />
          );
        }
      },
      [INLINES.HYPERLINK]: ({ data }, children) => (
        <Link href={data.uri}>{children}</Link>
      ),
      [INLINES.ENTRY_HYPERLINK]: ({ data }, children) => (
        <Link href={data.uri}>{children}</Link>
      ),
      [INLINES.ASSET_HYPERLINK]: ({ data }, children) => (
        <Link href={data.uri}>{children}</Link>
      ),
    },

    renderText: (text): ReactNode =>
      text
        .split("\n")
        .reduce<ReactNode[]>(
          (acc, curr, index) => [...acc, index > 0 && <br key={index} />, curr],
          []
        ),
  };
};

export function renderRichText(contentWithLinks: ContentWithLinks) {
  return documentToReactComponents(
    contentWithLinks.json,
    renderOptions(contentWithLinks)
  );
}
