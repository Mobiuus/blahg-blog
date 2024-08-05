import React from 'react';
import { ChakraProvider } from "@chakra-ui/react";

const ChakraProviderWrapper = ({ children }) => (
  <ChakraProvider>
    {children}
  </ChakraProvider>
);

ChakraProviderWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ChakraProviderWrapper;
