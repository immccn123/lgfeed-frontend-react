import React from "react";
import Prism from "prismjs";
import "prismjs/components/prism-markdown";
import "prismjs/themes/prism.css";

interface CodeSnippetProps {
  code: string;
  language: string;
}

const CodeSnippet: React.FC<CodeSnippetProps> = ({ code, language }) => {
  const highlightedCode = Prism.highlight(
    code,
    Prism.languages[language],
    language,
  );

  return (
    <pre>
      <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
    </pre>
  );
};

export default CodeSnippet;
