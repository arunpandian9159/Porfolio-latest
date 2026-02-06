/**
 * Utility functions for video handling
 */

/**
 * Checks if a URL is a Google Drive link
 * @param {string} url - The URL to check
 * @returns {boolean} - True if it's a Drive link
 */
export const isGoogleDriveUrl = (url) => {
  if (!url) return false;
  return url.includes("drive.google.com");
};

/**
 * Converts a Google Drive link to an embeddable preview URL
 * @param {string} url - The original Drive URL
 * @returns {string} - The embeddable preview URL
 */
export const getDriveEmbedUrl = (url) => {
  if (!url) return "";
  if (!url.includes("drive.google.com")) return url;

  // Replace /view or /edit with /preview
  let embedUrl = url.replace(/\/view(\?.*)?$/, "/preview");
  embedUrl = embedUrl.replace(/\/edit(\?.*)?$/, "/preview");

  // If it doesn't have /preview at the end, and it follows the file/d/ID format
  if (!embedUrl.includes("/preview")) {
    const match = embedUrl.match(/\/file\/d\/([^/]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
  }

  return embedUrl;
};
