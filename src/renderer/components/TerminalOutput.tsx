import { Box, Button, Divider, HStack, Spacer, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import stripAnsi from 'strip-ansi';

function TerminalOutput() {
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [projectName, setProjectName] = useState('');

  useEffect(() => {
    window.electron.ipcRenderer.on('shell-output', (_out) => {
      const out = _out as { terminalData: string; projectName: string };

      setProjectName(out.projectName);
      setTerminalOutput((prevTerminalOutput) => [
        ...prevTerminalOutput,
        stripAnsi(out.terminalData as string),
      ]);
    });
  }, []);

  return (
    <Box
      bg={'black'}
      p="2%"
    >
      <HStack>
        <Text color="#EDEDED">
          Terminal Output | last output: {projectName}
        </Text>
        <Spacer />
        <Button
          colorScheme={'red'}
          onClick={() => {
            // console.log("sono triste, non so che fare...")
            window.electron.ipcRenderer.invoke('kill-shells', []).then((r) => {
              alert(r)
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
