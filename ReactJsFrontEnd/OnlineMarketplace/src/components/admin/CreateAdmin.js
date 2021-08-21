import React, { useState } from "react";
import fetch from "isomorphic-unfetch";
import { Button, Modal, Form, Grid, Divider } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import { toast } from "react-toastify";
import { getCurrentUser } from "../../helpers/token";

function CreateAdmin(props) {
  const [open, setOpen] = useState(false);

  const [usernameEmail, setUsernameEmail] = useState({
    username: "",
    email: "",
  });

  let username;
  let email;

  const [usernameEmailError, setUsernameEmailError] = useState({
    username,
    email,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUsernameEmail({ ...usernameEmail, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const currentUser = getCurrentUser();
    const { username, email } = usernameEmail;
    if (username.length < 3) {
      setUsernameEmailError({
        ...usernameEmailError,
        username: "Username must be at least 3 characters long",
      });
      return;
    }

    if (email.length < 3) {
      setUsernameEmailError({
        ...usernameEmailError,
        password: "Please write a valid email",
      });
      return;
    }
    fetch("http://localhost:8080/api/auth/signup-admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.token}`,
      },
      body: JSON.stringify({
        email,
        username,
      }),
    })
      .then((r) => {
        if (r.ok) return r;

        if (r.status === 400) {
          return Promise.reject(new Error("Please control your informations!"));
        }
        if (r.status === 401 || r.status === 403) {
          return Promise.reject(
            new Error(
              "You are not allowed to create an admin account. Please contact the administrator."
            )
          );
        }

        return Promise.reject(
          new Error(
            "We have a problem with our server, please try again later!"
          )
        );
      })
      .then((r) => r.json())
      .then((response) => {
        toast.success("Registiration complete. Informations send with mail!");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button>Create Admin Account</Button>}
    >
      <Modal.Header>Admin Registiration</Modal.Header>
      <Modal.Content>
        <Grid>
          <Grid.Column>
            <Form onSubmit={handleSubmit}>
              <Form.Field>
                <label>Username</label>
                <Form.Input
                  type="text"
                  placeholder="Username"
                  name="username"
                  error={usernameEmailError.username}
                  onChange={handleChange}
                  required
                  value={usernameEmail.username}
                />
              </Form.Field>

              <Form.Field>
                <label>Email</label>
                <Form.Input
                  type="email"
                  placeholder="Email"
                  name="email"
                  error={usernameEmailError.email}
                  required
                  value={usernameEmail.email}
                  onChange={handleChange}
                />
              </Form.Field>

              <Button fluid type="submit">
                Submit
              </Button>
            </Form>
          </Grid.Column>
        </Grid>
        <Modal.Description>
          <p>
            Password will send via email. Please be sure about email address.
          </p>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color="red" align="left" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default CreateAdmin;
