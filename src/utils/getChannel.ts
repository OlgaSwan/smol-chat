export const getChannel = (collection_id: string): string => {
  return `databases.${
    import.meta.env.VITE_DATABASE_ID
  }.collections.${collection_id}.documents`
}
