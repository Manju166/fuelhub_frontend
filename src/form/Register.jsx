import React from 'react';
import { Form, Input, Button, Select, Typography } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useQuery } from '@apollo/client'; // Apollo Client hook for data fetching
import { GET_TENANTS } from '../graphql/queries'; // Import the tenant query
import '../styles/register.css';

const { Option } = Select;
const { Text } = Typography;

const Register = () => {
  // Fetch tenants using useQuery
  const { loading, error, data } = useQuery(GET_TENANTS);

  const onFinish = (values) => {
    console.log('Received values:', values);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching tenants: {error.message}</p>;

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
          <Select placeholder="Select your organization" className="registration__input">
            {data.tenants.map((tenant) => (
              <Option key={tenant.id} value={tenant.id}>
                {tenant.name}
              </Option>
            ))}
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
          Already have an account? <a href="/">Login</a>
        </Text>
      </div>
    </div>
  );
};

export default Register;
