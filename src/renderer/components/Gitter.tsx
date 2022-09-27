import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Input,
  DrawerFooter,
  Button,
} from '@chakra-ui/react';

function Gitter({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Gitter</DrawerHeader>

        <DrawerBody>

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
