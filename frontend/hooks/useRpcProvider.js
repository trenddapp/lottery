import { ethers } from "ethers";
import { defaultRpcUrl } from "../config/constants";

const rpcProvider = new ethers.providers.StaticJsonRpcProvider(defaultRpcUrl);

const useRpcProvider = () => {
  return rpcProvider;
};

export default useRpcProvider;
