import { Image, Modal, ModalProps, ScrollArea } from '@mantine/core';

export interface IShowThumbnailModalProps extends ModalProps {
    url?: string;
}

export default function ShowThumbnailModal({ url, ...props }: IShowThumbnailModalProps) {
    return (
        <Modal scrollAreaComponent={ScrollArea.Autosize} {...props} title="Thumbnail" centered size={'md'}>
            {url && <Image radius={'md'} src={url || ''} />}
        </Modal>
    );
}
