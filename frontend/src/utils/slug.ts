export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quita acentos y tildes
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-_]/g, '') // Permite solo caracteres alfanuméricos, espacios y guiones
    .replace(/[\s_]+/g, '-') // Reemplaza espacios y guiones bajos por guión medio
    .replace(/^-+|-+$/g, '') // Elimina guiones sobrantes al inicio o final
}
