import { Box, Button, Divider, Group, Paper, PasswordInput, Stack, Text, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { upperFirst } from '@mantine/hooks';
import { z } from 'zod';
import { login } from '../apis/auth';
import { useNavigate } from 'react-router';
import Links from '../system/links';

const loginSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Login() {
    const navigate = useNavigate();

    const form = useForm({
        validate: zodResolver(loginSchema),
        initialValues: {
            username: '',
            password: '',
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        const credential = await login(values);

        if (credential && credential.data) {
            navigate(Links.DASHBOARD);
        }
    };

    return (
        <Box className="w-screen h-screen flex items-center justify-center">
            <Paper w={400} radius="md" p="xl" withBorder>
                <Text size="xl" className="text-center" fw={500}>
                    Login to KTQ Admin
                </Text>

                <Divider label="" labelPosition="center" my="lg" />

                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack>
                        <TextInput label="Username" placeholder="Your username" {...form.getInputProps('username')} radius="md" />

                        <PasswordInput label="Password" placeholder="Your password" {...form.getInputProps('password')} radius="md" />
                    </Stack>

                    <Group justify="space-between" mt="xl">
                        <Button fullWidth type="submit" radius="xl">
                            {upperFirst('Login')}
                        </Button>
                    </Group>
                </form>
            </Paper>
        </Box>
    );
}
