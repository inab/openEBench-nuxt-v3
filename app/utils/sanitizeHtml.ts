import DOMPurify from 'dompurify';

const ESCAPES: Record<string, string> = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;',
};

/**
 * Sanitizes an HTML string with DOMPurify, keeping `target` on links.
 * Without a DOM (SSR) the string is escaped, so nothing unsafe is ever emitted.
 */
export function sanitizeHtml(html: string | null | undefined): string {
	const value = html ?? '';
	if (typeof DOMPurify.sanitize !== 'function' || !DOMPurify.isSupported) {
		return value.replace(/[&<>"']/g, (c) => ESCAPES[c] as string);
	}
	return DOMPurify.sanitize(value, { ADD_ATTR: ['target'] });
}
