import React from "react";
import "semantic-ui-css/semantic.min.css";
import { Link, withRouter } from "react-router-dom";

import { Container, Button, Form, Grid, Divider } from "semantic-ui-react";
import { toast } from "react-toastify";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      passwordRepeat: "",
    };
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { email, username, password, passwordRepeat } = this.state;

    if (username.length < 3) {
      this.setState({
        usernameError: "Username must be at least 3 characters long",
      });
      return;
    }

    if (email.length < 3) {
      this.setState({
        emailError: "Email must be at least 3 characters long",
      });
      return;
    }

    if (password.length < 6) {
      this.setState({
        passwordError: "Password must be at least 3 characters long",
      });
      return;
    }

    if (password !== passwordRepeat) {
      this.setState({
        passwordError: "Passwords do not match",
        passwordRepeatError: "Passwords do not match",
      });
      return;
    } else {
      this.setState({
        passwordError: null,
        passwordRepeatError: null,
      });
    }

    fetch("http://localhost:8080/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        username,
      }),
    })
      .then((r) => {
        if (r.ok) return r;

        if (r.status === 400) {
          return Promise.reject(
            new Error("Bilgilerinizin doğruluğundan emin olunuz!")
          );
        }
        if (r.status === 500) {
          return Promise.reject(
            new Error(
              "Sistemimizde bir sıkıntı yaşıyoruz en kısa zamanda çözeceğiz. Lütfen daha sonra tekrar deneyiniz!"
            )
          );
        }

        return Promise.reject(new Error("Bilinmeyen bir hata oluştu!"));
      })
      .then((r) => r.json())
      .then((response) => {
        toast.success(
          //`User with $(response.username) has been created`
          "Kayıt işlemi tamamlandı. Giriş sayfasına yönlendiriliyorsunuz!"
        );
        setTimeout(() => this.props.history.push("/login"), 5000);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  formStyle = {
    marginTop: "15%",
  };

  bgStyle = {
    backgroundImage: `url(/images/register.jpg)`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    width: "100vw",
    height: "100vh",
  };

  render() {
    return (
      <div style={this.bgStyle}>
        <Container>
          <Grid columns="equal">
            <Grid.Row columns={3}>
              <Grid.Column style={this.formStyle}>
                <Form onSubmit={this.handleSubmit}>
                  <Form.Field>
                    <label>Username</label>
                    <Form.Input
                      type="text"
                      placeholder="Username"
                      name="username"
                      error={this.state.usernameError}
                      onChange={this.handleChange}
                      required
                      value={this.state.username}
                    />
                  </Form.Field>

                  <Form.Field>
                    <label>E-mail</label>
                    <Form.Input
                      type="email"
                      placeholder="E-mail"
                      name="email"
                      error={this.state.emailError}
                      onChange={this.handleChange}
                      required
                      value={this.state.email}
                    />
                  </Form.Field>

                  <Form.Field>
                    <label>Password</label>
                    <Form.Input
                      type="password"
                      placeholder="Password"
                      name="password"
                      error={this.state.passwordError}
                      required
                      value={this.state.password}
                      onChange={(event) => {
                        this.handleChange(event);
                      }}
                    />
                  </Form.Field>

                  <Form.Field>
                    <label>Repeat Password</label>
                    <Form.Input
                      type="password"
                      placeholder="Repeat Password"
                      name="passwordRepeat"
                      error={this.state.passwordRepeatError}
                      required
                      value={this.state.passwordRepeat}
                      onChange={(event) => {
                        this.handleChange(event);
                      }}
                    />
                  </Form.Field>
                  <Grid textAlign="center">
                    <Grid.Column>
                      <Button fluid type="submit">
                        Submit
                      </Button>
                    </Grid.Column>
                  </Grid>
                </Form>
                <Divider />
                <Link to="/login">Do you have already register?</Link>
              </Grid.Column>
              <Grid.Column></Grid.Column>
              <Grid.Column></Grid.Column>
            </Grid.Row>

            <Grid.Column></Grid.Column>
          </Grid>
        </Container>
      </div>
    );
  }
}

export default withRouter(Register);
