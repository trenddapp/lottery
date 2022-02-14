import styled from "styled-components";
import { flexbox } from "styled-system";
import Box from "./Box";

const Flex = styled(Box)`
  display: flex;
  ${flexbox}
`;

export default Flex;
