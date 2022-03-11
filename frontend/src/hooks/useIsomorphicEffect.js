import { useEffect, useLayoutEffect } from 'react'

const useIsomorphicEffect = () => {
  if (typeof window === 'undefined') {
    return useEffect
  }

  return useLayoutEffect
}

export default useIsomorphicEffect
