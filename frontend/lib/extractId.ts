export const extractId = (slug: string) => {
  const parts = slug.split('/')
  return parts[parts.length - 1]
}
