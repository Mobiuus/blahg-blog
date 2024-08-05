import React from 'react';
import { ChakraProvider } from "@chakra-ui/react";

const ChakraProviderWrapper = ({ children }) => (
  <ChakraProvider>
    {children}
  </ChakraProvider>
);

export default ChakraProviderWrapper;