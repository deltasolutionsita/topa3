import { Box, Heading, HStack, Slide, Spacer, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { AiFillGithub } from 'react-icons/ai';

const loadingElements = [
  'Treno Regionale 12918',
  'audiodescrizione di questo programma',
  'assets',
  'trenitalia',
  'biscotti',
  'topa3',
  'non siamo su Photoshop',
  'caricamenti',
];

function SplashScreen() {
  const [loadingElement, setLoadingElement] = useState(loadingElements[0]);
  useEffect(() => {
    const interval = setInterval(() => {
      const randomElement =
        loadingElements[Math.floor(Math.random() * loadingElements.length)];
      setLoadingElement(randomElement);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <Slide in={true}>
      <Box p="5%">
        <Box>
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
        </Box>
        <Text mt="5%" opacity={0.5}>
          Work{' '}
          <i>
            <b>smarter</b>
          </i>
          , not <i>harder</i>
        </Text>
        <Text opacity={0.3} mt="5%">
          Loading {loadingElement}...
        </Text>
        <HStack mt="10%">
          <Text fontSize={'sm'} opacity={0.25}>
            ©{new Date().getFullYear()} Delta Solutions | Fabrizio Piperno
          </Text>
          <Spacer />
          <HStack
            textDecoration={'underline'}
            onClick={() => {
              window.electron.ipcRenderer.invoke('open-github', []);
            }}
            cursor="pointer"
          >
            <AiFillGithub opacity={0.25} />
            <Text fontSize={'sm'} opacity={0.25}>
              Github
            </Text>
          </HStack>
        </HStack>
      </Box>
    </Slide>
  );
}

export default SplashScreen;
