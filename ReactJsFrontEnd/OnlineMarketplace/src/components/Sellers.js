import React from "react";
import { toast } from "react-toastify";
import fetch from "isomorphic-unfetch";
import { Table, Menu, Container, Grid, Icon, Label } from "semantic-ui-react";
import { getCurrentUser, parseToken } from "../helpers/token";
import Navbar from "./Navbar";
import BlockSeller from "./post-confirmation/BlockSeller";

class Sellers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sellers: {},
      currentPage: 0,
    };
  }

  componentDidMount = () => {
    this.getSellers();
  };
  getSellers = () => {
    let currentUser = getCurrentUser();

    fetch(
      "http://localhost:8080/api/seller?" +
        new URLSearchParams({
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
          return Promise.reject(new Error("We have some problems!"));
        }
        return Promise.reject(new Error("We have some serious problems!"));
      })
      .then((r) => r.json())
      .then((response) => {
        this.setState({ sellers: response });
        toast.info(`${response.totalElements} fetched succesfully`);
      })
      .catch((e) => {
        toast.error(e.message);
      });
  };

  changePageTo = (i) => {
    this.setState({ currentPage: i }, this.getSellers);
  };

  render() {
    const { sellers } = this.state;
    const pageArray = [...Array(sellers.totalPages).keys()];
    return (
      <div>
        <Navbar></Navbar>
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
                    <Table.HeaderCell>Email</Table.HeaderCell>
                    <Table.HeaderCell>Address</Table.HeaderCell>
                    <Table.HeaderCell>Tax Number</Table.HeaderCell>
                    <Table.HeaderCell>Admin Username</Table.HeaderCell>
                    <Table.HeaderCell>Block</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {sellers &&
                    sellers.content &&
                    sellers.content.map((value, index) => {
                      return (
                        <Table.Row>
                          <Table.Cell>
                            <Label ribbon>
                              {sellers.size * sellers.number + (index + 1)}
                            </Label>
                          </Table.Cell>
                          <Table.Cell>{value.companyName}</Table.Cell>
                          <Table.Cell>{value.email}</Table.Cell>
                          <Table.Cell>{value.address}</Table.Cell>
                          <Table.Cell>{value.taxNumber}</Table.Cell>
                          <Table.Cell>{value.username}</Table.Cell>
                          <Table.Cell>
                            <BlockSeller
                              companyName={value.companyName}
                              getSellers={this.getSellers}
                            />
                          </Table.Cell>
                        </Table.Row>
                      );
                    })}
                </Table.Body>

                <Table.Footer>
                  <Table.Row>
                    <Table.HeaderCell colSpan="7">
                      <Menu floated="right" pagination>
                        <Menu.Item
                          onClick={() => {
                            this.changePageTo(this.state.currentPage - 1);
                          }}
                          as="a"
                          disabled={sellers.first}
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
                              active={sellers.number === value}
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
                          disabled={sellers.last}
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

export default Sellers;
