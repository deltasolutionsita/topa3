import {
  Box,
  Button,
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

  const dispatch = useDispatch();
  const state = useSelector((state) => state as TerminalState[]);

  useEffect(() => {
    if(state.length === 0) setTerminalShown(false);

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
    <Box mt="5%" display={state.length > 0 || terminalShown ? 'block' : 'none'} bg={'black'} p="2%">
      <HStack>
        <Text color="#EDEDED">Terminal Output</Text>
        <Spacer />
        <Button
          colorScheme={'red'}
          onClick={() => {
            window.electron.ipcRenderer
              .invoke('kill-shell', [selectedTerminal])
              .then((r) => {
                if (r === 'ok') {
                  dispatch(deleteTerminal({ name: selectedTerminal }));
                  shellKilled(selectedTerminal)
                }
              });
          }}
          variant="outline"
        >
          Kill { selectedTerminal }
        </Button>
      </HStack>
      <Tabs>
        <TabList>
          {state &&
            state.map(({ name }: TerminalState, i: number) => (
              <Tab onClick={() => setSelectedTerminal(name)} key={i}>
                {name}
              </Tab>
            ))}
        </TabList>
        <Box p="3%" mt="-1%">
          <TabPanels>
            {state &&
              state.map((terminal: TerminalState, i: number) => {
                return (
                  <TabPanel key={i}>
                    {terminal.out.map((output: string, i: number) => (
                      <Text
                        fontFamily={'monospace'}
                        key={i}
                        color={output.includes('$') ? 'yellow.300' : '#EDEDED'}
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
    </Box>
  );
}

export default TerminalOutput;
