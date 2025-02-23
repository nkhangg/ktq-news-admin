/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Button, Modal, ModalProps, Select, Textarea, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import JsonView from '@uiw/react-json-view';
import { darkTheme } from '@uiw/react-json-view/dark';
import _ from 'lodash';
import { useEffect, useRef } from 'react';
import { z } from 'zod';
import { createConfig, updateConfig } from '../../apis/config';
import { IConfig } from '../../system/type';
import { isValidJSON } from '../../utils';
import { useConfirmStore } from '../../lib/zustand/use-confirm';

export interface IConfigModalProps extends ModalProps {
    data: IConfig | null;
    onUpdated?: () => void;
}

// Schema validation
const schema = z
    .object({
        key_name: z.string({ message: 'Key name is required' }).min(1, 'Min length must be 1 character').max(255, 'Key name is too long'),
        type: z.enum(['json', 'number', 'string'], {
            errorMap: () => ({ message: 'Invalid type' }),
        }),
        value: z.string({ message: 'Value is required' }).min(4, 'Min length must be 4 character'),
    })
    .superRefine((data, ctx) => {
        if (data.type === 'number' && isNaN(Number(data.value))) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['value'],
                message: 'Value must be a valid number',
            });
        }

        if (data.type === 'json') {
            try {
                JSON.parse(data.value);
            } catch (error) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['value'],
                    message: 'Value must be a valid JSON',
                });
            }
        }
    });
export default function ConfigModal({ data, onUpdated, ...props }: IConfigModalProps) {
    const form = useForm<IConfig>({
        validate: zodResolver(schema),
    });

    const { setConfirm } = useConfirmStore();

    const prevData = useRef<IConfig | null>(data);

    const handleSubmit = async (values: typeof form.values) => {
        if (data) {
            setConfirm({
                title: 'Update ?',
                message: `This account will be update`,
                handleOk: async () => {
                    const result = await updateConfig({ ...values });

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
            await createConfig(values);

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
        <Modal {...props} size="xl" title={<span className="text-xl font-bold">Config</span>} centered>
            <form onSubmit={form.onSubmit(handleSubmit)} className="grid grid-cols-2 gap-2.5">
                <TextInput readOnly={!!data} size="sm" label="Key" {...form.getInputProps('key_name')} />
                <Select
                    label="Type"
                    placeholder="Pick value type"
                    data={[
                        { label: 'JSON', value: 'json' },
                        { label: 'NUMBER', value: 'number' },
                        { label: 'STRING', value: 'string' },
                    ]}
                    {...form.getInputProps('type')}
                />
                <Textarea rows={6} className="col-span-2" size="sm" label="Value" {...form.getInputProps('value')} />

                {form.values.type === 'json' && isValidJSON(form.values.value) && <JsonView className="col-span-2" value={JSON.parse(form.values.value) || {}} style={darkTheme} />}

                <Box className="flex items-center justify-between gap-2.5 col-span-2 " mt="md">
                    <Button disabled={_.isEqual(form.getValues(), prevData.current)} type="submit" fullWidth size="sm">
                        {data ? 'Update' : 'Create'}
                    </Button>
                </Box>
            </form>
        </Modal>
    );
}
