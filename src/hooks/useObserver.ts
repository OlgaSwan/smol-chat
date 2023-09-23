import React, { useEffect, useState, useMemo, MutableRefObject } from 'react'

const useObserver = (ref: MutableRefObject<HTMLDivElement | null>) => {
  const [isIntersecting, setIsIntersecting] = useState(false)

  const observer = useMemo(
    () =>
      new IntersectionObserver(([entry]) =>
        setIsIntersecting(entry.isIntersecting)
      ),
    []
  )

  useEffect(() => {
    if (ref.current) observer.observe(ref.current)
    return () => {
      observer.disconnect()
    }
  }, [ref, observer])

  return isIntersecting
}

export default useObserver
