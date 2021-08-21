import React, { useState } from "react";
import "semantic-ui-css/semantic.min.css";
import { Link, useHistory } from "react-router-dom";

import { Container, Button, Form, Grid, Divider } from "semantic-ui-react";
import { toast } from "react-toastify";

const Login = (showRegisterLink) => {
  let history = useHistory();

  const [usernamePassword, setUsernamePassword] = useState({
    username: "",
    password: "",
  });

  let username;
  let password;

  const [usernamePasswordError, setUsernamePasswordError] = useState({
    username,
    password,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUsernamePassword({ ...usernamePassword, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { username, password } = usernamePassword;
    if (username.length < 3) {
      setUsernamePasswordError({
        ...usernamePasswordError,
        username: "Username must be at least 3 characters long",
      });
      return;
    }

    if (password.length < 3) {
      setUsernamePasswordError({
        ...usernamePasswordError,
        password: "Password must be at least 3 characters long",
      });
      return;
    }
    fetch("http://localhost:8080/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        username,
      }),
    })
      .then((r) => {
        if (r.ok) return r;

        if (r.status === 400 || r.status === 401) {
          return Promise.reject(new Error("Control your informations!"));
        }

        if (r.status === 500) {
          return Promise.reject(new Error("We have some problems!"));
        }

        return Promise.reject(new Error("We have some problems!"));
      })
      .then((r) => r.json())
      .then((response) => {
        localStorage.setItem("currentUser", JSON.stringify(response));
        toast.success("Login başarılı!");
        history.push("/");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <Container>
      <Grid columns="equal">
        <Grid.Column></Grid.Column>
        <Grid.Column>
          <Form onSubmit={handleSubmit}>
            <Form.Field>
              <label>Username</label>
              <Form.Input
                type="text"
                placeholder="Username"
                name="username"
                error={usernamePasswordError.username}
                onChange={handleChange}
                required
                value={usernamePassword.username}
              />
            </Form.Field>

            <Form.Field>
              <label>Password</label>
              <Form.Input
                type="password"
                placeholder="Password"
                name="password"
                error={usernamePasswordError.password}
                required
                value={usernamePassword.password}
                onChange={handleChange}
              />
            </Form.Field>

            <Grid textAlign="center">
              <Grid.Column>
                <Button fluid type="submit">
                  Submit
                </Button>
                <Divider />
                {showRegisterLink && (
                  <Link to="/register">
                    You don't have an account? Please register
                  </Link>
                )}
              </Grid.Column>
            </Grid>
          </Form>
        </Grid.Column>

        <Grid.Column></Grid.Column>
      </Grid>
    </Container>
  );
};
export default Login;
