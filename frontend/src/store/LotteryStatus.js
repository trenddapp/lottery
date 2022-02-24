import { createContext, useState } from 'react'
import { useContractLottery, useInterval } from '../hooks'

export const LotteryStatusNotStarted = 0
export const LotteryStatusOpen = 1
export const LotteryStatusClosed = 2
export const LotteryStatusCompleted = 3

export const LotteryStatusContext = createContext(LotteryStatusNotStarted)

export const LotteryStatusProvider = ({ children }) => {
  const contractLottery = useContractLottery()
  const [lotteryStatus, setLotteryStatus] = useState(LotteryStatusNotStarted)

  useInterval(() => {
    contractLottery.lotteryStatus().then((lotteryStatus) => {
      setLotteryStatus(lotteryStatus)
    })
  }, 60000)

  return <LotteryStatusContext.Provider value={lotteryStatus}>{children}</LotteryStatusContext.Provider>
}

export default LotteryStatusContext
