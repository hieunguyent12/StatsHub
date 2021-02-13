import { useState } from "react";

import {
  Box,
  Input,
  Button,
  FormControl,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";

import parseHeaders from "parse-link-header";

import UserInfo from "./UserInfo";
import { githubAPI } from "./axiosInstance";

const baseURL = `https://api.github.com/search/users?`;

function Search() {
  const [content, setContent] = useState("");
  const [apiData, setApiData] = useState({
    suggestions: null,
    previous: null,
    next: null,
    currentUsername: null,
    cantFindUser: false,
  });
  const [selectedUser, setSelectedUser] = useState({
    isLoading: false,
    data: null,
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const gatherSuggestions = async (e) => {
    e.preventDefault();
    const { response, parsedResponseHeaders } = await fetchGithub(content, 1);
    // make sure that username exists
    if (response.data.total_count !== 0) {
      let pagination = {
        next: null,
        previous: null,
      };

      if (parsedResponseHeaders) {
        pagination.previous = parsedResponseHeaders.prev
          ? parsedResponseHeaders.prev.page
          : null;
        pagination.next = parsedResponseHeaders.next
          ? parsedResponseHeaders.next.page
          : null;
      }
      setApiData({
        suggestions: response.data,
        currentUsername: content,
        cantFindUser: false,
        ...pagination,
      });
    } else {
      setApiData({
        suggestions: null,
        previous: null,
        next: null,
        currentUsername: null,
        cantFindUser: true,
      });
    }
  };

  const getNext = async () => {
    const data = await fetchGithub(apiData.currentUsername, apiData.next);
    if (data) {
      const { response, parsedResponseHeaders } = data;
      setApiData({
        ...apiData,
        suggestions: response.data,
        previous: parsedResponseHeaders.prev
          ? parsedResponseHeaders.prev.page
          : null,
        next: parsedResponseHeaders.next
          ? parsedResponseHeaders.next.page
          : null,
        currentUsername: apiData.currentUsername,
      });
    }
  };

  const getPrevious = async () => {
    const data = await fetchGithub(apiData.currentUsername, apiData.previous);
    if (data) {
      const { response, parsedResponseHeaders } = data;
      setApiData({
        ...apiData,
        suggestions: response.data,
        previous: parsedResponseHeaders.prev
          ? parsedResponseHeaders.prev.page
          : null,
        next: parsedResponseHeaders.next
          ? parsedResponseHeaders.next.page
          : null,
        currentUsername: apiData.currentUsername,
      });
    }
  };

  const onChange = (e) => {
    setContent(e.target.value);
  };

  const onSelectUser = async (username) => {
    if (selectedUser) {
      if (username === selectedUser.login) {
        return;
      }
    }
    onOpen();
    setSelectedUser({
      isLoading: true,
      data: null,
    });

    const response = await githubAPI.get(
      `https://api.github.com/users/${username}`
    );

    setSelectedUser({
      isLoading: false,
      data: response.data,
    });
  };

  return (
    <Box>
      <form>
        <FormControl display="flex">
          <Input
            type="text"
            placeholder="Search Github..."
            onChange={onChange}
            value={content}
          />
          <Button
            onClick={gatherSuggestions}
            type="submit"
            ml="2"
            w="120px"
            colorScheme="blue"
            variant="outline"
          >
            Search
          </Button>
        </FormControl>
      </form>
      {apiData.cantFindUser && (
        <Text mt="3">Uh oh, this user doesn't exist!</Text>
      )}
      {apiData.suggestions !== null && (
        <Box mt="3">
          <Text>Users found: </Text>
          <VStack align="start" maxH="500px" overflow="auto">
            {apiData.suggestions.items.map((suggestion) => (
              <Box
                key={suggestion.id}
                borderWidth="1px"
                borderRadius="md"
                w="100%"
                h="50px"
                _hover={{
                  shadow: "md",
                  cursor: "pointer",
                  backgroundColor: "gray.50",
                }}
                onClick={() => onSelectUser(suggestion.login)}
              >
                <Text p="3">{suggestion.login}</Text>
              </Box>
            ))}
          </VStack>
          <Box textAlign="center" mt="3">
            <Button
              onClick={() => getPrevious()}
              mr="3"
              w="45%"
              leftIcon={<ArrowBackIcon />}
              isDisabled={apiData.previous ? false : true}
            >
              Prev
            </Button>
            <Button
              onClick={() => getNext()}
              w="45%"
              rightIcon={<ArrowForwardIcon />}
              isDisabled={apiData.next ? false : true}
            >
              Next
            </Button>
          </Box>
        </Box>
      )}

      <UserInfo userInfo={selectedUser.data} modalData={{ isOpen, onClose }} />
    </Box>
  );
}

async function fetchGithub(username, pageNumber) {
  if (pageNumber === null) return;

  const queryString = `q=${encodeURIComponent(
    `${username} in:login type:user `
  )} &page=${pageNumber}`;

  const finalSearchURL = baseURL + queryString;

  const response = await githubAPI.get(finalSearchURL);
  let parsedResponseHeaders;

  if (response.data.total_count !== 0 && response.headers.link) {
    parsedResponseHeaders = parseHeaders(response.headers.link);
  } else {
    parsedResponseHeaders = null;
  }

  return { response, parsedResponseHeaders };
}

export default Search;
