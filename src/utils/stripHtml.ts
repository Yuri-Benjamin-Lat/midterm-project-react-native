// utils/stripHtml.ts

/**
 * Converts an HTML string from the API into clean, readable plain text.
 * Handles headings, list items, paragraphs, and inline tags.
 */
export const stripHtml = (html: string): string => {
  if (!html) return '';

  return html
    // Block-level: headings → bold-style text + newline
    .replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, (_match, content) => `\n${content.trim()}\n`)
    // List items → bullet points
    .replace(/<li[^>]*>(.*?)<\/li>/gi, (_match, content) => `• ${content.trim()}\n`)
    // Paragraphs & divs → newlines
    .replace(/<\/(p|div|section|article)>/gi, '\n')
    // Line breaks
    .replace(/<br\s*\/?>/gi, '\n')
    // Strip all remaining tags
    .replace(/<[^>]+>/g, '')
    // Decode common HTML entities
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    // Collapse 3+ newlines into 2
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};