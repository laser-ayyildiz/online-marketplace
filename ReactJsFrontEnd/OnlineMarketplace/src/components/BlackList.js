import React from "react";
import { toast } from "react-toastify";
import fetch from "isomorphic-unfetch";
import { Table, Menu, Container, Grid, Icon, Label } from "semantic-ui-react";
import { getCurrentUser } from "../helpers/token";
import Navbar from "./Navbar";
import DeleteBlockedSeller from "./delete-confirmation/DeleteBlockedSeller";

class BlackList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      blocked_sellers: {},
      currentPage: 0,
    };
  }
  componentDidMount = () => {
    this.getBlockedSellers();
  };

  getBlockedSellers = () => {
    let currentUser = getCurrentUser();

    fetch(
      "http://localhost:8080/api/blacklist/user?" +
        new URLSearchParams({
          username: currentUser.username,
          pageNumber: this.state.currentPage,
          pageSize: 5,
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
        this.setState({ blocked_sellers: response });
        toast.info(`${response.totalElements} fetched succesfully`);
      })
      .catch((e) => {
        toast.error(e.message);
      });
  };

  changePageTo = (i) => {
    this.setState({ currentPage: i }, this.getBlockedSellers);
  };

  render() {
    const { blocked_sellers } = this.state;
    const pageArray = [...Array(blocked_sellers.totalPages).keys()];
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
                    <Table.HeaderCell>Company Name</Table.HeaderCell>
                    <Table.HeaderCell>Seller Email</Table.HeaderCell>
                    <Table.HeaderCell>Creation Date</Table.HeaderCell>
                    <Table.HeaderCell>Delete</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {blocked_sellers &&
                    blocked_sellers.content &&
                    blocked_sellers.content.map((value, index) => {
                      return (
                        <Table.Row>
                          <Table.Cell>
                            <Label ribbon>
                              {blocked_sellers.size * blocked_sellers.number +
                                (index + 1)}
                            </Label>
                          </Table.Cell>
                          <Table.Cell>{value.companyName}</Table.Cell>
                          <Table.Cell>{value.sellerEmail}</Table.Cell>
                          <Table.Cell>{value.createdAt}</Table.Cell>
                          <Table.Cell>
                            <DeleteBlockedSeller
                              companyName={value.companyName}
                              getBlockedSellers={this.getBlockedSellers}
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
                          disabled={blocked_sellers.first}
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
                              active={blocked_sellers.number === value}
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
                          disabled={blocked_sellers.last}
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

export default BlackList;
