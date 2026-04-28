// @ts-nocheck
import type { JSX } from "solid-js";

export type PrismTheme = Record<string, unknown>;

export const themes = {
  vsDark: {
    plain: {
      backgroundColor: "transparent",
      color: "inherit",
    },
  },
};

type Token = { content: string };

export function Highlight(props: {
  code: string;
  language?: string;
  theme?: PrismTheme;
  children: (input: {
    className: string;
    style: JSX.CSSProperties;
    tokens: Token[][];
    getLineProps: (input: { line: Token[] }) => Record<string, unknown>;
    getTokenProps: (input: { token: Token }) => Record<string, unknown>;
  }) => JSX.Element;
}) {
  const tokens = () =>
    props.code.split("\n").map((line) => [{ content: line }]);
  return (
    <>
      {props.children({
        className: "solid-highlight",
        style: { background: "transparent" },
        tokens: tokens(),
        getLineProps: () => ({}),
        getTokenProps: ({ token }) => ({ children: token.content }),
      })}
    </>
  );
}

