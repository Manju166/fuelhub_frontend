import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Typography } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom'; 
import { useMutation, useQuery } from '@apollo/client';
import { GET_TENANTS } from '../query/TenantQuery';
import LOGIN_MUTATION from '../mutations/LoginMutation';
import '../styles/login.css';

const { Option } = Select;
const { Text } = Typography;

const Login = () => {
  const { data } = useQuery(GET_TENANTS);
  const [login, { loading: loginLoading, error: loginError, data: loginData }] = useMutation(LOGIN_MUTATION);
  const navigate = useNavigate();

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [tenantError, setTenantError] = useState('');

  useEffect(() => {
    // Check if already logged in
    if (localStorage.getItem('token')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (values) => {
    setEmailError('');
    setPasswordError('');
    setTenantError('');

    try {
      const response = await login({
        variables: {
          email: values.email,
          password: values.password,
          tenantId: parseInt(values.tenant, 10),
        },
      });

      if (response.data.loginUser) {
        localStorage.setItem('token', response.data.loginUser.token);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.message.includes('Invalid email')) {
        setEmailError('Email does not match our records. Please check your email or register.');
      }
      if (err.message.includes('Invalid password')) {
        setPasswordError('Password is incorrect. Please check your password.');
      }
      if (err.message.includes('Invalid tenant')) {
        setTenantError('Tenant ID is not registered. Please select a valid tenant.');
      }
    }
  };

  return (
    <div className="login">
      <h2 className="login__title">Login</h2>
      <Form name="login_form" onFinish={handleLogin} layout="vertical" className="login__form">
        <Form.Item
          name="tenant"
          label="Tenant"
          validateStatus={tenantError ? 'error' : ''}
          help={tenantError}
          rules={[{ required: true, message: 'Please select your Tenant!' }]}
        >
          <Select placeholder="Select a Tenant">
            {data?.tenants?.map((tenant) => (
              <Option key={tenant.id} value={tenant.id}>
                {tenant.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="email"
          label="Email Address"
          validateStatus={emailError ? 'error' : ''}
          help={emailError}
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Invalid email format!' }
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Enter your email" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          validateStatus={passwordError ? 'error' : ''}
          help={passwordError}
          rules={[
            { required: true, message: 'Please input your password!' },
            { min: 8, message: 'Password must be at least 8 characters long!' }
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Enter your password" />
        </Form.Item>

        <Button type="primary" htmlType="submit" block loading={loginLoading}>
          Login
        </Button>

        {loginError && <p>Error: {loginError.message}</p>}

        <Form.Item className="login__form-item login__register-link">
          <Text>
            Don't have an account? <Link to="/register">Register</Link>
          </Text>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
