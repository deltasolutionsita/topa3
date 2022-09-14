import { Box, Button, Code, Icon, Input, SimpleGrid, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { BiImport } from 'react-icons/bi';
import { Buffer } from 'buffer';
import { fileNotValid, projectImported } from 'renderer/toasts';
import { sleep } from './consts';

export function getWorkspaceFolderName(path: string) {
  let r;
  if(path.includes('\\')) {
    r = path.split('\\');
  } else {
    r = path.split('/');
  }
  return r[r.length - 2];
}

export function getFileName(path: string) {
  let r;
  if(path.includes('\\')) {
    r = path.split('\\');
  } else {
    r = path.split('/');
  }
  return r[r.length - 1];
}

function DragBox() {
  const [isInputDisplayed, setIsInputDisplayed] = useState(true);
  const [fileInfos, setFileInfos] = useState<File>();

  return (
    <Box mt="5%" borderWidth={'2px'} w="400px" h="250px" borderRadius={'3xl'}>
      <SimpleGrid placeItems={'center'}>
        {typeof fileInfos === 'undefined' && (
          <>
            <Icon w="100px" h="150px" as={BiImport} opacity="0.4" />
            <Text opacity={'0.4'}>
              Importa il file <code>_topa3</code>
            </Text>
            <Input
              mt="5%"
              type="file"
              display={isInputDisplayed ? 'block' : 'none'}
              onChange={(e) => {
                const files = e.target.files;
                if (files?.length === 0) return;

                setIsInputDisplayed(false);
                files && setFileInfos(files[0]);
              }}
            />
          </>
        )}
        {fileInfos && (
          <Box mt="10%">
            <Text fontWeight={'bold'} fontSize="md">
              Stai per importare il progetto
            </Text>
            <Text textAlign={'center'} mt="20%">
              <Code>{getWorkspaceFolderName(fileInfos.path)}</Code>
            </Text>
            <SimpleGrid columns={2} spacing={'4'} mt="20%">
              <Button
                colorScheme={'green'}
                onClick={async () => {
                  const filePath = fileInfos.path;
                  const fileContent = await fileInfos.text();
                  const finalContent = `${filePath}:::${fileContent}---`;
                  const buffer = Buffer.from(finalContent);
                  
                  if(getFileName(filePath) !== '_topa3') return fileNotValid()
                  
                  return window.electron.ipcRenderer.invoke('import-project', [
                    buffer,
                  ])
                    .then(async (res) => {
                      res === "ok" && (projectImported(), await sleep(1100), window.location.reload());
                    })
                    .catch(() => {
                      alert("Errore nell'importazione del progetto");
                    })
                }}
              >
                <Text>Conferma</Text>
              </Button>
              <Button
                onClick={() => {
                  setFileInfos(undefined);
                  setIsInputDisplayed(true);
                }}
              >
                <Text>Annulla</Text>
              </Button>
            </SimpleGrid>
          </Box>
        )}
      </SimpleGrid>
    </Box>
  );
}

export default DragBox;
