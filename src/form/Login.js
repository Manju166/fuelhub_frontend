import React from 'react';
import { Form, Input, Button, Select, Typography } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom'; 
import '../styles/login.css';

const { Option } = Select;
const { Text } = Typography;

const Login = () => {
  const onFinish = (values) => {
    console.log('Received values:', values);
  };

  return (
    <div className="login">
      <h2 className="login__title">Login</h2>
      <Form
        name="login_form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        layout="vertical"
        className="login__form"
      >
        <Form.Item
          name="organization"
          label="Select Organization"
          className="login__form-item"
          rules={[{ required: true, message: 'Please select your organization!' }]}
        >
          <Select placeholder="Select an organization" className="login__select">
            <Option value="org1">Organization 1</Option>
            <Option value="org2">Organization 2</Option>
            <Option value="org3">Organization 3</Option>
            {/* Add more options as needed */}
          </Select>
        </Form.Item>

        <Form.Item
          name="email"
          label="Username/Email"
          className="login__form-item"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'The input is not a valid email!' },
          ]}
        >
          <Input
            prefix={<MailOutlined className="login__icon" />}
            placeholder="Enter your email"
            type="email"
            className="login__input"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          className="login__form-item"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password
            prefix={<LockOutlined className="login__icon" />}
            placeholder="Enter your password"
            className="login__input"
          />
        </Form.Item>

        <Form.Item className="login__form-item">
          <Button type="primary" htmlType="submit" block className="login__button">
            Login
          </Button>
        </Form.Item>

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
