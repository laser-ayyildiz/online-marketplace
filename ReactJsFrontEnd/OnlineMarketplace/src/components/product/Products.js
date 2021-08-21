import React from "react";
import { toast } from "react-toastify";
import fetch from "isomorphic-unfetch";
import { Link } from "react-router-dom";
import {
  Table,
  Menu,
  Container,
  Grid,
  Icon,
  Label,
  Button,
  Card,
  Image,
} from "semantic-ui-react";
import { getCurrentUser } from "../../helpers/token";
import Navbar from "../Navbar";
import FindProduct from "./FindProduct";
import CreateProduct from "./CreateProduct";

class Products extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: {},
      currentPage: 0,
      searchedProducts: {},
    };
  }
  componentDidMount = () => {
    this.getproducts();
  };

  getproducts = () => {
    const currentUser = window.localStorage.getItem("currentUser");
    fetch(
      "http://localhost:8080/api/product?" +
        new URLSearchParams({
          pageNumber: this.state.currentPage,
          pageSize: 4,
        }),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(currentUser).token}`,
        },
        credentials: "include",
      }
    )
      .then((r) => {
        if (r.ok) {
          return r;
        }
        if (r.status === 401 || r.status === 403 || r.status === 500) {
          return Promise.reject(new Error("Bir hata oluştu"));
        }
        return Promise.reject(new Error("Bilinmeyen bir hata oluştu."));
      })
      .then((r) => r.json())
      .then((response) => {
        this.setState({ products: response });
        toast.info(`${response.totalElements} fetched succesfully`);
      })
      .catch((e) => {
        toast.error(e.message);
      });
  };

  getSearchElements = (response) => {
    this.setState({ searchedProducts: response });
  };

  addToFavourite = (companyName, productName) => {
    let currentUser = getCurrentUser();

    fetch("http://localhost:8080/api/favourite/strings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.token}`,
      },
      credentials: "include",
      body: JSON.stringify({
        username: currentUser.username,
        companyName: companyName,
        productName: productName,
      }),
    })
      .then((r) => {
        if (r.ok) {
          return r;
        }
        if (r.status === 400) {
          return Promise.reject(new Error("You favourite this product before"));
        }
        if (r.status === 401 || r.status === 403) {
          return Promise.reject(new Error("You dont have this righs"));
        }
        return Promise.reject(new Error("Something went wrong"));
      })
      .then((r) => r.json())
      .then((response) => {
        toast.info(`${response ? "Immm like it!" : "Something went wrong"} `);
      })
      .catch((e) => {
        e.message === "You favourite this product before"
          ? toast.warning(e.message)
          : toast.error(e.message);
      });
  };

  goToProduct = (productName, companyName, event) => {
    if (event.target.tagName !== "I") {
      this.props.history.push(`/product/${productName}/company/${companyName}`);
    }
  };

  changePageTo = (i) => {
    this.setState({ currentPage: i }, this.getproducts);
  };

  render() {
    const { products } = this.state;
    const { searchedProducts } = this.state;
    const pageArray = [...Array(products.totalPages).keys()];
    return (
      <div>
        <Navbar />
        <Container>
          <Grid>
            <Grid.Column>
              <CreateProduct />
              <FindProduct
                align="right"
                getSearchElements={this.getSearchElements}
              />
              <Table celled>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell style={{ width: "5%" }}>
                      Index
                    </Table.HeaderCell>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Price</Table.HeaderCell>
                    <Table.HeaderCell>Description</Table.HeaderCell>
                    <Table.HeaderCell>Category</Table.HeaderCell>
                    <Table.HeaderCell>Seller</Table.HeaderCell>
                    <Table.HeaderCell>Like it</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {products &&
                    products.content &&
                    products.content.map((value, index) => {
                      return (
                        <Table.Row
                          style={{ cursor: "pointer" }}
                          onClick={(event) =>
                            this.goToProduct(
                              value.name,
                              value.sellerName,
                              event
                            )
                          }
                        >
                          <Table.Cell>
                            <Label ribbon>
                              {products.size * products.number + (index + 1)}
                            </Label>
                          </Table.Cell>
                          <Table.Cell>{value.name}</Table.Cell>
                          <Table.Cell>{value.price} TL</Table.Cell>
                          <Table.Cell>{value.description}</Table.Cell>
                          <Table.Cell>{value.category}</Table.Cell>
                          <Table.Cell>{value.sellerName}</Table.Cell>
                          <Table.Cell>
                            <Icon
                              style={{ cursor: "pointer" }}
                              button={Button}
                              onClick={() =>
                                this.addToFavourite(
                                  value.sellerName,
                                  value.name
                                )
                              }
                              name="like"
                            ></Icon>
                          </Table.Cell>
                        </Table.Row>
                      );
                    })}
                </Table.Body>

                <Table.Footer>
                  <Table.Row>
                    <Table.HeaderCell colSpan="8">
                      <Menu floated="right" pagination>
                        <Menu.Item
                          onClick={() => {
                            this.changePageTo(this.state.currentPage - 1);
                          }}
                          as="a"
                          disabled={products.first}
                          icon
                        >
                          <Icon name="chevron left" />
                        </Menu.Item>
                        {pageArray.map((value, index) => {
                          return (
                            <Menu.Item
                              onClick={() => {
                                this.changePageTo(index);
                              }}
                              active={products.number === value}
                              as="a"
                            >
                              {value + 1}
                            </Menu.Item>
                          );
                        })}
                        <Menu.Item
                          onClick={() => {
                            this.changePageTo(this.state.currentPage + 1);
                          }}
                          as="a"
                          disabled={products.last}
                          icon
                        >
                          <Icon name="chevron right" />
                        </Menu.Item>
                      </Menu>
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Footer>
              </Table>
            </Grid.Column>
          </Grid>
          <Card.Group itemsPerRow={4} style={{ marginTop: "2rem" }}>
            {searchedProducts &&
              searchedProducts.content &&
              searchedProducts.content.map((value, index) => {
                return (
                  <Card>
                    <Image src={value.picturePath} wrapped ui={false} />
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

export default Products;
