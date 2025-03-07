import React from 'react';
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/theme-utils";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'var(--background-color)',
        color: 'var(--text-color)',
      },
    },
  },
  config: {
    initialColorMode: 'system',
    useSystemColorMode: true,
  },
});

const ChakraProviderWrapper = ({ children }) => (
  <ChakraProvider theme={theme}>
    {children}
  </ChakraProvider>
);

export default ChakraProviderWrapper;