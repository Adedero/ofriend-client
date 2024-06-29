import DOMPurify from 'dompurify';

const generateHTML = (text) => {
  const urlRegex = /(\b[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b[-a-zA-Z0-9()@:%_+.~#?&//=]*)/gi;

  const breakRegex = /\n/g;

  const mentionRegex = /(@[a-zA-Z0-9_]+)/g;

  const rawHTML = `<p>${
    text
    .replace(urlRegex, '<a href="$1" class="text-blue-600 hover:underline">$1</a>')
    .replace(breakRegex, '<br>')
    .replace(mentionRegex, '<a href="#" class="mention-link">$1</a>')
  }</p>`
  
  const sanitized =  DOMPurify.sanitize(rawHTML, {
    ALLOWED_TAGS: ['a', 'span', 'br', 'p'],
    ALLOWED_ATTR: ['class', 'href']
  });

  return sanitized;
}

export default generateHTML;
