import { Drawer, DrawerProps } from '@mantine/core';
import { Medias } from '../../pages';

export default function MediaDrawer(props: DrawerProps) {
    return (
        <Drawer position="right" size="50%" {...props}>
            <Medias />
        </Drawer>
    );
}
