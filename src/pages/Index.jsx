import React, { useState, useEffect } from "react";
import { Box, Heading, Link, List, ListItem, Spinner, Text } from "@chakra-ui/react";

const Index = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("https://hacker-news.firebaseio.com/v0/newstories.json");
        const postIds = await response.json();
        const latestPostIds = postIds.slice(0, 5);

        const postPromises = latestPostIds.map(async (postId) => {
          const postResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${postId}.json`);
          return await postResponse.json();
        });

        const latestPosts = await Promise.all(postPromises);
        setPosts(latestPosts);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <Box maxWidth="600px" margin="0 auto" padding="20px">
      <Heading as="h1" size="xl" marginBottom="20px">
        Latest Hacker News Posts
      </Heading>
      {isLoading ? (
        <Spinner size="xl" />
      ) : (
        <List spacing={4}>
          {posts.map((post) => (
            <ListItem key={post.id}>
              <Link href={post.url} isExternal>
                <Text fontSize="xl" fontWeight="bold">
                  {post.title}
                </Text>
              </Link>
              <Text fontSize="sm" color="gray.500">
                By {post.by}
              </Text>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default Index;
