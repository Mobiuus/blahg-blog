import { ChakraProvider } from "@chakra-ui/react";
import PropTypes from "prop-types";

const ChakraProviderWrapper = ({ children }) => (
  <ChakraProvider>
    {children}
  </ChakraProvider>
);

ChakraProviderWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ChakraProviderWrapper;
