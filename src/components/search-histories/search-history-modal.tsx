/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Modal, ModalProps, NumberInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import _ from 'lodash';
import { useEffect, useRef } from 'react';
import { z } from 'zod';
import { createSearchHistories, updateSearchHistories } from '../../apis/search-histories';
import { useConfirmStore } from '../../lib/zustand/use-confirm';
import { IPost, ISearchHistory } from '../../system/type';

export interface ISearchHistoryModalProps extends ModalProps {
    data: ISearchHistory | null;
    onUpdated?: () => void;
}

const updateSchema = {
    search_count: z.number({ invalid_type_error: 'Search count must be a number' }).int('Search count must be an integer').min(0, 'Search count cannot be negative').optional(),
};

const createSchema = {
    post_id: z.number({ invalid_type_error: 'Post ID must be a number' }).int('Post ID must be an integer').positive('Post ID must be greater than 0'),
    ...updateSchema,
};

export default function SearchHistoryModal({ data, onUpdated, ...props }: ISearchHistoryModalProps) {
    const form = useForm<{ id: ISearchHistory['id']; post_id: IPost['id']; search_count?: number }>({
        validate: zodResolver(z.object(data ? updateSchema : createSchema)),
    });

    const { setConfirm } = useConfirmStore();

    const prevData = useRef<ISearchHistory | null>(data);

    const handleSubmit = async (values: typeof form.values) => {
        if (data) {
            setConfirm({
                title: 'Update ?',
                handleOk: async () => {
                    const result = await updateSearchHistories({ id: values.id, search_count: values.search_count || 0 });

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
            const { id, ...newValues } = values;

            const result = await createSearchHistories({ post_id: newValues.post_id, search_count: newValues.search_count || 0 });

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
        <Modal {...props} size="xl" title={<span className="text-xl font-bold">Search history</span>} centered>
            <form onSubmit={form.onSubmit(handleSubmit)} className="flex flex-col gap-2.5">
                {!data && <NumberInput size="sm" label="Post ID" {...form.getInputProps('post_id')} />}
                <NumberInput size="sm" label="Search count" {...form.getInputProps('search_count')} />

                <Button mt={'md'} className="col-span-2" disabled={_.isEqual(form.getValues(), prevData.current)} type="submit" fullWidth size="sm">
                    {data ? 'Update' : 'Create'}
                </Button>
            </form>
        </Modal>
    );
}
