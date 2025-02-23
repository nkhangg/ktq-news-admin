/* eslint-disable @typescript-eslint/no-unused-vars */
import { Badge, Box, Button, Modal, ModalProps, PasswordInput, Text, TextInput, Tooltip } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import _ from 'lodash';
import { useEffect, useRef } from 'react';
import { z } from 'zod';
import { createAdmin, updateAdmin } from '../../apis/admin';
import { useConfirmStore } from '../../lib/zustand/use-confirm';
import { usePermissionStore } from '../../lib/zustand/use-permission-store';
import { mappingPermissionsColors } from '../../system/constants';
import { IAdmin } from '../../system/type';
import PermissionDrawer from './permission-drawer';
export interface IAdminModelProps extends ModalProps {
    data: IAdmin | null;
    onUpdated?: () => void;
}

const baseSchema = {
    email: z.string().email('Invalid email format').optional(),
    fullname: z.string().min(3, 'Fullname must be at least 3 characters').nullable().optional(),
};

const updateSchema = z.object(baseSchema);

const createSchema = z
    .object({
        ...baseSchema,
        password: z.string({ message: 'Password is required' }).min(6, 'New password must be at least 6 characters'),
        confirmPassword: z.string({ message: 'Confirm password is required' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Passwords do not match',
    });

export default function AdminModal({ data, onUpdated, ...props }: IAdminModelProps) {
    const form = useForm({
        validate: zodResolver(data ? updateSchema : createSchema),
    });

    const [opened, { open, close }] = useDisclosure(false);

    const { deletePermission, setPermissions, permissions, basePermission } = usePermissionStore();

    const prevData = useRef<IAdmin | null>(data);

    const { setConfirm } = useConfirmStore();

    const handleSubmit = async (values: typeof form.values) => {
        if (data) {
            setConfirm({
                title: 'Update ?',
                message: `This account will be update`,
                handleOk: async () => {
                    const result = await updateAdmin(values);

                    if (!result) return;

                    props.onClose();

                    if (onUpdated) {
                        onUpdated();
                    }
                },
                okButton: {
                    color: 'blue',
                    value: 'Update',
                },
            });
        } else {
            const { confirmPassword, ...newValues } = values;

            const result = await createAdmin(newValues as Omit<IAdmin, 'id' | 'created_at' | 'updated_at' | 'is_system_account'>);

            if (!result) return;

            props.onClose();

            if (onUpdated) {
                onUpdated();
            }
        }
    };

    useEffect(() => {
        form.reset();
        if (!data) return;

        form.setValues(data);

        setPermissions(data.permissions);

        prevData.current = data;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    useEffect(() => {
        if (!props.opened) {
            form.reset();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.opened]);

    useEffect(() => {
        form.setFieldValue('permissions', permissions);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [permissions]);

    return (
        <Modal
            classNames={{
                header: '!flex !item-center !justify-center w-full',
            }}
            {...props}
            size={'xl'}
            title={<span className="text-xl font-bold">Admin</span>}
            centered
        >
            <form onSubmit={form.onSubmit(handleSubmit)} className="grid grid-cols-2 gap-2.5">
                <TextInput readOnly={!!data} size="sm" label="Username" {...form.getInputProps('username')} />
                <TextInput size="sm" label="Email" {...form.getInputProps('email')} />
                <TextInput className="col-span-2" size="sm" label="Fullname" {...form.getInputProps('fullname')} />

                {!data && (
                    <>
                        <PasswordInput size="sm" label="Password" {...form.getInputProps('password')} />
                        <PasswordInput size="sm" label="Confirm password" {...form.getInputProps('confirmPassword')} />
                    </>
                )}

                {!data ||
                    (!data.is_system_account && (
                        <Box className="col-end-2">
                            <Text className="font-semibold text-sm">Permission</Text>
                            <Box className="flex items-center gap-2">
                                {permissions.map((item) => {
                                    return (
                                        <Tooltip key={item.name} label={item.description}>
                                            <Badge onClick={() => deletePermission(item)} color={mappingPermissionsColors[item.name as keyof typeof mappingPermissionsColors]}>
                                                {item.name}
                                            </Badge>
                                        </Tooltip>
                                    );
                                })}

                                {permissions.length !== basePermission.length && (
                                    <Button onClick={open} leftSection={<IconPlus size={14} />} size="xs">
                                        Add
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    ))}

                <Button disabled={_.isEqual(form.getValues(), prevData.current)} className="col-span-2" type="submit" fullWidth size="sm" mt="md">
                    {data ? 'Update' : 'Create'}
                </Button>
            </form>

            <PermissionDrawer opened={opened} onClose={close} />
        </Modal>
    );
}
