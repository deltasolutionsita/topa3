import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Box,
  Text,
  Heading,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react';
import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { TerminalState } from 'renderer/redux/terminalOutput';
import GitterActions from './GitterActions';
import { GitterContext } from './GitterProvider';

function Gitter({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [gitterElements] = useContext(GitterContext);
  const allShells = useSelector((shells) => shells as TerminalState[]);
  const gitShells = allShells.filter((shell) => shell.name.includes('(git)'));

  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Gitter</DrawerHeader>

        <DrawerBody>
          <Box mt="5%">
            {gitterElements.length > 0 ? (
              <>
                <Box p="5%" borderWidth={'1px'} rounded="2xl">
                  <Text textAlign={"center"} mb="5%" opacity={0.6}>
                    Progetti aperti:{' '}
                  </Text>
                  <Tabs isFitted colorScheme={'teal'} variant="line">
                    <TabList>
                      {gitterElements.map((gitterElement, i) => (
                        <Tab key={i}>
                          <Heading fontSize={'md'}>
                            {gitterElement.parsedDir}
                          </Heading>
                        </Tab>
                      ))}
                    </TabList>
                    <TabPanels>
                      {gitterElements.map((gitterElement, i) => (
                        <GitterActions key={i} project={gitterElement} />
                      ))}
                    </TabPanels>
                  </Tabs>
                </Box>
                {gitShells.length > 0 && (
                  <Box mt="50%" borderWidth={'1px'} rounded="2xl" p="5%">
                    <Tabs colorScheme={'teal'} isFitted>
                      <TabList>
                        {gitShells.map(({ name }: TerminalState, i: number) => (
                          <Tab key={i}>{name}</Tab>
                        ))}
                      </TabList>
                      <TabPanels>
                        {gitShells.map((terminal: TerminalState, i: number) => {
                          return (
                            <TabPanel key={i}>
                              {terminal.out.map((output: string, i: number) => (
                                <Text
                                  fontFamily={'monospace'}
                                  key={i}
                                  color={
                                    output.includes('$')
                                      ? 'yellow.300'
                                      : '#EDEDED'
                                  }
                                >
                                  {output}
                                </Text>
                              ))}
                            </TabPanel>
                          );
                        })}
                      </TabPanels>
                    </Tabs>
                  </Box>
                )}
              </>
            ) : (
              <Text fontStyle={'italic'} opacity={0.7}>
                Nessun progetto aperto...
              </Text>
            )}
          </Box>
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Chiudi
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default Gitter;
