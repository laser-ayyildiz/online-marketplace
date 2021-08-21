import React from "react";
import { toast } from "react-toastify";
import fetch from "isomorphic-unfetch";
import { Table, Menu, Container, Grid, Icon, Label } from "semantic-ui-react";
import { getCurrentUser, parseToken } from "../helpers/token";
import Navbar from "./Navbar";
import DeleteFavourite from "./delete-confirmation/DeleteFavourite";

class Favourites extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      favourites: {},
      currentPage: 0,
    };
  }
  componentDidMount = () => {
    this.getFavourites();
  };

  getFavourites = () => {
    let currentUser = getCurrentUser();

    fetch(
      "http://localhost:8080/api/favourite?" +
        new URLSearchParams({
          username: currentUser.username,
          pageNumber: this.state.currentPage,
          pageSize: 4,
        }),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
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
        this.setState({ favourites: response });
        toast.info(`${response.totalElements} fetched succesfully`);
      })
      .catch((e) => {
        toast.error(e.message);
      });
  };

  changePageTo = (i) => {
    this.setState({ currentPage: i }, this.getUsers);
  };

  render() {
    const { favourites } = this.state;
    const pageArray = [...Array(favourites.totalPages).keys()];
    return (
      <div>
        <Navbar />
        <Container>
          <Grid>
            <Grid.Column>
              <Table celled>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell style={{ width: "5%" }}>
                      Index
                    </Table.HeaderCell>
                    <Table.HeaderCell>Product Name</Table.HeaderCell>
                    <Table.HeaderCell>Company Name</Table.HeaderCell>
                    <Table.HeaderCell>Creation Date</Table.HeaderCell>
                    <Table.HeaderCell>Cancel</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {favourites &&
                    favourites.content &&
                    favourites.content.map((value, index) => {
                      return (
                        <Table.Row>
                          <Table.Cell>
                            <Label ribbon>
                              {favourites.size * favourites.number +
                                (index + 1)}
                            </Label>
                          </Table.Cell>
                          <Table.Cell>{value.productName}</Table.Cell>
                          <Table.Cell>{value.companyName}</Table.Cell>
                          <Table.Cell>{value.createdAt}</Table.Cell>
                          <Table.Cell>
                            <DeleteFavourite
                              companyName={value.companyName}
                              productName={value.productName}
                              getFavourites={this.getFavourites}
                            />
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
                          disabled={favourites.first}
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
                              active={favourites.number === value}
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
                          disabled={favourites.last}
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
        </Container>
      </div>
    );
  }
}

export default Favourites;
