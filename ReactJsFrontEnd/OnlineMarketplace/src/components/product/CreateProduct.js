import React, { useState } from "react";
import fetch from "isomorphic-unfetch";
import { Button, Modal, Form, Grid, Divider } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import { toast } from "react-toastify";
import { getCurrentUser } from "../../helpers/token";

function CreateProduct(props) {
  const [open, setOpen] = useState(false);

  const [productInfo, setProductInfo] = useState({
    seller: { id: 0 },
    name: "",
    price: 0,
    shippingCost: 0,
    discountRate: 0,
    category: { id: 0 },
    description: "",
  });

  let seller, name, price, shippingCost, discountRate, category, description;

  const [productInfoError, setProductInfoError] = useState({
    seller: { id: 0 },
    name,
    price,
    shippingCost,
    discountRate,
    category: { id: 0 },
    description,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProductInfo({ ...productInfo, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const currentUser = getCurrentUser();
    const {
      seller,
      name,
      price,
      shippingCost,
      discountRate,
      category,
      description,
    } = productInfo;

    fetch("http://localhost:8080/api/product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.token}`,
      },

      body: JSON.stringify({
        seller: parseInt(seller.id),
        name,
        price: parseFloat(price),
        shippingCost: parseFloat(shippingCost),
        discountRate: parseInt(discountRate),
        category: parseInt(category),
        description,
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
      trigger={<Button>Create Product</Button>}
    >
      <Modal.Header>Product</Modal.Header>
      <Modal.Content>
        <Grid>
          <Grid.Column>
            <Form onSubmit={handleSubmit}>
              <Form.Field>
                <label>Product Name</label>
                <Form.Input
                  type="text"
                  placeholder="Name"
                  name="name"
                  error={productInfoError.name}
                  onChange={handleChange}
                  required
                  value={productInfo.name}
                />
              </Form.Field>

              <Form.Field>
                <label>Seller</label>
                <Form.Input
                  type="number"
                  placeholder="Seller"
                  name="seller"
                  error={productInfoError.seller.id}
                  onChange={handleChange}
                  required
                  value={productInfo.seller.id}
                />
              </Form.Field>
              <Form.Field>
                <label>Price</label>
                <Form.Input
                  type="number"
                  placeholder="Price"
                  name="price"
                  error={productInfoError.price}
                  onChange={handleChange}
                  required
                  value={productInfo.price}
                />
              </Form.Field>
              <Form.Field>
                <label>Shipping Cost</label>
                <Form.Input
                  type="number"
                  placeholder="Shipping Cost"
                  name="shippingCost"
                  error={productInfoError.shippingCost}
                  onChange={handleChange}
                  required
                  value={productInfo.shippingCost}
                />
              </Form.Field>

              <Form.Field>
                <label>Discount Rate</label>
                <Form.Input
                  type="number"
                  placeholder="Discount Rate"
                  name="discountRate"
                  error={productInfoError.discountRate}
                  onChange={handleChange}
                  required
                  value={productInfo.discountRate}
                />
              </Form.Field>
              <Form.Field>
                <label>Category</label>
                <Form.Input
                  type="number"
                  placeholder="Categroy"
                  name="category"
                  error={productInfoError.category.id}
                  onChange={handleChange}
                  required
                  value={productInfo.category.id}
                />
              </Form.Field>
              <Form.Field>
                <label>Description</label>
                <Form.Input
                  type="text"
                  placeholder="Discount Rate"
                  name="description"
                  error={productInfoError.description}
                  onChange={handleChange}
                  required
                  value={productInfo.description}
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

export default CreateProduct;
