import { useState } from "react";
import {
  LockOutlined,
  UserOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Row, Col, Spin } from "antd";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = ({ auth, setAuth }) => {
  const [loginDetails, setLoginDetails] = useState({
    user_name: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [spinner, setSpinner] = useState(false);
  //controlvisiblity of input
  const [visible, setVisible] = useState(false);

  //hook
  const navigate = useNavigate();

  const handleHideInput = () => {
    setVisible(!visible);
  };

  const onFinish = async () => {
    setLoading(true);
    const { data } = await axios.post("/login", loginDetails);
    if (data.error) {
      toast.error(data.error);
      setLoading(false);
    } else {
      setAuth({
        user: data.user,
        token: data.token,
      });

      localStorage.setItem("auth", JSON.stringify(data.token));
      toast.success("Succesfully logged in");

      const case_id = data.case_id.case_id;

      if (case_id == 0) {
        navigate("/users");
        setLoading(false);
      } else if (case_id) {
        navigate("/chat");
        setLoading(false);
      } else {
        navigate("/signup");
      }
    }
  };
  const handleChange = (e) => {
    setLoginDetails({ ...loginDetails, [e.target.name]: e.target.value });
  };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <div>
        <h2
          style={{ color: "blue", textAlign: "center", marginBottom: "30px" }}
        >
          Login
        </h2>
        <Row>
          <Col span={16} offset={4}>
            <Form name="normal_login" className="login-form">
              <Form.Item>
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="username"
                  name="user_name"
                  value={loginDetails.user_name}
                  onChange={handleChange}
                  style={{ fontSize: "20px" }}
                />
              </Form.Item>
              <Form.Item>
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={loginDetails.password}
                  onChange={handleChange}
                  style={{ fontSize: "20px" }}
                />
              </Form.Item>
              <Form.Item>
                <a
                  style={{ float: "right", fontSize: "1rem" }}
                  onClick={() => {
                    navigate("/signup");
                    setSpinner(true);
                  }}
                >
                  <Spin spinning={spinner} />
                  <i style={{ marginRight: "12px" }}>
                    Signup <ArrowRightOutlined />
                  </i>
                </a>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  className="login-form-button"
                  style={{ fontSize: "20px" }}
                  onClick={onFinish}
                  loading={loading}
                >
                  Log in
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default Login;
