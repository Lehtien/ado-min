// ShareButton.tsx
import React from "react";

interface ShareButtonProps {
  text?: string;
  url?: string;
  hashtags?: string[];
  via?: string;
  className?: string;
  children?: React.ReactNode;
}

const ShareButton: React.FC<ShareButtonProps> = ({
  text = "",
  url = window.location.href,
  hashtags = [],
  via = "",
  className = "",
  children,
}) => {
  const handleShare = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const params = new URLSearchParams({
      text: text,
      url: url,
      ...(hashtags.length && { hashtags: hashtags.join(",") }),
      ...(via && { via: via }),
    });

    const shareUrl = `https://twitter.com/intent/tweet?${params.toString()}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleShare}
      className={`inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-white transition-colors hover:bg-gray-800 ${className}`}
      aria-label="Share on X"
    >
      {children ?? (
        <>
          <XIcon />
          <span>Share on X</span>
        </>
      )}
    </button>
  );
};

// X (Twitter) アイコンコンポーネント
const XIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default ShareButton;
