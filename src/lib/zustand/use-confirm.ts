import { ButtonProps } from '@mantine/core';
import { create } from 'zustand';

type ConfirmProps = {
    title?: string;
    message?: string;
    okButton?: ButtonProps & { value: string };
    handleOk?: () => void;
};

interface ConfirmState {
    open: boolean;
    props: ConfirmProps;
    setConfirm: (props: ConfirmProps) => void;
    toggle: () => void;
    close: () => void;
}

export const useConfirmStore = create<ConfirmState>((set) => ({
    open: false,
    props: {},
    setConfirm: (newProps: ConfirmProps) => set({ props: newProps, open: true }),
    toggle: () => set((state) => ({ open: !state.open })),
    close: () => set({ open: false, props: {} }),
}));
