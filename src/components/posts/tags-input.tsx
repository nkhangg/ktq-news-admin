import { Badge, Box, Button, Select } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconRefresh } from '@tabler/icons-react';
import _ from 'lodash';
import { useTags } from '../../hooks';
import { ITag } from '../../system/type';
import { TagDrawer } from '../tags';
export interface ITagsInputProps {
    tags: ITag[];
    onChangeTags: (tags: ITag[]) => void;
    error?: string;
}

export default function TagsInput({ tags, error, onChangeTags }: ITagsInputProps) {
    const { data, refresh, select } = useTags();
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            <Box className="grid grid-cols-12 gap-2.5 items-end">
                <Select
                    error={error}
                    value={null}
                    onChange={(value) => {
                        const tag = data.find((item) => String(item.id) === value);

                        if (!tag) return;

                        onChangeTags(_.uniqBy([...(tags || []), tag], 'id'));
                    }}
                    searchable
                    className="col-span-10"
                    label={'Tags'}
                    data={select}
                />
                <Box className="col-span-2 flex items-center gap-2.5 justify-between">
                    <Button className="flex-1" onClick={open}>
                        Create
                    </Button>
                    <Button onClick={refresh}>
                        <IconRefresh size={16} />
                    </Button>
                </Box>

                {tags?.length > 0 && (
                    <Box className="flex items-center gap-2 col-span-12">
                        {tags.map((item) => (
                            <Badge
                                key={item.slug}
                                onClick={() => {
                                    const newTags = tags.filter((tag) => tag.id !== item.id);
                                    onChangeTags(newTags);
                                }}
                                variant="outline"
                            >
                                #{item.name}
                            </Badge>
                        ))}
                    </Box>
                )}
            </Box>

            <TagDrawer opened={opened} onClose={close} />
        </>
    );
}
