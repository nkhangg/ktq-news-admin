/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Modal, ModalProps, Textarea, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import _ from 'lodash';
import { useEffect, useRef } from 'react';
import { z } from 'zod';
import { createCategory, updateCategory } from '../../apis/category';
import { useConfirmStore } from '../../lib/zustand/use-confirm';
import { ICategory } from '../../system/type';
import { toSlug } from '../../utils';

export interface ICategoryModlProps extends ModalProps {
    data: ICategory | null;
    onUpdated?: () => void;
}

// Schema validation
const schema = z.object({
    name: z.string({ message: 'Name is required' }).min(4, 'Min length must be 4 character').max(255, 'Name is too long'),
    slug: z.string({ message: 'Slug is required' }).min(1, 'Min length must be 1 character').max(255, 'Slug is too long'),
    description: z.string({ message: 'Description is required' }).min(4, 'Min length must be 4 character'),
});

export default function CategoryModal({ data, onUpdated, ...props }: ICategoryModlProps) {
    const form = useForm<ICategory>({
        validate: zodResolver(schema),
    });

    const { setConfirm } = useConfirmStore();

    const prevData = useRef<ICategory | null>(data);

    const handleSubmit = async (values: typeof form.values) => {
        if (data) {
            setConfirm({
                title: 'Update ?',
                message: `This account will be update`,
                handleOk: async () => {
                    const result = await updateCategory({ ...values });

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
            const result = await createCategory(values);

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

    useEffect(() => {
        if (data && _.isEqual(form.getValues(), prevData.current)) return;

        form.setFieldValue('slug', toSlug(form.values.name));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.values.name, data]);

    return (
        <Modal {...props} size="xl" title={<span className="text-xl font-bold">Category</span>} centered>
            <form onSubmit={form.onSubmit(handleSubmit)} className="grid grid-cols-2 gap-2.5">
                <TextInput size="sm" label="Name" {...form.getInputProps('name')} />
                <TextInput size="sm" label="Slug" {...form.getInputProps('slug')} />
                <Textarea rows={6} size="sm" className="col-span-2" label="Description" {...form.getInputProps('description')} />

                <Button mt={'md'} className="col-span-2" disabled={_.isEqual(form.getValues(), prevData.current)} type="submit" fullWidth size="sm">
                    {data ? 'Update' : 'Create'}
                </Button>
            </form>
        </Modal>
    );
}
