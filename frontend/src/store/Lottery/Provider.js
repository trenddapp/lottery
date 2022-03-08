import { useState } from 'react'
import { useContractLottery, useInterval } from '../../hooks'
import LotteryContext from './Context'

const LotteryProvider = ({ children }) => {
  const [lotteryStatus, setLotteryStatus] = useState(0)
  const contractLottery = useContractLottery()

  useInterval(() => {
    if (contractLottery === undefined) {
      return
    }

    contractLottery
      .lotteryStatus()
      .then((result) => {
        setLotteryStatus(result)
      })
      .catch((error) => {
        console.log(error)
      })
  }, 10000)

  return <LotteryContext.Provider value={{ lotteryStatus }}>{children}</LotteryContext.Provider>
}

export default LotteryProvider
