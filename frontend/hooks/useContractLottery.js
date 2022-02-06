import { useMemo } from "react";
import { ethers } from "ethers";
import { abiLottery } from "../config/abi";
import { addressLottery } from "../config/constants";
import { useActiveWeb3React } from ".";

const useContractLottery = () => {
  const { library, chainId } = useActiveWeb3React();
  return useMemo(
    () => new ethers.Contract(addressLottery[chainId], abiLottery, library),
    [library]
  );
};

export default useContractLottery;
