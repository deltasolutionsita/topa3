import { Box, Button, Icon, Input, SimpleGrid, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { BiImport } from 'react-icons/bi';

function getWorkspaceFolderName(path: string){
  const pathArray = path.split('/');
  return pathArray[pathArray.length - 2];
}

function DragBox() {
  const [isInputDisplayed, setIsInputDisplayed] = useState(true);
  const [fileInfos, setFileInfos] = useState<File>();

  return (
    <Box mt="10%" borderWidth={'2px'} w="400px" h="250px" borderRadius={'3xl'}>
      <SimpleGrid placeItems={'center'}>
        {
          typeof fileInfos === 'undefined' && <>
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
            console.log(files?.item(0));
          }}
        />
          </>
        }
        {fileInfos && (
          <Box mt="10%">
            <Text fontWeight={"bold"} fontSize="md">Stai per importare il progetto</Text>
            <Text textAlign={"center"} mt="20%"><code>{getWorkspaceFolderName(fileInfos.path)}</code></Text>
            <SimpleGrid columns={2} spacing={"4"} mt="20%">
              <Button colorScheme={"green"} onClick={async () => {
                // gets the arrayBuffer and then converts it to a string
                const fileContent = await fileInfos.text();
                console.log(fileContent)
              }}>
                <Text>Conferma</Text>
              </Button>
              <Button onClick={() => {
                setFileInfos(undefined)
                setIsInputDisplayed(true)
              }}>
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

