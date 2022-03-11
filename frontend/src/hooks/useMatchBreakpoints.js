import { useState } from 'react'
import base from '../theme/base'
import useIsomorphicEffect from './useIsomorphicEffect'

/**
 * Can't use the media queries from "base.mediaQueries" because of how matchMedia works
 * In order for the listener to trigger we need have have the media query with a range, e.g.
 * (min-width: 370px) and (max-width: 576px)
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList
 */
const mediaQueries = (() => {
  let previousMinWidth = 0

  return Object.keys(base.breakpoints).reduce((accumulatedResult, size, index) => {
    if (index === Object.keys(base.breakpoints).length - 1) {
      return { ...accumulatedResult, [size]: `(min-width: ${previousMinWidth}px)` }
    }

    const minWidth = previousMinWidth
    const maxWidth = base.breakpoints[size]

    // Min width for next iteration.
    previousMinWidth = maxWidth + 1

    return { ...accumulatedResult, [size]: `(min-width: ${minWidth}px) and (max-width: ${maxWidth}px)` }
  }, {})
})()

const getKey = (size) => {
  return `is${size.charAt(0).toUpperCase()}${size.slice(1)}`
}

const getState = () => {
  return Object.keys(mediaQueries).reduce((accumulatedResult, size) => {
    const key = getKey(size)
    if (typeof window === 'undefined') {
      return { ...accumulatedResult, [key]: false }
    }

    const mql = window.matchMedia(mediaQueries[size])

    return { ...accumulatedResult, [key]: mql?.matches ?? false }
  }, {})
}

const useMatchBreakpoints = () => {
  const [state, setState] = useState(() => getState())

  useIsomorphicEffect(() => {
    // Create listeners for each media query returning a function to unsubscribe.
    const handlers = Object.keys(mediaQueries).map((size) => {
      const mql = window.matchMedia(mediaQueries[size])

      const handler = (matchMediaQuery) => {
        const key = getKey(size)
        setState((previousState) => ({
          ...previousState,
          [key]: matchMediaQuery.matches,
        }))
      }

      // Safari < 14 fix
      if (mql.addEventListener) {
        mql.addEventListener('change', handler)
      }

      return () => {
        // Safari < 14 fix
        if (mql.removeEventListener) {
          mql.removeEventListener('change', handler)
        }
      }
    })

    setState(getState())

    return () => {
      handlers.forEach((unsubscribe) => {
        unsubscribe()
      })
    }
  }, [])

  return {
    ...state,
    isMobile: state.isXs || state.isSm,
    isTablet: state.isMd || state.isLg,
    isDesktop: state.isXl || state.isXxl,
  }
}

export default useMatchBreakpoints
