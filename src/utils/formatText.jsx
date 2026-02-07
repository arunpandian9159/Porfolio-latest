/**
 * Parse markdown-style bold text (**text**) into JSX with <strong> tags
 * @param {string} text - Text containing **bold** markers
 * @returns {React.ReactNode} - JSX with bold text rendered as <strong> tags
 */
export const formatBoldText = (text) => {
  if (!text || typeof text !== "string") return text;

  // Split by **text** pattern
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    // Check if this part is a bold marker
    if (part.startsWith("**") && part.endsWith("**")) {
      // Extract text between ** markers
      const boldText = part.slice(2, -2);
      return (
        <strong key={index} className="font-semibold">
          {boldText}
        </strong>
      ); 
    }
    return part;
  });
};
