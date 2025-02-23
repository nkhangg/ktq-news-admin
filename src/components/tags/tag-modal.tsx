/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Modal, ModalProps, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import _ from 'lodash';
import { useEffect, useRef } from 'react';
import { z } from 'zod';
import { createTag, updateTag } from '../../apis/tag';
import { useConfirmStore } from '../../lib/zustand/use-confirm';
import { ITag } from '../../system/type';

export interface ICategoryModlProps extends ModalProps {
    data: ITag | null;
    onUpdated?: () => void;
}

// Schema validation
const schema = z.object({
    name: z.string({ message: 'Name is required' }).min(4, 'Min length must be 4 character').max(255, 'Name is too long'),
    slug: z.string({ message: 'Slug is required' }).min(1, 'Min length must be 1 character').max(255, 'Slug is too long'),
});

export default function CategoryModal({ data, onUpdated, ...props }: ICategoryModlProps) {
    const form = useForm<ITag>({
        validate: zodResolver(schema),
    });

    const { setConfirm } = useConfirmStore();

    const prevData = useRef<ITag | null>(data);

    const handleSubmit = async (values: typeof form.values) => {
        if (data) {
            setConfirm({
                title: 'Update ?',
                message: `This account will be update`,
                handleOk: async () => {
                    const result = await updateTag({ ...values });

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
            const result = await createTag(values);

            if (!result) return;
            props.onClose();

            if (onUpdated) {
                onUpdated();
            }
        }
    };

    useEffect(() => {
        form.reset();
        if (data) {
            form.setValues(data);
            prevData.current = data;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    useEffect(() => {
        if (!props.opened) {
            form.reset();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.opened]);

    return (
        <Modal {...props} size="xl" title={<span className="text-xl font-bold">Tag</span>} centered>
            <form onSubmit={form.onSubmit(handleSubmit)} className="flex flex-col gap-2.5">
                <TextInput size="sm" label="Name" {...form.getInputProps('name')} />
                <TextInput size="sm" label="Slug" {...form.getInputProps('slug')} />

                <Button mt={'md'} className="col-span-2" disabled={_.isEqual(form.getValues(), prevData.current)} type="submit" fullWidth size="sm">
                    {data ? 'Update' : 'Create'}
                </Button>
            </form>
        </Modal>
    );
}
