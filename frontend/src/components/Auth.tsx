'use client';

import { useState } from 'react';
import { Button, Card, Form, Input, Row, Typography } from 'antd';
import { gql, useMutation } from '@apollo/client';
import { useAuthStore } from '@/stores/authStore';
import useApp from 'antd/es/app/useApp';
import { useRouter } from 'next/navigation';

const LOGIN = gql`
  mutation Login($input: UserInput!) {
    signIn(input: $input) {
      token
      user {
        id
        email
      }
    }
  }
`;

const REGISTER = gql`
  mutation Register($input: UserInput!) {
    signUp(input: $input) {
      token
      user {
        id
        email
      }
    }
  }
`;

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const setAuth = useAuthStore((state) => state.setAuth);
  const { message } = useApp();
  const router = useRouter();

  const [login, loginState] = useMutation(LOGIN, {
    onCompleted: (data) => {
      setAuth(data.signIn.token, data.signIn.user);
      void message.success('Successfully logged in!');
      router.push('/');
    },
    onError: (err) => {
      void message.error(err.message);
    },
  });

  const [register, registerState] = useMutation(REGISTER, {
    onCompleted: (data) => {
      setAuth(data.signUp.token, data.signUp.user);
      void message.success('Successfully registered!');
      router.push('/');
    },
    onError: (err) => {
      void message.error(err.message);
    },
  });

  return (
    <Row justify="center" align="middle" style={{ flexGrow: 1 }}>
      <Card title={isLogin ? 'Sign in to your account' : 'Create a new account'} style={{ width: 400 }}>
        <Form
          name="auth-form"
          layout="vertical"
          onFinish={(input) => {
            if (isLogin) {
              void login({ variables: { input } });
            } else {
              void register({ variables: { input } });
            }
          }}
          autoComplete="off"
        >
          <Form.Item label="Email" name="email" rules={[{ required: true }, { type: 'email' }]}>
            <Input size="large" />
          </Form.Item>

          <Form.Item label="Password" name="password" rules={[{ required: true }, { min: 6 }]}>
            <Input.Password size="large" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={isLogin ? loginState.loading : registerState.loading}
            >
              {isLogin ? 'Sign in' : 'Sign up'}
            </Button>
          </Form.Item>

          <Typography.Link onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </Typography.Link>
        </Form>
      </Card>
    </Row>
  );
};
