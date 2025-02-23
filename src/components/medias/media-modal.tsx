/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Group, Image, LoadingOverlay, Modal, ModalProps, NumberInput, ScrollArea, Select, Text, TextInput } from '@mantine/core';
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useForm, zodResolver } from '@mantine/form';
import { IconPhoto, IconUpload, IconX } from '@tabler/icons-react';
import { useCallback, useEffect, useState } from 'react';
import { z } from 'zod';
import { uploadMedia } from '../../apis/media';

export interface IMediaModalProps extends ModalProps {
    onUpdated?: () => void;
}

const schema = (type: 'file' | 'url') =>
    z.object({
        width: z.number().positive('Width must be a positive number').optional(),
        height: z.number().positive('Height must be a positive number').optional(),
        image: z
            .instanceof(File, { message: 'A file must be uploaded' })
            .optional()
            .refine((file) => (type === 'file' ? file instanceof File : true), {
                message: 'File is required when type is "file"',
            }),
        url: z
            .string()
            .url('Invalid URL format')
            .optional()
            .refine((url) => (type === 'url' ? !!url : true), {
                message: 'url is required when type is "url"',
            }),
    });

export default function MediaModal({ onUpdated, ...props }: IMediaModalProps) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [type, setType] = useState<'file' | 'url'>('file');
    const [loading, setLoading] = useState(false);

    const form = useForm<{ width?: number; height?: number; image?: File; url?: string }>({
        validate: zodResolver(schema(type)),
    });

    const handleSubmit = async (values: typeof form.values) => {
        setLoading(true);
        const result = await uploadMedia(values);

        setLoading(false);
        if (result) {
            props.onClose();

            if (onUpdated) {
                onUpdated();
            }
        }
    };

    useEffect(() => {
        if (!props.opened) {
            form.reset();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.opened]);

    const onDrop = useCallback((files: FileWithPath[]) => {
        const localUrl = URL.createObjectURL(files[0]);

        setImageUrl(localUrl);

        form.setFieldValue('image', files[0]);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        return () => {
            if (!imageUrl) return;
            URL.revokeObjectURL(imageUrl);
        };
    }, [imageUrl]);

    useEffect(() => {
        if (form.values.url) {
            setImageUrl(form.values.url);
        }
    }, [form.values]);

    useEffect(() => {
        if (props.opened) {
            setImageUrl(null);
        }
    }, [props.opened]);

    return (
        <>
            <Modal
                className="relative"
                scrollAreaComponent={ScrollArea.Autosize}
                {...props}
                onClose={() => {
                    setImageUrl(null);
                    setLoading(false);
                    props.onClose();
                }}
                size="xl"
                title={<span className="text-xl font-bold">Media</span>}
                centered
            >
                <form onSubmit={form.onSubmit(handleSubmit)} className="grid grid-cols-2 gap-2.5 ">
                    <Select
                        value={type}
                        className="col-span-2"
                        label="Type"
                        placeholder="Pick value type"
                        data={[
                            { label: 'File', value: 'file' },
                            { label: 'Url', value: 'url' },
                        ]}
                        onChange={(value) => {
                            setType(value as typeof type);
                            setImageUrl(null);
                            form.setValues({ image: undefined, url: undefined });
                        }}
                    />

                    <NumberInput label="Width" placeholder="default: 400" {...form.getInputProps('width')} />
                    <NumberInput label="Height" placeholder="default: 400" {...form.getInputProps('height')} />

                    {type === 'file' && (
                        <>
                            <Dropzone
                                className="col-span-2 mt-2.5"
                                onDrop={onDrop}
                                onReject={(files) => console.log('rejected files', files)}
                                maxSize={5 * 1024 ** 2}
                                accept={IMAGE_MIME_TYPE}
                                multiple={false}
                            >
                                <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
                                    <Dropzone.Accept>
                                        <IconUpload size={52} color="var(--mantine-color-blue-6)" stroke={1.5} />
                                    </Dropzone.Accept>
                                    <Dropzone.Reject>
                                        <IconX size={52} color="var(--mantine-color-red-6)" stroke={1.5} />
                                    </Dropzone.Reject>
                                    <Dropzone.Idle>
                                        <IconPhoto size={52} color="var(--mantine-color-dimmed)" stroke={1.5} />
                                    </Dropzone.Idle>

                                    <div>
                                        <Text size="xl" inline>
                                            Drag images here or click to select files
                                        </Text>
                                        <Text size="sm" c="dimmed" inline mt={7}>
                                            Attach as many files as you like, each file should not exceed 5mb
                                        </Text>
                                    </div>
                                </Group>
                            </Dropzone>
                            <Text size="xs" className="!text-[#e03131]">
                                {form.errors.image}
                            </Text>
                        </>
                    )}

                    {type === 'url' && <TextInput className="col-span-2" label={'Url'} placeholder="Your url" {...form.getInputProps('url')} />}

                    {imageUrl && <Image src={imageUrl} className="mt-2.5 col-span-2 max-h-[400px]" radius={'md'} />}

                    <Button type="submit" fullWidth className="mt-2.5 col-span-2" size="sm">
                        {'Upload'}
                    </Button>
                </form>
                <LoadingOverlay visible={loading} />
            </Modal>
        </>
    );
}
