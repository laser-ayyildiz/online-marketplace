import React from "react";
import { toast } from "react-toastify";
import fetch from "isomorphic-unfetch";
import {
  Table,
  Menu,
  Container,
  Grid,
  Icon,
  Label,
  Search,
} from "semantic-ui-react";
import { getCurrentUser } from "../../helpers/token";
import Navbar from "../Navbar";
import CreateAdmin from "./CreateAdmin";
import FindUser from "./FindUser";

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: {},
      currentPage: 0,
    };
  }
  componentDidMount = () => {
    this.getUsers();
  };

  getUsers = () => {
    let currentUser = getCurrentUser();

    fetch(
      "http://localhost:8080/api/user/all?" +
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
        if (r.status === 400) {
          return Promise.reject(new Error("You favourite this product before"));
        }
        if (r.status === 401 || r.status === 403) {
          return Promise.reject(new Error("You don't have this righs"));
        }
        return Promise.reject(new Error("Something went wrong"));
      })
      .then((r) => r.json())
      .then((response) => {
        this.setState({ users: response });
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
    const { users } = this.state;
    const pageArray = [...Array(users.totalPages).keys()];
    return (
      <div>
        <Navbar />
        <Container>
          <Grid>
            <Grid.Column>
              <CreateAdmin />
              <FindUser align="right" />
              <Table celled>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell style={{ width: "5%" }}>
                      Index
                    </Table.HeaderCell>
                    <Table.HeaderCell>Username</Table.HeaderCell>
                    <Table.HeaderCell>Email</Table.HeaderCell>
                    <Table.HeaderCell>Address</Table.HeaderCell>
                    <Table.HeaderCell>City</Table.HeaderCell>
                    <Table.HeaderCell>State</Table.HeaderCell>
                    <Table.HeaderCell>Creation Date</Table.HeaderCell>
                    <Table.HeaderCell>Last Update Date</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {users &&
                    users.content &&
                    users.content.map((value, index) => {
                      return (
                        <Table.Row>
                          <Table.Cell>
                            <Label ribbon>
                              {users.size * users.number + (index + 1)}
                            </Label>
                          </Table.Cell>
                          <Table.Cell>{value.username}</Table.Cell>
                          <Table.Cell>{value.email}</Table.Cell>
                          <Table.Cell>{value.address}</Table.Cell>
                          <Table.Cell>{value.city}</Table.Cell>
                          <Table.Cell>{value.state}</Table.Cell>
                          <Table.Cell>{value.createdAt}</Table.Cell>
                          <Table.Cell>{value.updatedAt}</Table.Cell>
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
                          disabled={users.first}
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
                              active={users.number === value}
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
                          disabled={users.last}
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

export default Users;
