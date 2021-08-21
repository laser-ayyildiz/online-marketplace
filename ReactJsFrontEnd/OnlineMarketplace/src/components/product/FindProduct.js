import React, { useState } from "react";
import fetch from "isomorphic-unfetch";
import { Button, Form, Input, Icon, Grid } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import { toast } from "react-toastify";
import { getCurrentUser } from "../../helpers/token";
import { useHistory } from "react-router";

function FindProduct({ getSearchElements }) {
  const history = useHistory();
  const [nameParam, setNameParam] = useState({
    name: "",
  });

  let name;

  const [nameParamError, setNameParamError] = useState({
    name,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNameParam({ ...nameParam, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const currentUser = getCurrentUser();
    const { name } = nameParam;
    if (name.length < 3) {
      setNameParamError({
        ...nameParamError,
        name: "Search param must be at least 3 characters long",
      });
      return;
    }
    fetch(
      "http://localhost:8080/api/product/list?" +
        new URLSearchParams({
          name: name,
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

        if (r.status === 401 || r.status === 403) {
          return Promise.reject(
            new Error("You are not allowed for this search.")
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
        if (response.content.length === 0)
          return Promise.reject(new Error("Product not found."));

        getSearchElements(response);
        toast.success("You found it!");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <div>
      <Grid columns="equal" style={{ marginTop: "10px", marginBottom: "10px" }}>
        <Grid.Column />
        <Form onSubmit={handleSubmit}>
          <Grid.Column>
            <Form.Field>
              <Input
                type="text"
                placeholder="Search by name"
                name="name"
                error={nameParamError.name}
                onChange={handleChange}
                required
                value={nameParam.name}
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

export default FindProduct;
