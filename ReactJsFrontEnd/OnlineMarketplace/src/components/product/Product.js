import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import fetch from "isomorphic-unfetch";
import {
  Container,
  Form,
  Card,
  Image,
  Icon,
  Grid,
  GridColumn,
} from "semantic-ui-react";
import { getCurrentUser } from "../../helpers/token";
import Navbar from "../Navbar";

class Product extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product: {},
      productName: "",
      companyName: "",
    };
  }
  componentDidMount = () => {
    this.getProduct();
  };

  getProduct = () => {
    const currentUser = getCurrentUser();
    fetch(
      "http://localhost:8080/api/product/find?" +
        new URLSearchParams({
          productName: this.props.match.params.productName,
          companyName: this.props.match.params.companyName,
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
        this.setState({ product: response });
      })
      .catch((e) => {
        toast.error(e.message);
      });
  };

  render() {
    const { product } = this.state;
    return (
      <div>
        <Navbar />
        <Container>
          <Grid columns="equal">
            <Grid.Column />
            <Grid.Column>
              <Card size="xl">
                <Image src="/images/products.png" wrapped ui={false} />
                <Card.Content>
                  <Card.Header>{product.name}</Card.Header>
                  <Card.Meta>
                    <span>{product.sellerName}</span>
                  </Card.Meta>
                  <Card.Description>{product.description}</Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <a>
                    <Icon name="dollar" />
                    <b>
                      {product.price -
                        (product.price *
                          (product.discountRate ? product.discountRate : 0)) /
                          100}
                    </b>
                  </a>
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column />
          </Grid>
        </Container>
      </div>
    );
  }
}

export default Product;
