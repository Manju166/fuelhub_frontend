import React from 'react';
import { Form, Input, Button, Select, Typography } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom'; 
import REGISTER_MUTATION from '../mutations/RegisterMutation';
import '../styles/register.css';
import { GET_TENANTS } from '../query/TenantQuery';

const { Option } = Select;
const { Text } = Typography;

const Register = () => {
  const { data: tenantData } = useQuery(GET_TENANTS);
  const [register, { loading: registerLoading, error: registerError, data: registerData }] = useMutation(REGISTER_MUTATION);
  const navigate = useNavigate(); 

  const onFinish = (values) => {
    register({
      variables: {
        email: values.email,
        password: values.password,
        passwordConfirmation: values.passwordconfirm,
        tenantId: parseInt(values.tenant, 10),
      },
    }).then(() => {
      navigate('/');
    }).catch(err => {
      console.error('Mutation error:', err);
    });
  };

  if (registerData) {
    return <p>Registration successfulL!</p>;
  }

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
          name="tenant"
          label="Tenant"
          rules={[{ required: true, message: 'Please select your tenant!' }]}
        >
          <Select placeholder="Select your tenant">
            {tenantData?.tenants?.map((tenant) => (
              <Option key={tenant.id} value={tenant.id}>
                {tenant.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="email"
          label="Email Address"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'The input is not a valid email!' },
          ]}
        >
          <Input
            prefix={<MailOutlined className="registration__icon" />}
            placeholder="Enter your email"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: 'Please input your password!' },
            { min: 8, message: 'Password must be at least 8 characters long!' },
            // Uncomment the following pattern for stronger password rules
            // {
            //   pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            //   message: 'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character!',
            // },
          ]}
          hasFeedback
        >
          <Input.Password
            prefix={<LockOutlined className="registration__icon" />}
            placeholder="Enter your password"
          />
        </Form.Item>

        <Form.Item
          name="passwordconfirm"
          label="Confirm Password"
          dependencies={['password']}
          hasFeedback
          rules={[
            { required: true, message: 'Please confirm your password!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Passwords do not match!'));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="registration__icon" />}
            placeholder="Confirm your password"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={registerLoading}>
            Register
          </Button>
        </Form.Item>

        {registerError && <p>Error: {registerError.message}</p>}
      </Form>
      <div className="registration__login">
        <Text>
          Already have an account? <a href="/login">Login</a>
        </Text>
      </div>
    </div>
  );
};

export default Register;
