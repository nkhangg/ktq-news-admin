import { ActionIcon, Avatar, Box, Menu } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconCopy, IconLink, IconMenu, IconTrash } from '@tabler/icons-react';
import { useCallback, useMemo, useRef } from 'react';
import { toast } from 'react-toastify';
import { deleteMedia, deleteMedias, getMedias } from '../apis/media';
import { MediaModal } from '../components/medias';
import Table from '../lib/table/table';
import { IColumn, TRefTableFn } from '../lib/table/type';
import { useConfirmStore } from '../lib/zustand/use-confirm';
import { IMedia } from '../system/type';
import { copyToClipboard, formatTime } from '../utils';

export default function Medias() {
    const { setConfirm } = useConfirmStore();

    const refTableFn: TRefTableFn<IMedia> = useRef({});

    const [opened, { open, close }] = useDisclosure(false);

    const columns: IColumn<IMedia>[] = [
        {
            key: 'id',
            title: 'ID',
            typeFilter: 'number',
        },
        {
            key: 'path',
            title: 'Image',
            typeFilter: 'text',
            renderRow: (row) => {
                return <Avatar size={'xl'} radius={'md'} src={row.path} />;
            },
        },
        {
            key: 'name',
            title: 'Name',
            typeFilter: 'text',
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

    const handleDelete = (media: IMedia) => {
        setConfirm({
            title: 'Delete ?',
            message: 'This media will be delete',
            handleOk: async () => {
                await deleteMedia(media);

                if (refTableFn.current?.fetchData) {
                    refTableFn.current.fetchData();
                }
            },
        });
    };

    const getMediasFn = useCallback(getMedias, []);

    const table = useMemo(() => {
        return (
            <Table
                actionsOptions={{
                    actions: [
                        {
                            key: 'add',
                            title: 'Add',
                            callback: () => {
                                open();
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
                                        const result = await deleteMedias(chooses);

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
                    query: getMediasFn,
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
                                    <Menu.Item
                                        onClick={() =>
                                            copyToClipboard(row.path, () => {
                                                toast.success('Copied URL: ' + row.path);
                                            })
                                        }
                                        leftSection={<IconCopy size={14} />}
                                    >
                                        Copy URL
                                    </Menu.Item>
                                    {row.original_path && (
                                        <Menu.Item
                                            onClick={() =>
                                                copyToClipboard(row.original_path, () => {
                                                    toast.success('Copied URL: ' + row.original_path);
                                                })
                                            }
                                            leftSection={<IconCopy size={14} />}
                                        >
                                            Copy original URL
                                        </Menu.Item>
                                    )}
                                    <Menu.Item onClick={() => window.open(row.path)} leftSection={<IconLink size={14} />}>
                                        Open image new tab
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

    return (
        <Box>
            {table}

            <MediaModal onUpdated={refTableFn.current.fetchData} opened={opened} onClose={close} />
        </Box>
    );
}
