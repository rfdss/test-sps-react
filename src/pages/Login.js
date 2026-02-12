import { Form, Input, Button, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import UserService from '../services/UserService';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginContainerStyle } from '../styles';

function Login() {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const userSevice = new UserService();
      const res = await userSevice.login(values);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <div style={loginContainerStyle}>
      <Card title="Login" style={{ width: 300 }}>
        <Form onFinish={onFinish}>
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="E-mail" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
        </Form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </Card>
    </div>
  );
}

export default Login;
