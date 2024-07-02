// src/components/Bookshelf.tsx

import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Icon,
  HStack,
  Flex,
  Heading,
  Image,
  Center,
} from "@chakra-ui/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Book } from "../lib/books";

interface BookshelfProps {
  books: Book[];
}

const Bookshelf: React.FC<BookshelfProps> = ({ books }) => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [scroll, setScroll] = useState(0);

  const bookshelfRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const scrollRightRef = useRef<HTMLDivElement>(null);
  const scrollLeftRef = useRef<HTMLDivElement>(null);

  const width = 41.5;
  const height = 220;
  const margin = 12; // Margin between books

  const spineWidth = `${width}px`;
  const coverWidth = `${width * 4}px`;
  const bookWidth = `${width * 5}px`;
  const bookHeight = `${height}px`;

  const minScroll = 0;
  const maxScroll = (width + margin) * (books.length - 1);

  const boundedScroll = useCallback((scrollX: number) => {
    setScroll(Math.max(minScroll, Math.min(maxScroll, scrollX)));
  }, [maxScroll]);

  const handleScroll = (direction: 'left' | 'right') => {
    const increment = direction === 'right' ? width + margin : -(width + margin);
    boundedScroll(scroll + increment);
  };

  return (
    <Box position="relative" ref={bookshelfRef}>
      <svg style={{ position: "absolute", visibility: "hidden" }}>
        <filter id="paper-texture">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="8" result="noise" />
          <feDiffuseLighting in="noise" lightingColor="white" surfaceScale="1" result="diffLight">
            <feDistantLight azimuth="45" elevation="35" />
          </feDiffuseLighting>
        </filter>
      </svg>

      <Box
        position="absolute"
        left="-28px"
        height="100%"
        display={scroll > minScroll ? "block" : "none"}
      >
        <Center
          ref={scrollLeftRef}
          borderRadius="md"
          height="100%"
          width="28px"
          _hover={{ bg: "gray.100" }}
          cursor="pointer"
          onClick={() => handleScroll('left')}
        >
          <Icon as={FaChevronLeft} boxSize={3} />
        </Center>
      </Box>
      <HStack
        alignItems="center"
        gap={`${margin}px`}
        overflowX="hidden"
        cursor="grab"
        ref={viewportRef}
      >
        {books.map((book) => (
          <Box
            key={book.slug}
            onClick={() => setSelectedBook(selectedBook?.slug === book.slug ? null : book)}
            style={{
              transform: `translateX(-${scroll}px)`,
              width: selectedBook?.slug === book.slug ? bookWidth : spineWidth,
              transition: 'all 500ms ease',
              perspective: '1000px',
            }}
          >
            <Flex
              alignItems="flex-start"
              justifyContent="center"
              width={spineWidth}
              height={bookHeight}
              backgroundColor={book.spineColor}
              color={book.textColor}
              transform={`rotateY(${selectedBook?.slug === book.slug ? "-60deg" : "0deg"})`}
              transition="all 500ms ease"
              style={{ 
                transformStyle: "preserve-3d",
                filter: 'url(#paper-texture)',
              }}
            >
              <Heading
                mt="12px"
                as="h2"
                fontSize="xs"
                fontFamily="DM Sans, sans-serif"
                style={{ writingMode: "vertical-rl" }}
                userSelect="none"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                overflow="hidden"
                maxHeight={`${height - 24}px`}
              >
                {book.title}
              </Heading>
            </Flex>
            <Box
              position="absolute"
              top={0}
              left={spineWidth}
              overflow="hidden"
              transformOrigin="left"
              transform={`rotateY(${selectedBook?.slug === book.slug ? "30deg" : "88.8deg"})`}
              transition="all 500ms ease"
              style={{ 
                transformStyle: "preserve-3d",
                filter: 'url(#paper-texture)',
              }}
            >
              <Image
                src={book.coverImage}
                alt={book.title}
                width={coverWidth}
                height={bookHeight}
                transition="all 500ms ease"
              />
            </Box>
          </Box>
        ))}
      </HStack>
      <Box
        position="absolute"
        right="-28px"
        height="100%"
        top={0}
        display={scroll < maxScroll ? "block" : "none"}
      >
        <Center
          ref={scrollRightRef}
          height="100%"
          borderRadius="md"
          width="28px"
          _hover={{ bg: "gray.100" }}
          cursor="pointer"
          onClick={() => handleScroll('right')}
        >
          <Icon as={FaChevronRight} boxSize={3} />
        </Center>
      </Box>
    </Box>
  );
};

export default Bookshelf;