import { Box, Divider, Text } from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import { TSContext } from 'renderer/providers/TerminalShown';
import stripAnsi from 'strip-ansi';

function TerminalOutput() {
  const [isTerminalShown, setIsTerminalShown] = useContext(TSContext);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [projectName, setProjectName] = useState('');
  
  useEffect(() => {
    terminalOutput.length === 0 && setIsTerminalShown(false);

    window.electron.ipcRenderer.on('project-commands-output', (_out) => {
      const out = _out as { terminalData: string; projectName: string };

      setIsTerminalShown(true);
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
      display={isTerminalShown ? 'block' : 'none'}
    >
      <Text color="#EDEDED">Terminal Output | last output: {projectName}</Text>
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
