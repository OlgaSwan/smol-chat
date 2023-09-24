import React, { useEffect, useState, useMemo, MutableRefObject } from 'react'

const useObserver = (
  ref: MutableRefObject<HTMLDivElement | null>,
  data: object[]
) => {
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
  }, [data, observer])

  return isIntersecting
}

export default useObserver
