import { Box, Heading, HStack, Spacer, Text } from '@chakra-ui/react';
import { AiFillGithub } from 'react-icons/ai';
function SplashScreen() {
  return (
    <Box p="5%">
      <Heading
        position={'relative'}
        _after={{
          content: "''",
          width: '65%',
          height: '30%',
          position: 'absolute',
          bottom: 1,
          left: 0,
          bg: 'teal',
          zIndex: -1,
        }}
        textAlign={'left'}
        fontSize="7xl"
      >
        TOPA3
      </Heading>
      <Text mt="5%" opacity={0.5}>
        Work{' '}
        <i>
          <b>smarter</b>
        </i>
        , not <i>harder</i>
      </Text>
      <HStack mt="20%">
        <Text fontSize={'sm'} opacity={0.25}>
          ©{new Date().getFullYear()} Delta Solutions | Fabrizio Piperno
        </Text>
        <Spacer />
        <HStack textDecoration={"underline"} onClick={() => {
          window.electron.ipcRenderer.invoke('open-github', [])
        }} cursor="pointer">
          <AiFillGithub opacity={0.25} />
          <Text fontSize={'sm'} opacity={0.25}>
            Github
          </Text>
        </HStack>
      </HStack>
    </Box>
  );
}

export default SplashScreen;
