import { useEffect, useState, useMemo, RefObject, useCallback } from 'react'

const useObserver = (
  ref: RefObject<HTMLDivElement>,
  options?: IntersectionObserverInit
) => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const observer = useMemo(
    () =>
      new IntersectionObserver(([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      }, options),
    [options]
  )
  const resetObserver = useCallback(() => setIsIntersecting(false), [])

  useEffect(() => {
    const element = ref.current
    if (!element) return
    
    observer.observe(element)
    return () => {
      observer.unobserve(element)
    }
  })

  return { isIntersecting, resetObserver }
}

export default useObserver
