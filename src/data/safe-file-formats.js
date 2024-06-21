const safeFileFormats = [
  'image/jpeg', // JPEG
  'image/png', // PNG
  'image/gif', // GIF (use with caution due to potential animation size issues)
  'video/mp4', // MP4
  'video/webm' // WebM
]

export const safeFormats = [
  'png', 'jpeg', 'jpg', 'bmp', 'gif', 'mp4', 'mpeg', 'webm', '3gp', 'doc', 'docx', 'pdf', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'rtf', 'mp3', 'ogg', 'm4a']

export const safeDocFormats = [
  '.doc',
  '.docx',
  '.odt',
  '.pdf',
  '.ppt',
  '.pptx',
  '.rtf',
  '.txt',
  '.xls',
  '.xlsx',
 /*  '.zip',
  '.rar',
  '.7z',
  '.tar',
  '.gz' */
]

export default safeFileFormats
