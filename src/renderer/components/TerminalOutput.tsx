import { Box, Button, Divider, HStack, Spacer, Text } from '@chakra-ui/react';
import { TOPA3Shell } from 'main/store/shellsSlice';
import { useContext, useEffect, useState } from 'react';
import { TSContext } from 'renderer/providers/TerminalShown';
import stripAnsi from 'strip-ansi';

function TerminalOutput() {
  const [isTerminalShown, setIsTerminalShown] = useContext(TSContext);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [projectName, setProjectName] = useState('');
  const [shells, setShells] = useState<TOPA3Shell[]>([]);

  useEffect(() => {
    terminalOutput.length === 0 && setIsTerminalShown(false);
    console.log("pids: ", shells)
    window.electron.ipcRenderer.on('project-commands-output', (_out) => {
      const out = _out as { terminalData: string; projectName: string };

      setIsTerminalShown(true);
      setProjectName(out.projectName);
      setTerminalOutput((prevTerminalOutput) => [
        ...prevTerminalOutput,
        stripAnsi(out.terminalData as string),
      ]);
    });

    window.electron.ipcRenderer.on('get-shells-result', (_shells) => {
      const shells = _shells as TOPA3Shell;
      console.log(shells)
      setShells(prev => [...prev, shells])
    });
  }, []);

  return (
    <Box
      bg={'black'}
      p="2%"
      display={isTerminalShown ? 'block' : 'none'}
      mt="5%"
    >
      <HStack>
        <Text color="#EDEDED">
          Terminal Output | last output: {projectName}
        </Text>
        <Spacer />
        <Button
          colorScheme={'red'}
          onClick={() => {
            window.electron.ipcRenderer.invoke('get-shells', []).then((r) => {
              const shells = r as TOPA3Shell[];
              console.log(shells)
              // shells[0].pid && window.electron.ipcRenderer.invoke('kill-shell', [shells[0].pid])
              // window.electron.ipcRenderer
              //   .invoke('kill-shell', [shells[0].pid])
              //   .then((r) => r === 'done' && console.log('shell killed'));
            });
          }}
          variant="outline"
        >
          Kill
        </Button>
      </HStack>
      <Divider mt="2%" />
      <Box p="3%" mt="-1%">
        {terminalOutput.map((outLine, i) => {
          return (
            <Text
              fontFamily={'monospace'}
              key={i}
              color={outLine.includes('$') ? 'yellow.300' : '#EDEDED'}
            >
              {outLine}
            </Text>
          );
        })}
      </Box>
    </Box>
  );
}

export default TerminalOutput;
