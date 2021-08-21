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
  Card,
  Image,
  Button,
} from "semantic-ui-react";
import { getCurrentUser } from "../../helpers/token";
import Navbar from "../Navbar";
import BlockSeller from "../post-confirmation/BlockSeller";
import FindSeller from "./FindSeller";

class Sellers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sellers: {},
      currentPage: 0,
      searchedSellers: {},
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

  getSearchElements = (response) => {
    this.setState({ searchedSellers: response });
  };

  changePageTo = (i) => {
    this.setState({ currentPage: i }, this.getSellers);
  };

  goToSeller = (name, event) => {
    if (event.target.tagName !== "BUTTON") {
      this.props.history.push(`/seller/${name}`);
    }
  };

  render() {
    const { sellers } = this.state;
    const { searchedSellers } = this.state;
    const pageArray = [...Array(sellers.totalPages).keys()];
    return (
      <div>
        <Navbar></Navbar>
        <Container>
          <Grid>
            <Grid.Column>
              <FindSeller
                align="right"
                getSearchElements={this.getSearchElements}
              />
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
                        <Table.Row
                          onClick={(event) =>
                            this.goToSeller(value.companyName, event)
                          }
                        >
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
          <Card.Group itemsPerRow={4} style={{ marginTop: "2rem" }}>
            {searchedSellers &&
              searchedSellers.content &&
              searchedSellers.content.map((value, index) => {
                return (
                  <Card>
                    <Image src="/images/sellers.png" wrapped ui={false} />
                    <Card.Content>
                      <Card.Header>{value.companyName}</Card.Header>
                      <Card.Meta>{value.username}</Card.Meta>
                      <Card.Description>{value.address}</Card.Description>
                    </Card.Content>
                    <Card.Content>
                      <Icon name="mail" />
                      <b>{value.email}</b>
                    </Card.Content>
                    <Button
                      as={Link}
                      color="blue"
                      size="small"
                      to={"/seller/" + value.companyName}
                    >
                      Go to page
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

export default Sellers;
