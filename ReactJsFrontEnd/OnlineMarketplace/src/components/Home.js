import React, { useState, useEffect } from "react";
import "semantic-ui-css/semantic.min.css";
import Navbar from "./Navbar";

import { Container, Header, Item, Card, Image, Icon } from "semantic-ui-react";
import { toast } from "react-toastify";
import { getCurrentUser, parseToken } from "../helpers/token";

const Home = () => {
  const [data, setData] = useState({
    categoryCount: 0,
    productCount: 0,
    sellerCount: 0,
    userCount: 0,
  });

  useEffect(() => {
    getStatistics();
  }, []);

  let currentUser = getCurrentUser();

  const getStatistics = () => {
    fetch("http://localhost:8080/api/statistic", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.token}`,
      },
    })
      .then((r) => {
        if (r.ok) return r;

        if (r.status === 400 || r.status === 500) {
          return Promise.reject(new Error("We have some problems!"));
        }
        return Promise.reject(new Error("We have some serious problems!"));
      })
      .then((r) => r.json())
      .then((response) => {
        setData(response);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };
  return (
    <div>
      <Navbar />
      <Container>
        <Header as="h1">Welcome {currentUser.username}!</Header>
        <Header as="h2">Some Statistics Here!</Header>
        <Card.Group itemsPerRow={4}>
          <Card>
            <Image src="/images/users.png" wrapped ui={false} />
            <Card.Content>
              <Card.Header>Total Users</Card.Header>
              <Card.Description>
                <Header as="h3">{data.userCount}</Header>
              </Card.Description>
            </Card.Content>
          </Card>
          <Card>
            <Image src="/images/sellers.png" wrapped ui={false} />
            <Card.Content>
              <Card.Header>Total Sellers</Card.Header>
              <Card.Description>
                <Header as="h3">{data.sellerCount}</Header>
              </Card.Description>
            </Card.Content>
          </Card>
          <Card>
            <Image src="/images/products.png" wrapped ui={false} />
            <Card.Content>
              <Card.Header>Total Products</Card.Header>
              <Card.Description>
                <Header as="h3">{data.productCount}</Header>
              </Card.Description>
            </Card.Content>
          </Card>
          <Card>
            <Image src="/images/categories.png" wrapped ui={false} />
            <Card.Content>
              <Card.Header>Total Categories</Card.Header>
              <Card.Description>
                <Header as="h3">{data.categoryCount}</Header>
              </Card.Description>
            </Card.Content>
          </Card>
        </Card.Group>
      </Container>
    </div>
  );
};
export default Home;
