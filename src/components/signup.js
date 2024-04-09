import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Button, Row, Col, Form, Input, Spin } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowRightOutlined } from "@ant-design/icons";

const SignUp = () => {
  const navigate = useNavigate();
  //state
  const [signupDetails, setSignupDetails] = useState({
    user_name: "",
    case_id: "",
    password: "",
    password_confirmed: "",
  });
  const [loading, setLoading] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(true);

  //handle button disable
  useEffect(() => {
    const checkDisable = () => {
      if (
        signupDetails.user_name &&
        signupDetails.case_id &&
        signupDetails.password &&
        signupDetails.password_confirmed
      ) {
        setDisableSubmit(false);
      } else {
        setDisableSubmit(true);
      }
    };
    checkDisable();
  }, [signupDetails]);

  const handleChange = (e) => {
    setSignupDetails((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const onFinish = async () => {
    if (signupDetails.password != signupDetails.password_confirmed) {
      toast.error("Passwords do not match");
      return;
    }
    const api = process.env.REACT_APP_API;
    //send all the vales in signupDetails except password_confirmed
    const { data } = await axios.post(`${api}/signup`, {
      ...signupDetails,
      password_confirmed: undefined,
    });
    if (data.error) {
      toast.error(data.error);
    }
    if (data._id) {
      toast.success("successful signup");
      navigate("/");
    }
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
          Create Account
        </h2>
        <Row>
          <Col span={16} offset={4}>
            <Form
              layout="horizontal"
              style={{
                marginTop: "15px",
              }}
            >
              <Form.Item>
                <Input
                  placeholder="Username"
                  name="user_name"
                  value={signupDetails.user_name}
                  onChange={handleChange}
                />
              </Form.Item>
              <Form.Item>
                <Input
                  placeholder="Case Id"
                  name="case_id"
                  value={signupDetails.case_id}
                  onChange={handleChange}
                />
              </Form.Item>
              <Form.Item>
                <Input
                  placeholder="Password"
                  name="password"
                  type="password"
                  value={signupDetails.password}
                  onChange={handleChange}
                />
              </Form.Item>
              <Form.Item>
                <Input
                  placeholder="Confirm Password"
                  name="password_confirmed"
                  type="password"
                  value={signupDetails.password_confirmed}
                  onChange={handleChange}
                />
              </Form.Item>

              <Form.Item>
                <a
                  style={{
                    float: "right",
                    fontSize: "1rem",
                    marginBottom: "16px",
                  }}
                  onClick={() => {
                    navigate("/");
                    setSpinner(true);
                  }}
                >
                  <Spin spinning={spinner} />
                  <i>
                    Login <ArrowRightOutlined />
                  </i>
                </a>
                {!disableSubmit ? (
                  <Button type="primary" block onClick={onFinish}>
                    Submit
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    block
                    onClick={onFinish}
                    loading={loading}
                    disabled
                  >
                    Submit
                  </Button>
                )}
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default () => <SignUp />;
