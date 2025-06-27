"use client";

import { useEffect, useState } from "react";
import Head from "next/head";

const Changelog = () => {
  const [changelogHtml, setChangelogHtml] = useState("");

  useEffect(() => {
    const fetchChangelog = async () => {
      const response = await fetch("/api/changelog");
      const text = await response.text();
      const { unified } = await import("unified");
      const remarkParse = await import("remark-parse");
      const remarkHtml = await import("remark-html");

      const result = await unified()
        .use(remarkParse.default)
        .use(remarkHtml.default)
        .process(text);

      setChangelogHtml(result.toString());
    };

    fetchChangelog();
  }, []);

  return (
    <>
      <Head>
        <title>Game Room CHANGELOG</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
      </Head>
      <h1>Game Room: CHANGELOG</h1>
      <div dangerouslySetInnerHTML={{ __html: changelogHtml }} />
    </>
  );
};

export default Changelog;
