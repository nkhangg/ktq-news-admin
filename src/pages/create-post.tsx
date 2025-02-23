import { ActionIcon, Box, Button, NumberInput, Select, Text, Textarea, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useDisclosure, useHotkeys } from '@mantine/hooks';
import { IconArrowLeft, IconRefresh } from '@tabler/icons-react';
import { z } from 'zod';
import { CategoryDrawer } from '../components/categories';
import { MediaDrawer } from '../components/medias';
import { ShowThumbnailModal, TagsInput } from '../components/posts';
import { useCategories } from '../hooks';
import { IPost } from '../system/type';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';
import { createPost } from '../apis/post';
import { useNavigate } from 'react-router';
import Links from '../system/links';
import { useEffect } from 'react';

import _ from 'lodash';
import { useConfirmStore } from '../lib/zustand/use-confirm';

const postSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    thumbnail: z.string().url('Thumbnail must be a valid URL'),
    category_id: z.preprocess((val) => (typeof val === 'string' ? Number(val) : val), z.number().min(1, 'Please select a valid category')),
    tags: z
        .array(
            z.object({
                id: z.number(),
                name: z.string(),
                slug: z.string(),
            }),
        )
        .optional(),
    slug: z.string({ message: 'Slug is required' }).min(1, 'Slug is min length 1 character'),
    ttr: z.number().min(1, 'TTR must be greater than 0').optional(),
    like_count: z.number().min(0, 'Like count cannot be negative').optional(),
    preview_content: z.string({ message: 'Preview content is required' }).min(10, 'Preview content must be at least 10 characters'),
    content: z.string({ message: 'Content is required' }).min(10, 'Content must be at least 10 characters'),
});

const initialValues = {
    title: '',
    thumbnail: '',
    category_id: '',
    tags: [],
    slug: '',
    ttr: 300,
    like_count: 0,
    preview_content: '',
    content: '',
};

export default function CreatePost() {
    const LOCAL_KEY = 'POST_LOCAL_DATA';

    const navigate = useNavigate();

    const { setConfirm } = useConfirmStore();

    const form = useForm<Partial<IPost> & { category_id: string }>({
        initialValues,
        validate: zodResolver(postSchema),
    });

    const categories = useCategories();

    const [mediaDrawerOpened, mediaDrawerAction] = useDisclosure(false);
    const [showThumbnail, showThumbnailAction] = useDisclosure(false);
    const [categoryDrawerOpened, categoryDrawerAction] = useDisclosure(false);

    useHotkeys([['mod+M', mediaDrawerAction.open]]);

    useEffect(() => {
        return () => {
            localStorage.setItem(LOCAL_KEY, JSON.stringify(form.values));
        };
    }, [form]);

    useEffect(() => {
        const data = localStorage.getItem(LOCAL_KEY);

        if (data) {
            form.setValues({ ...JSON.parse(data) });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Box className="flex flex-col gap-3.5">
                <Box className="flex items-center gap-2">
                    <ActionIcon
                        onClick={() => {
                            if (_.isEqual(form.values, initialValues)) {
                                navigate(Links.POSTS);

                                return;
                            }

                            setConfirm({
                                title: 'Leave ?',
                                message: 'Data will save if you leave this page',
                                handleOk: () => {
                                    navigate(Links.POSTS);
                                },
                                okButton: {
                                    color: 'blue',
                                    value: 'Leave',
                                },
                            });
                        }}
                    >
                        <IconArrowLeft size={14} />
                    </ActionIcon>
                    <Text size="xl">Create Post</Text>
                </Box>
                <form
                    onSubmit={form.onSubmit(async (values) => {
                        const result = await createPost(values);

                        if (!result) return;

                        navigate(Links.POSTS);
                    })}
                    className="flex flex-col gap-2.5"
                >
                    <TextInput label="Title" {...form.getInputProps('title')} />
                    <Box className="grid grid-cols-12 gap-2.5 items-end">
                        <TextInput className="col-span-10" label="Thumbnail" {...form.getInputProps('thumbnail')} />
                        <Button className="col-span-2" disabled={!form.values?.thumbnail} onClick={showThumbnailAction.open}>
                            Show
                        </Button>
                    </Box>
                    <Box className="grid grid-cols-12 gap-2.5 items-end">
                        <Select searchable className="col-span-10" label="Category" data={categories.select} {...form.getInputProps('category_id')} />
                        <Box className="col-span-2 flex items-center gap-2.5 justify-between">
                            <Button className="flex-1" onClick={categoryDrawerAction.open}>
                                Create
                            </Button>
                            <Button onClick={categories.refresh}>
                                <IconRefresh size={16} />
                            </Button>
                        </Box>
                    </Box>

                    <TagsInput
                        error={form.errors.tags as string | undefined}
                        onChangeTags={(tags) => {
                            form.setFieldValue('tags', tags);
                        }}
                        tags={form.values.tags || []}
                    />

                    <Box className="grid grid-cols-3 gap-2.5">
                        <TextInput {...form.getInputProps('slug')} label="Slug" />
                        <NumberInput {...form.getInputProps('ttr')} label="TTR" placeholder="default 300" />
                        <NumberInput {...form.getInputProps('like_count')} label="Like count" placeholder="default 0" />
                    </Box>
                    <Textarea {...form.getInputProps('preview_content')} rows={6} label="Preview content" />

                    <Box className="flex flex-col gap-1">
                        <Text size="sm" fw={500} className="font-bold">
                            Content
                        </Text>
                        <MDEditor
                            height={800}
                            data-color-mode="dark"
                            previewOptions={{
                                rehypePlugins: [[rehypeSanitize]],
                            }}
                            {...form.getInputProps('content')}
                        />
                        {form.errors?.content && (
                            <Text size="sm" className="!text-[#e03131]">
                                {form.errors?.content}
                            </Text>
                        )}
                    </Box>

                    <Button type="submit" className="mt-2.5" fullWidth>
                        Create
                    </Button>
                </form>
            </Box>

            <MediaDrawer opened={mediaDrawerOpened} onClose={mediaDrawerAction.close} />

            <ShowThumbnailModal url={form.values?.thumbnail} opened={showThumbnail} onClose={showThumbnailAction.close} />

            <CategoryDrawer opened={categoryDrawerOpened} onClose={categoryDrawerAction.close} />
        </>
    );
}
