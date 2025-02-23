import { Box, Button, Drawer, DrawerProps, Tooltip } from '@mantine/core';
import _ from 'lodash';
import { usePermissions } from '../../hooks';
import { usePermissionStore } from '../../lib/zustand/use-permission-store';
import { mappingPermissionsColors } from '../../system/constants';
import { IconCheck, IconPlus } from '@tabler/icons-react';

export default function PermissionDrawer({ ...props }: DrawerProps) {
    const permissionData = usePermissions();

    const { permissions, setPermission, deletePermission } = usePermissionStore();

    return (
        <Drawer {...props} title="Permission">
            <Box className="flex items-center gap-3.5 flex-wrap">
                {permissionData.map((item) => {
                    const isChecked = _.some(permissions, item);

                    return (
                        <Tooltip key={item.name} label={item.description}>
                            <Button
                                leftSection={!isChecked ? <IconPlus size={14} /> : <IconCheck size={14} />}
                                onClick={() => (isChecked ? deletePermission(item) : setPermission(item))}
                                size="xs"
                                color={mappingPermissionsColors[item.name as keyof typeof mappingPermissionsColors]}
                            >
                                {item.name}
                            </Button>
                        </Tooltip>
                    );
                })}
            </Box>
        </Drawer>
    );
}
