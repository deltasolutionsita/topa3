import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TSContext } from 'renderer/providers/TerminalShown';
import {
  addNewTerminal,
  addOutput,
  TerminalState,
} from 'renderer/redux/terminalOutput';

function TerminalOutput() {
  const [terminalShown, setTerminalShown, drawerShown, setDrawerShown] =
    useContext(TSContext);

  const dispatch = useDispatch();
  const shells = useSelector((shells) => shells as TerminalState[]);

  useEffect(() => {
    if (shells.length === 0) setTerminalShown(false);

    window.electron.ipcRenderer.on('shell-created', (_name) => {
      const name = _name as string;
      dispatch(addNewTerminal({ name }));
    });

    window.electron.ipcRenderer.on('shell-output', (_out) => {
      setTerminalShown(true);

      const { projectName, terminalData } = _out as {
        terminalData: string;
        projectName: string;
      };

      dispatch(addOutput({ projectName, terminalData }));
    });
  }, []);

  return (
    <Box
      mt="5%"
      display={shells.length > 0 || terminalShown ? 'block' : 'none'}
      bg={'black'}
      p="2%"
      position={'fixed'}
      bottom={'0'}
      w="100%"
    >
      <HStack>
        <Text color="#EDEDED">
          Output del Terminale Disponibile ({shells.length} shell apert
          {shells.length === 1 ? 'a' : 'e'})
        </Text>
        <Spacer />
        <Button variant="outline" onClick={() => setDrawerShown(true)}>
          <Text>Mostra Output</Text>
        </Button>
      </HStack>

      <Drawer
        isOpen={drawerShown}
        placement="bottom"
        onClose={() => setDrawerShown(false)}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Text mt="1%">Terminali</Text>
          </DrawerHeader>
          <DrawerBody>
            <Tabs colorScheme={'teal'}>
              <TabList>
                {shells.map(({ name }: TerminalState, i: number) => (
                  <Tab key={i}>{name}</Tab>
                ))}
              </TabList>
              <Box p="3%">
                <TabPanels>
                  {shells.map((terminal: TerminalState, i: number) => {
                    return (
                      <TabPanel key={i}>
                        {terminal.out.length > 0 ? (
                          terminal.out.map((output: string, i: number) => (
                            <Text
                              fontFamily={'monospace'}
                              key={i}
                              color={
                                output.includes('$') ? 'yellow.300' : '#EDEDED'
                              }
                            >
                              {output}
                            </Text>
                          ))
                        ) : (
                          <Text mx="10%" opacity={0.5}>
                            Nessun output...😴
                          </Text>
                        )}
                      </TabPanel>
                    );
                  })}
                </TabPanels>
              </Box>
            </Tabs>
          </DrawerBody>

          <DrawerFooter>
            <Button
              variant="outline"
              mr={3}
              onClick={() => setDrawerShown(false)}
            >
              Nascondi
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}

export default TerminalOutput;
