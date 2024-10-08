import { useState } from "react";
import { MdCheck, MdContentCopy } from "react-icons/md";

export default function CopyText({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        // Reset copied state after 2 seconds
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => console.error("Failed to copy text: ", err));
  };

  return (
    <div
      className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-200 px-2 cursor-pointer overflow-hidden"
      onClick={copyToClipboard}
    >
      <span>{copied ? <MdCheck /> : <MdContentCopy />}</span>
      <p className="overflow-hidden whitespace-nowrap text-ellipsis">{text}</p>
    </div>
  );
}
