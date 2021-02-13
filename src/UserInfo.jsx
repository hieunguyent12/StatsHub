import {
  Avatar,
  Text,
  Button,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Spinner,
  Link,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
} from "@chakra-ui/react";

function UserInfo({ userInfo, modalData }) {
  return (
    <Modal isOpen={modalData.isOpen} onClose={modalData.onClose}>
      <ModalOverlay />
      <ModalContent minH="200px">
        {!userInfo ? (
          <Box
            d="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minH="200px"
          >
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
            <Text>Loading...</Text>
          </Box>
        ) : (
          <>
            <Box d="flex" p="4">
              <Avatar
                name={userInfo.name || userInfo.login}
                src={userInfo.avatar_url}
              />
              <Box
                ml="3"
                d="flex"
                flexDirection="column"
                justifyContent="center"
              >
                <Text fontWeight="bold" fontSize="lg">
                  {userInfo.name || userInfo.login}
                </Text>
                <Text fontSize="sm">{userInfo.bio}</Text>
              </Box>
            </Box>
            <ModalCloseButton />
            <ModalBody>
              <StatGroup>
                <Stat>
                  <StatLabel>Followers</StatLabel>
                  <StatNumber>{userInfo.followers}</StatNumber>
                </Stat>

                <Stat>
                  <StatLabel>Following</StatLabel>
                  <StatNumber>{userInfo.following}</StatNumber>
                </Stat>

                <Stat>
                  <StatLabel>Repos</StatLabel>
                  <StatNumber>{userInfo.public_repos}</StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>Gists</StatLabel>
                  <StatNumber>{userInfo.public_gists}</StatNumber>
                </Stat>
              </StatGroup>
            </ModalBody>
            <ModalFooter>
              <Button mr="3">
                <Link href={userInfo.html_url} target="_blank">
                  View Github
                </Link>
              </Button>
              <Button>
                <Link href={userInfo.html_url} target="_blank">
                  View repos
                </Link>
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

/*
    <div>
      <p>Name: {userInfo.name}</p>
      <a href={userInfo.html_url}>View on Github</a>
      <p>Followers: {userInfo.followers}</p>
      <p>Following: {userInfo.following}</p>
      <p>Created at: {userInfo.created_at}</p>
      <p>Repos: {userInfo.public_repos}</p>
      {userInfo.bio && <p>{userInfo.bio}</p>}
      <img src={userInfo.avatar_url} />
    </div> */

export default UserInfo;
