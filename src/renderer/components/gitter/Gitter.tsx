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
} from '@chakra-ui/react';
import { useContext } from 'react';
import GitterActions from './GitterActions';
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
          <Box mt="5%">
            {gitterElements.length > 0 ? (
              <Box p="5%" borderWidth={'1px'} rounded="2xl">
                <Text mb="5%" opacity={0.6}>
                  Progetti aperti:{' '}
                </Text>
                <Tabs colorScheme={'teal'} variant="line">
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
                      <GitterActions
                        key={i}
                        project={gitterElement}
                      />
                    ))}
                  </TabPanels>
                </Tabs>
              </Box>
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
