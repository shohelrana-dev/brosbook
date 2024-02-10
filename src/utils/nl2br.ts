export function nl2br(str: string) {
   return str.replace(/(\r\n|\r|\n)/g, '<br/>')
}
