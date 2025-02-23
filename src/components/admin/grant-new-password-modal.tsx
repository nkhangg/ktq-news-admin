/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Modal, ModalProps, PasswordInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useEffect } from 'react';
import { z } from 'zod';
import { grantNewPasswordAdmin } from '../../apis/admin';
import { useConfirmStore } from '../../lib/zustand/use-confirm';
import { IAdmin } from '../../system/type';
export interface IAdminModelProps extends ModalProps {
    data: IAdmin | null;
    onUpdated?: () => void;
}

const schema = z
    .object({
        password: z.string({ message: 'Password is required' }).min(6, 'New password must be at least 6 characters'),
        confirmPassword: z.string({ message: 'Confirm password is required' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Passwords do not match',
    });

export default function GrantNewPasswordModal({ data, onUpdated, ...props }: IAdminModelProps) {
    const form = useForm({
        validate: zodResolver(schema),
    });

    const { setConfirm } = useConfirmStore();

    const handleSubmit = async (values: typeof form.values) => {
        if (data) {
            setConfirm({
                title: 'Update ?',
                message: `This account will be update`,
                handleOk: async () => {
                    const result = await grantNewPasswordAdmin({
                        id: data.id,
                        password: values.password,
                    });

                    if (!result) return;

                    props.onClose();

                    if (onUpdated) {
                        onUpdated();
                    }
                },
                okButton: {
                    color: 'blue',
                    value: 'Grant !',
                },
            });
        }
    };

    useEffect(() => {
        form.reset();
        if (!data) return;

        form.setValues(data);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    useEffect(() => {
        if (!props.opened) {
            form.reset();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.opened]);

    return (
        <Modal
            classNames={{
                header: '!flex !item-center !justify-center w-full',
            }}
            size={'xl'}
            {...props}
            title={<span className="text-xl font-bold">Grant password</span>}
            centered
        >
            <form onSubmit={form.onSubmit(handleSubmit)} className="flex flex-col gap-2.5">
                <PasswordInput className="col-span-1" size="sm" label="Password" {...form.getInputProps('password')} />
                <PasswordInput className="col-span-1" size="sm" label="Confirm password" {...form.getInputProps('confirmPassword')} />

                <Button className="col-span-2" type="submit" fullWidth size="sm" mt="md">
                    {'Grant'}
                </Button>
            </form>
        </Modal>
    );
}
