import React from 'react';
import { Form, Input, Button, Select, Typography } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom'; 
import '../styles/register.css';

const { Option } = Select;
const { Text } = Typography;

const Register = () => {
  const onFinish = (values) => {
    console.log('Received values:', values);
  };

  return (
    <div className="registration">
      <h2 className="registration__title">Register</h2>
      <Form
        name="registration_form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        layout="vertical"
        className="registration__form"
      >
        <Form.Item
          name="email"
          label="Username/Email"
          className="registration__form-item"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'The input is not a valid email!' },
          ]}
        >
          <Input
            prefix={<MailOutlined className="registration__icon" />}
            placeholder="Enter your email"
            type="email"
            className="registration__input"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          className="registration__form-item"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password
            prefix={<LockOutlined className="registration__icon" />}
            placeholder="Enter your password"
            className="registration__input"
          />
        </Form.Item>

        <Form.Item
          name="organization"
          label="Organization"
          className="registration__form-item"
          rules={[{ required: true, message: 'Please select your organization!' }]}
        >
          <Select
            placeholder="Select your organization"
            className="registration__input"
          >
            <Option value="org1">Organization 1</Option>
            <Option value="org2">Organization 2</Option>
            <Option value="org3">Organization 3</Option>
          </Select>
        </Form.Item>

        <Form.Item className="registration__form-item">
          <Button type="primary" htmlType="submit" block className="registration__button">
            Register
          </Button>
        </Form.Item>
      </Form>

      <div className="registration__login">
        <Text>
          Already have an account? <Link to="/">Login</Link>
        </Text>
      </div>
    </div>
  );
};

export default Register;
