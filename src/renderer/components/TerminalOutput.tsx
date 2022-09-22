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
import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TSContext } from 'renderer/providers/TerminalShown';
import {
  addNewTerminal,
  addOutput,
  deleteTerminal,
  TerminalState,
} from 'renderer/redux/terminalOutput';
import { shellKilled } from 'renderer/toasts';

function TerminalOutput() {
  const [terminalShown, setTerminalShown] = useContext(TSContext);
  const [selectedTerminal, setSelectedTerminal] = useState('');
  const [drawerShown, setDrawerShown] = useState(false);

  const dispatch = useDispatch();
  const shells = useSelector((shells) => shells as TerminalState[]);

  useEffect(() => {
    if (shells.length === 0) setTerminalShown(false);

    window.electron.ipcRenderer.on('shell-created', (_name) => {
      const name = _name as string;
      setSelectedTerminal(name);
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
        <Text color="#EDEDED">Output del Terminale Disponibile ({shells.length} shell apert{shells.length === 1 ? "a" : "e"})</Text>
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
            <HStack mt="3%">
              <Text>Output</Text>
              <Spacer />
              <Button
                colorScheme={'red'}
                onClick={() => {
                  window.electron.ipcRenderer
                    .invoke('kill-shell', [selectedTerminal])
                    .then(({ message, length }) => {
                      if (message === 'ok') {
                        dispatch(deleteTerminal({ name: selectedTerminal }));
                        shellKilled(selectedTerminal);
                        if (length === 0) {
                          setTerminalShown(false)
                          setDrawerShown(false)
                        } else if (length !== 0) {
                          setSelectedTerminal(shells[0].name);
                        }
                      }
                    });
                }}
                variant="outline"
              >
                Kill {selectedTerminal}
              </Button>
            </HStack>
          </DrawerHeader>
          <DrawerBody>
            <Tabs onChange={(index) => setSelectedTerminal(shells[index].name)} colorScheme={'teal'}>
              <TabList>
                {shells &&
                  shells.map(({ name }: TerminalState, i: number) => (
                    <Tab key={i}>
                      {name}
                    </Tab>
                  ))}
              </TabList>
              <Box p="3%">
                <TabPanels>
                  {shells &&
                    shells.map((terminal: TerminalState, i: number) => {
                      return (
                        <TabPanel key={i}>
                          {terminal.out.map((output: string, i: number) => (
                            <Text
                              fontFamily={'monospace'}
                              key={i}
                              color={
                                output.includes('$') ? 'yellow.300' : '#EDEDED'
                              }
                            >
                              {output}
                            </Text>
                          ))}
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
