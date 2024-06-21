// src/components/Bookshelf.jsx
import React, { useRef, useState } from 'react';
import { ChakraProvider, Box, HStack, Image, IconButton } from '@chakra-ui/react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Bookshelf = ({ books }) => {
  const [scroll, setScroll] = useState(0);
  const bookshelfRef = useRef(null);

  const handleScroll = (direction) => {
    if (bookshelfRef.current) {
      const scrollWidth = bookshelfRef.current.scrollWidth;
      if (direction === 'left') {
        setScroll((prev) => Math.max(prev - 200, 0));
      } else {
        setScroll((prev) => Math.min(prev + 200, scrollWidth));
      }
    }
  };

  return (
    <ChakraProvider>
      <Box ref={bookshelfRef} overflowX="scroll" whiteSpace="nowrap" position="relative">
        <HStack spacing="24px">
          {books.map((book, index) => (
            <Box key={index} width="200px" height="300px">
              <Image src={book.coverImage} alt={book.title} />
            </Box>
          ))}
        </HStack>
        <IconButton
          icon={<FaChevronLeft />}
          position="absolute"
          left="0"
          top="50%"
          transform="translateY(-50%)"
          onClick={() => handleScroll('left')}
          aria-label="Scroll left"
        />
        <IconButton
          icon={<FaChevronRight />}
          position="absolute"
          right="0"
          top="50%"
          transform="translateY(-50%)"
          onClick={() => handleScroll('right')}
          aria-label="Scroll right"
        />
      </Box>
    </ChakraProvider>
  );
};

export default Bookshelf;
