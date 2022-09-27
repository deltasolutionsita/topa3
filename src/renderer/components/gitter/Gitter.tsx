import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Input,
  Box,
  Text,
  Heading,
} from '@chakra-ui/react';
import { useContext } from 'react';
import { GitterContext } from './GitterProvider';

function Gitter({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [gitterElements] = useContext(GitterContext);

  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Gitter</DrawerHeader>

        <DrawerBody>
          <Input colorScheme={'teal'} placeholder="Commit message..." />
          <Box mt="5%">
            {gitterElements.map((gitterElement, i) => (
              <Box
                mt={i !== 0 ? '5%' : '0%'}
                key={i}
                borderWidth="2px"
                rounded={'lg'}
                p="5%"
              >
                <Heading fontSize={'lg'}>{gitterElement.parsedDir}</Heading>
                <Box p="3%" mt="2%">
                  {gitterElement.changedFiles.length > 0 ? (
                    gitterElement.changedFiles.map((file, i) => {
                      return <Text key={i}>{file.name}</Text>;
                    })
                  ) : (
                    <Text opacity={0.7} fontStyle="italic">
                      Nessun file modificato...
                    </Text>
                  )}
                </Box>
              </Box>
            ))}
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
