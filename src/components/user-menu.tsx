import { Avatar, Button, Menu, Modal, PasswordInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconLogout, IconSettings, IconUser } from '@tabler/icons-react';
import { useNavigate } from 'react-router';
import { z } from 'zod';
import { changePassword, logout } from '../apis/auth';
import { useConfirmStore } from '../lib/zustand/use-confirm';
import Links from '../system/links';

const schema = z
    .object({
        currentPassword: z.string().min(6, 'Current password must be at least 6 characters'),
        newPassword: z.string().min(6, 'New password must be at least 6 characters'),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Passwords do not match',
    });

export default function UserMenu() {
    const [opened, { open, close }] = useDisclosure(false);

    const { setConfirm } = useConfirmStore();

    const navigate = useNavigate();
    const form = useForm({
        initialValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
        validate: zodResolver(schema),
    });

    const handleSubmit = async (values: typeof form.values) => {
        await handleChangePassword(values);
    };

    const handleLogout = async () => {
        setConfirm({
            title: "Are you wan't to logout?",
            message: 'This account will logout !',
            okButton: { value: 'Logout' },
            handleOk: async () => {
                const data = await logout();

                if (data && data.data) {
                    navigate(Links.LOGIN);
                }
            },
        });
    };

    const handleChangePassword = async (values: typeof form.values) => {
        setConfirm({
            title: "Are you wan't to update password",
            message: 'This account will change password !',
            okButton: { value: 'Sure' },
            handleOk: async () => {
                const data = await changePassword({
                    newPassword: values.newPassword,
                    password: values.currentPassword,
                });

                if (data && data.data) {
                    navigate(Links.LOGIN);
                    close();
                }
            },
        });
    };

    return (
        <>
            <Menu shadow="md" width={200}>
                <Menu.Target>
                    <Avatar color="blue" radius="xl" className="cursor-pointer">
                        <IconUser size={20} />
                    </Avatar>
                </Menu.Target>

                <Menu.Dropdown>
                    <Menu.Label>Account</Menu.Label>
                    <Menu.Item onClick={open} leftSection={<IconSettings size={14} />}>
                        Change password
                    </Menu.Item>

                    <Menu.Divider />

                    <Menu.Item onClick={handleLogout} color="red" leftSection={<IconLogout size={14} />}>
                        Logout
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>

            <Modal opened={opened} onClose={close} title="Change password" centered>
                <form onSubmit={form.onSubmit(handleSubmit)} className="flex flex-col gap-2.5">
                    <PasswordInput size="sm" label="Current password" {...form.getInputProps('currentPassword')} />
                    <PasswordInput size="sm" label="New password" {...form.getInputProps('newPassword')} />
                    <PasswordInput size="sm" label="Confirm password" {...form.getInputProps('confirmPassword')} />
                    <Button type="submit" fullWidth size="sm" mt="md">
                        Change
                    </Button>
                </form>
            </Modal>
        </>
    );
}
