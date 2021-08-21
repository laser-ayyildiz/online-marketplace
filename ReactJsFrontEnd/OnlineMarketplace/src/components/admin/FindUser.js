import React, { useState } from "react";
import fetch from "isomorphic-unfetch";
import { Button, Form, Input, Icon, Grid } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import { toast } from "react-toastify";
import { getCurrentUser } from "../../helpers/token";
import { useHistory } from "react-router";

function FindUser() {
  const history = useHistory();

  const [usernameParam, setUsername] = useState({
    username: "",
  });

  let username;

  const [usernameParamError, setUsernameParamError] = useState({
    username,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUsername({ ...usernameParam, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const currentUser = getCurrentUser();
    const { username } = usernameParam;
    if (username.length < 3) {
      setUsernameParamError({
        ...usernameParamError,
        username: "Search param must be at least 3 characters long",
      });
      return;
    }
    fetch(
      "http://localhost:8080/api/user?" +
        new URLSearchParams({
          username: username,
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
        if (r.ok) return r;

        if (r.status === 400) {
          return Promise.reject(new Error("Please control your informations!"));
        }
        if (r.status === 401 || r.status === 403) {
          return Promise.reject(
            new Error("You are not allowed for this search.")
          );
        }
        if (r.status === 404) {
          return Promise.reject(new Error("User not found."));
        }

        return Promise.reject(
          new Error(
            "We have a problem with our server, please try again later!"
          )
        );
      })
      .then((r) => r.json())
      .then((response) => {
        toast.success("You found it!");
        history.push(`/user/${response.username}`);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <div>
      <Grid columns="equal">
        <Grid.Column />
        <Form onSubmit={handleSubmit}>
          <Grid.Column>
            <Form.Field>
              <Input
                type="text"
                placeholder="Search by username"
                name="username"
                error={usernameParamError.username}
                onChange={handleChange}
                required
                value={usernameParam.username}
              ></Input>
            </Form.Field>
          </Grid.Column>
          <Button icon type="submit">
            <Icon name="search" />
          </Button>
        </Form>
      </Grid>
    </div>
  );
}

export default FindUser;
