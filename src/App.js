import { Container, Heading } from "@chakra-ui/react";

import Search from "./Search";

function App() {
  return (
    <Container mt="5">
      <Heading mb="2">StatsHub</Heading>
      <Search />
    </Container>
  );
}

export default App;
