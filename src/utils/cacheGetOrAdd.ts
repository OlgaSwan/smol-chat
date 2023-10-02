type ItemCached<T> = {
  item: T
  timestamp: number
}

export const cacheGetOrAdd = async <T>(
  key: string,
  addCallback: () => Promise<T>
): Promise<T> => {
  const itemCached = localStorage.getItem(key)
  if (itemCached) {
    const item: ItemCached<T> = JSON.parse(itemCached)
    const timestamp = Date.now() - item.timestamp
    if (timestamp >= 60000) {
      const item = await addCallback()
      const itemCachedNew: ItemCached<T> = {
        item: item,
        timestamp: Date.now(),
      }
      localStorage.setItem(key, JSON.stringify(itemCachedNew))
      return item as T
    }
    return item.item as T
  } else {
    const item = await addCallback()
    const itemCached: ItemCached<T> = {
      item: item,
      timestamp: Date.now(),
    }
    localStorage.setItem(key, JSON.stringify(itemCached))
    return item as T
  }
}
