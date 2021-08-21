import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Menu, Segment, Icon } from "semantic-ui-react";
import { getCurrentUser } from "../helpers/token";

export default class Navbar extends Component {
  state = {
    activeItem: "home",
    role: getCurrentUser().roles.includes("ROLE_ADMIN") ? true : false,
  };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;
    return (
      <Segment inverted>
        <Menu inverted secondary>
          <Menu.Item
            as={Link}
            name="home"
            active={activeItem === "home"}
            onClick={this.handleItemClick}
            to="/"
          >
            <Icon name="home" />
            Home
          </Menu.Item>
          <Menu.Item
            as={Link}
            name="products"
            active={activeItem === "products"}
            onClick={this.handleItemClick}
            to="/products"
          >
            <Icon name="table" />
            Products
          </Menu.Item>
          <Menu.Item
            as={Link}
            name="sellers"
            active={activeItem === "sellers"}
            onClick={this.handleItemClick}
            to="/sellers"
          >
            <Icon name="building" />
            Sellers
          </Menu.Item>
          {this.state.role && (
            <Menu.Item
              as={Link}
              name="users"
              active={activeItem === "users"}
              onClick={this.handleItemClick}
              to="/users"
            >
              <Icon name="user" />
              Users
            </Menu.Item>
          )}
          <Menu.Item
            as={Link}
            name="favourites"
            active={activeItem === "favourites"}
            onClick={this.handleItemClick}
            to="/favourites"
          >
            <Icon name="like" />
            Favourites
          </Menu.Item>
          <Menu.Item
            as={Link}
            name="blocked-sellers"
            active={activeItem === "blocked-sellers"}
            onClick={this.handleItemClick}
            to="/blocked-sellers"
          >
            <Icon name="fire" />
            Blocked Sellers
          </Menu.Item>
        </Menu>
      </Segment>
    );
  }
}
