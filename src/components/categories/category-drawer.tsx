import { Drawer, DrawerProps } from '@mantine/core';
import { Categories } from '../../pages';

export default function CategoryDrawer(props: DrawerProps) {
    return (
        <Drawer position="right" size="xl" {...props}>
            <Categories />
        </Drawer>
    );
}
