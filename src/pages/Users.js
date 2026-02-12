// eslint-disable-next-line no-unused-vars
import { useEffect, useState } from "react";
import UserService from "../services/UserService";
import { Layout, Table, Row, Col, Menu, Breadcrumb, theme, Typography, Button, Modal, Form, Input, Select, Popconfirm, notification } from "antd";
import { useNavigate } from "react-router-dom";
import { menuItems } from "../utils/menu";
import { UserOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Header, Footer, Content } = Layout;

function Users() {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isModalUserOpen, setIsModalUserOpen] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const renderActions = (record) => {
    return (
      <Row gutter={24}>
        <Col>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>Edit</Button>
        </Col>
        <Col>
          <Popconfirm
            title="Delete the user"
            description="Are you sure to delete this user?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger>Delete</Button>
          </Popconfirm>
        </Col>
      </Row>
    )
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Actions', dataIndex: 'actions', key: 'actions', render: (text, record) => renderActions(record) },
  ];

  const handleEdit = (user) => {
    setCurrentUser(user);
    setIsModalUserOpen(true);
  };

  const handleCancel = () => {
    setCurrentUser(null);
    setIsModalUserOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate('/login');
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const userSevice = new UserService();
      if (currentUser) {
        await userSevice.update(currentUser.id, values);
      } else {
        await userSevice.create(values);
      }
      fetchUsers();
      handleCancel();
    } catch (error) {
      notification.error({
        message: 'Error',
        description: error.response.data.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const userService = new UserService();
      await userService.delete(id);
      if (user?.id === id) {
        handleLogout();
        return;
      }

      fetchUsers();
    } catch (error) {
      notification.error({
        message: 'Error',
        description: error.response.data.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const userService = new UserService();
      const response = await userService.list();
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        navigate('/login');
      }

      setError(error.response.data.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Layout>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography.Title level={3} style={{ color: 'white', margin: '0 20px 0 0' }}>SPS Group</Typography.Title>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          items={menuItems}
          style={{ flex: 1, minWidth: 0 }}
        />
        <Row justify={'end'}>
          <Row>
            <Col>
              <UserOutlined style={{ color: 'white', margin: '0 20px 0 0' }} />
              <Typography.Text style={{ color: 'white', margin: '0 20px 0 0' }}>{user?.name || '-'}</Typography.Text>
            </Col>
            <Col>
              <Button type="link" onClick={handleLogout}>Logout</Button>
            </Col>
          </Row>
        </Row>
      </Header>
      <Content style={{ padding: '0 48px' }}>
        <Breadcrumb
          style={{ margin: '16px 0' }}
          items={[{ title: 'Home' }, { title: 'Users' }]}
        />
        <Row justify={'end'}>
          <Col span={24}>
            <Button type="primary" style={{ marginBottom: '10px' }} onClick={() => setIsModalUserOpen(true)}>
              Add User
            </Button>
          </Col>
        </Row>
        <div
          style={{
            padding: 24,
            minHeight: 380,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Row>
            <Col span={24}>
              {loading ? (
                <div>Carregando...</div>
              ) : error ? (
                <div>{error}</div>
              ) : (
                <Table dataSource={users} columns={columns} />
              )}
            </Col>
          </Row>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        SPS Group © {new Date().getFullYear()}
      </Footer>

      <Modal
        title={currentUser ? 'Edit User' : 'Add User'}
        open={isModalUserOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          name="formUser"
          onFinish={onFinish}
          initialValues={currentUser}
          disabled={loading}
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="type"
            rules={[{ required: true, message: 'Please select user type!' }]}
          >
            <Select placeholder="User Type" options={[
              { value: 'admin', label: 'Admin' },
              { value: 'user', label: 'User' },
            ]} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
              {currentUser ? 'Save Changes' : 'Create User'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
}

export default Users;
