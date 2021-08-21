import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import fetch from "isomorphic-unfetch";
import { Button, Container, Form, TextArea } from "semantic-ui-react";
import { getCurrentUser } from "../../helpers/token";
import Navbar from "../Navbar";

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      username: "",
      email: "",
    };
  }
  componentDidMount = () => {
    this.getUser();
  };

  getUser = () => {
    const currentUser = getCurrentUser();
    fetch(
      "http://localhost:8080/api/user?" +
        new URLSearchParams({
          username: this.props.match.params.username,
        }),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
      }
    )
      .then((r) => {
        if (r.ok) {
          return r;
        }
        if (r.status === 404) {
          return Promise.reject(new Error("User Not Found"));
        }
        if (r.status === 401 || r.status === 403) {
          return Promise.reject(new Error("You can't do this"));
        }
        return Promise.reject(new Error("Something went wrong!"));
      })
      .then((r) => r.json())
      .then((response) => {
        this.setState({ user: response });
      })
      .catch((e) => {
        toast.error(e.message);
      });
  };

  deleteUser = () => {
    const currentUser = getCurrentUser();
    fetch("http://localhost:8080/api/user", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.token}`,
      },
      body: JSON.stringify({
        username: this.props.match.params.username,
      }),
    })
      .then((r) => {
        if (r.ok) {
          return r;
        }
        if (r.status === 401 || r.status === 403) {
          return Promise.reject(new Error("You can't do this"));
        }
        return Promise.reject(new Error("Bilinmeyen bir hata oluştu."));
      })
      .then((r) => r.json())
      .then((response) => {
        toast.success(response.message && "User deleted");
      })
      .catch((e) => {
        toast.error(e.message);
      });
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  render() {
    const { user } = this.state;
    return (
      <div>
        <Navbar />
        <Container>
          <Form>
            <Form.Group widths="equal">
              <Form.Input
                fluid
                label="Name"
                placeholder="Name"
                name="username"
                value={user.username}
                onChange={this.handleChange}
              />
              <Form.Input
                fluid
                label="Email"
                placeholder="Email"
                value={user.email}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Input
                fluid
                label="City"
                placeholder="City"
                value={user.city}
                onChange={this.handleChange}
              />
              <Form.Input
                fluid
                label="State"
                placeholder="State"
                value={user.state}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group widths="equal">
              <Form.TextArea
                fluid
                label="Address"
                placeholder="Address"
                value={user.address}
                onChange={this.handleChange}
              ></Form.TextArea>
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Input
                fluid
                label="Creation Date"
                placeholder="Creation Date"
                value={user.createdAt}
                onChange={this.handleChange}
              />
              <Form.Input
                fluid
                label="Last Update Date"
                placeholder="Last Update Date"
                value={user.updatedAt}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Button
              color="red"
              size="large"
              type="submit"
              onClick={this.deleteUser}
            >
              Delete
            </Button>
          </Form>
        </Container>
      </div>
    );
  }
}

export default User;
