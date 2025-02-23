import { ActionIcon, Avatar, Box, Menu, Text } from '@mantine/core';
import { IconEdit, IconMenu, IconTrash } from '@tabler/icons-react';
import { useCallback, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { deletePost, deletePosts, getPosts } from '../apis/post';
import Table from '../lib/table/table';
import { IColumn, TRefTableFn } from '../lib/table/type';
import { useConfirmStore } from '../lib/zustand/use-confirm';
import Links from '../system/links';
import { IPost } from '../system/type';
import { formatTime } from '../utils';

export default function Posts() {
    const { setConfirm } = useConfirmStore();

    const refTableFn: TRefTableFn<IPost> = useRef({});

    const navigate = useNavigate();

    const columns: IColumn<IPost>[] = [
        {
            key: 'id',
            title: 'ID',
            typeFilter: 'number',
        },
        {
            key: 'thumbnail',
            title: 'Title',
            typeFilter: 'text',
            renderRow: (row) => {
                return <Avatar src={row.thumbnail} radius={'md'} size={'xl'} />;
            },
        },
        {
            key: 'title',
            title: 'Title',
            typeFilter: 'text',
        },
        {
            key: 'slug',
            title: 'Slug',
            typeFilter: 'text',
        },
        {
            key: 'category',
            title: 'Category',
            typeFilter: 'text',
            renderRow: (row) => {
                return <Text>{row.category.name}</Text>;
            },
        },
        {
            key: 'preview_content',
            title: 'Preview content',
            typeFilter: 'text',
        },
        {
            key: 'like_count',
            title: 'Like count',
            typeFilter: 'text',
        },
        {
            key: 'ttr',
            title: 'TTR',
            typeFilter: 'number',
        },
        {
            key: 'created_at',
            title: 'Created at',
            typeFilter: 'none',
            renderRow(row) {
                return <span>{formatTime(row.created_at)}</span>;
            },
        },
        {
            key: 'updated_at',
            title: 'Update at',
            typeFilter: 'none',
            renderRow(row) {
                return <span>{formatTime(row.updated_at)}</span>;
            },
        },
    ];

    const handleDelete = (post: IPost) => {
        setConfirm({
            title: 'Delete ?',
            message: 'This post will be delete',
            handleOk: async () => {
                await deletePost(post);

                if (refTableFn.current?.fetchData) {
                    refTableFn.current.fetchData();
                }
            },
        });
    };

    const getPostsFn = useCallback(getPosts, []);

    const table = useMemo(() => {
        return (
            <Table
                actionsOptions={{
                    actions: [
                        {
                            key: 'add',
                            title: 'Add',

                            callback: () => {
                                navigate(Links.CREATE_POST());
                            },
                        },
                        {
                            key: 'delete',
                            title: 'Delete',
                            callback: (chooses) => {
                                if (!chooses.length) return;
                                setConfirm({
                                    title: 'Delete',
                                    message: `${chooses.length} will be delete`,
                                    handleOk: async () => {
                                        const result = await deletePosts(chooses);

                                        if (!result) return;
                                        if (refTableFn.current.fetchData) {
                                            refTableFn.current.fetchData();
                                        }
                                    },
                                });
                            },
                            disabled: (data) => data.length <= 0,
                        },
                    ],
                }}
                refTableFn={refTableFn}
                striped
                showLoading={true}
                highlightOnHover
                styleDefaultHead={{
                    justifyContent: 'flex-start',
                    width: 'fit-content',
                }}
                options={{
                    query: getPostsFn,
                    pathToData: 'data.data',
                    keyOptions: {
                        last_page: 'lastPage',
                        per_page: 'perPage',
                        from: 'from',
                        to: 'to',
                        total: 'total',
                    },
                }}
                rows={[]}
                withColumnBorders
                showChooses={true}
                withTableBorder
                columns={columns}
                actions={{
                    title: <Box className="w-full text-center">Action</Box>,
                    body: (row) => {
                        return (
                            <Menu shadow="md" width={200}>
                                <Menu.Target>
                                    <Box className="flex w-full items-center justify-center">
                                        <ActionIcon size="sm" variant="light">
                                            <IconMenu size={14} />
                                        </ActionIcon>
                                    </Box>
                                </Menu.Target>

                                <Menu.Dropdown>
                                    <Menu.Item component={Link} to={Links.DETAIL_POST(row)} leftSection={<IconEdit size={14} />}>
                                        Edit
                                    </Menu.Item>
                                    <Menu.Item onClick={() => handleDelete(row)} leftSection={<IconTrash color="red" size={14} />}>
                                        Delete
                                    </Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                        );
                    },
                }}
                rowKey="id"
            />
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <Box>{table}</Box>;
}
