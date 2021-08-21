import React from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import fetch from "isomorphic-unfetch";
import {
  Container,
  Button,
  Card,
  Image,
  Icon,
  Grid,
  Header,
} from "semantic-ui-react";
import { getCurrentUser } from "../../helpers/token";
import Navbar from "../Navbar";

class Product extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      seller: {},
      companyName: "",
      products: [],
    };
  }
  componentDidMount = () => {
    this.getSeller();
    this.getProducts();
  };

  getSeller = () => {
    const currentUser = getCurrentUser();
    fetch(
      "http://localhost:8080/api/seller/company?" +
        new URLSearchParams({
          name: this.props.match.params.companyName,
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
          return Promise.reject(new Error("Seller Not Found"));
        }
        if (r.status === 401 || r.status === 403) {
          return Promise.reject(new Error("You can't do this"));
        }
        return Promise.reject(new Error("Something went wrong!"));
      })
      .then((r) => r.json())
      .then((response) => {
        this.setState({ seller: response });
      })
      .catch((e) => {
        toast.error(e.message);
      });
  };

  getProducts = () => {
    const currentUser = getCurrentUser();
    fetch(
      "http://localhost:8080/api/seller/products?" +
        new URLSearchParams({
          name: this.props.match.params.companyName,
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
          return Promise.reject(new Error("Seller Not Found"));
        }
        if (r.status === 401 || r.status === 403) {
          return Promise.reject(new Error("You can't do this"));
        }
        return Promise.reject(new Error("Something went wrong!"));
      })
      .then((r) => r.json())
      .then((response) => {
        console.log(response);
        this.setState({ products: response });
      })
      .catch((e) => {
        toast.error(e.message);
      });
  };

  render() {
    const { seller } = this.state;
    const { products } = this.state;
    return (
      <div>
        <Navbar />
        <Container>
          <Grid columns="equal">
            <Grid.Column />
            <Grid.Column>
              <Card size="xl">
                <Image src="/images/sellers.png" wrapped ui={false} />
                <Card.Content>
                  <Card.Header>{seller.companyName}</Card.Header>
                  <Card.Meta>
                    <span>{seller.username}</span>
                  </Card.Meta>
                  <Card.Description>{seller.address}</Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <a href={"mailto:" + seller.email}>
                    <Icon name="mail" />
                    {seller.email}
                  </a>
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column />
          </Grid>
          <Header size="large">Products</Header>
          <Card.Group itemsPerRow={4} style={{ marginTop: "2rem" }}>
            {products &&
              products.map((value, index) => {
                return (
                  <Card>
                    <Image
                      src={value.picturePath && "/images/products.png"}
                      wrapped
                      ui={false}
                    />
                    <Card.Content>
                      <Card.Header>{value.name}</Card.Header>
                      <Card.Meta>{value.sellerName}</Card.Meta>
                      <Card.Description>{value.description}</Card.Description>
                    </Card.Content>
                    <Card.Content>
                      <Icon name="dollar" />
                      <b>{value.price}</b>
                    </Card.Content>
                    <Button
                      as={Link}
                      color="blue"
                      size="small"
                      to={
                        "/product/" +
                        value.name +
                        "/company/" +
                        value.sellerName
                      }
                    >
                      See Discount
                    </Button>
                  </Card>
                );
              })}
          </Card.Group>
        </Container>
      </div>
    );
  }
}

export default Product;
