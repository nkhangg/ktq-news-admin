import { Drawer, DrawerProps } from '@mantine/core';
import { Tags } from '../../pages';

export default function CategoryDrawer(props: DrawerProps) {
    return (
        <Drawer position="right" size="xl" {...props}>
            <Tags />
        </Drawer>
    );
}
