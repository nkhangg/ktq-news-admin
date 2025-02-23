/* eslint-disable @typescript-eslint/no-unused-vars */
import { Modal, ModalProps, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';
import { IFeedback } from '../../system/type';

export interface IFeedBackModalModalProps extends ModalProps {
    data: IFeedback | null;
    onUpdated?: () => void;
}

export default function FeedBackModal({ data, onUpdated, ...props }: IFeedBackModalModalProps) {
    const form = useForm<IFeedback>({});

    useEffect(() => {
        if (!data) return;
        form.setValues(data);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    return (
        <Modal {...props} size="xl" title={<span className="text-xl font-bold">Feedback</span>} centered>
            <form className="flex flex-col gap-2.5">
                <TextInput readOnly label={'Fullname'} {...form.getInputProps('fullname')} />
                <TextInput readOnly label={'Email'} {...form.getInputProps('email')} />
                <Textarea readOnly rows={6} label={'Message'} {...form.getInputProps('message')} />
            </form>
        </Modal>
    );
}
