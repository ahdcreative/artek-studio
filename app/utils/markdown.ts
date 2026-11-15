function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatInline(text: string): string {
  let out = escapeHtml(text);

  // Markdown badge images inside links: [![alt](img)](href) -> clean CTA pill link
  out = out.replace(
    /\[!\[([^\]]*)\]\((https?:\/\/[^)]+)\)\]\((https?:\/\/[^)]+)\)/g,
    '<a href="$3" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  // Standard markdown links [label](https://...)
  out = out.replace(
    /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  // Inline code
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  // Bold + italic
  out = out.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
  // Bold
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // Italic
  out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  return out;
}

export function renderStudioMarkdown(markdown: string): string {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const html: string[] = [];
  let inUl = false;
  let inOl = false;

  const closeLists = () => {
    if (inUl) {
      html.push('</ul>');
      inUl = false;
    }
    if (inOl) {
      html.push('</ol>');
      inOl = false;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      closeLists();
      continue;
    }

    if (line === '---' || line === '***') {
      closeLists();
      html.push('<hr />');
      continue;
    }

    if (line.startsWith('### ')) {
      closeLists();
      html.push(`<h3>${formatInline(line.slice(4))}</h3>`);
      continue;
    }

    if (line.startsWith('## ')) {
      closeLists();
      html.push(`<h2>${formatInline(line.slice(3))}</h2>`);
      continue;
    }

    if (line.startsWith('# ')) {
      closeLists();
      html.push(`<h2>${formatInline(line.slice(2))}</h2>`);
      continue;
    }

    if (line.startsWith('> ')) {
      closeLists();
      html.push(`<blockquote>${formatInline(line.slice(2))}</blockquote>`);
      continue;
    }

    const ulMatch = line.match(/^[-*]\s+(.+)$/);
    if (ulMatch?.[1]) {
      if (inOl) {
        html.push('</ol>');
        inOl = false;
      }
      if (!inUl) {
        html.push('<ul>');
        inUl = true;
      }
      html.push(`<li>${formatInline(ulMatch[1])}</li>`);
      continue;
    }

    const olMatch = line.match(/^\d+\.\s+(.+)$/);
    if (olMatch?.[1]) {
      if (inUl) {
        html.push('</ul>');
        inUl = false;
      }
      if (!inOl) {
        html.push('<ol>');
        inOl = true;
      }
      html.push(`<li>${formatInline(olMatch[1])}</li>`);
      continue;
    }

    closeLists();
    html.push(`<p>${formatInline(line)}</p>`);
  }

  closeLists();
  return html.join('\n');
}
