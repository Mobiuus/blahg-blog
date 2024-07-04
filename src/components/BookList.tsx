import React from 'react';
import { ChakraProvider, Stack, Divider, Flex, VStack, Heading, Text } from "@chakra-ui/react";

interface Book {
  title: string;
  slug: string;
  author: string;
  date: string;
  rating: number;
  coverImage: string;
  summary: string;
}

interface BookListProps {
  books: Book[];
}

const BookList: React.FC<BookListProps> = ({ books }) => {
  return (
    <ChakraProvider>
      <Stack spacing={5}>
        {books.map((book: Book, index: number) => (
          <Stack key={book.title} scrollMarginTop={20}>
            <Stack>
              {index > 0 && <Divider mb={3} width="100%" />}
              <Flex direction="row" align="flex-start" gap={6}>
                <img
                  style={{
                    border: "1px solid",
                    borderColor: "var(--chakra-colors-gray-200)",
                    height: "160px"
                  }}
                  src={book.coverImage}
                  alt={book.title}
                />
                <VStack align="flex-start" flexGrow={1}>
                  <a href={`/books/${book.slug}`}>
                    <Heading as="h2" size="md">{book.title}</Heading>
                  </a>
                  <Text color="#999" fontSize="md">
                    {book.author}
                  </Text>
                  <Text color="#666">
                    Read: {book.date} • Rating: {book.rating}/10
                  </Text>
                  <div dangerouslySetInnerHTML={{ __html: book.summary.replace(/\n/g, "<br>") }} />
                </VStack>
              </Flex>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </ChakraProvider>
  );
};

export default BookList;
