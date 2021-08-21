import React, { Component } from "react";
import { toast } from "react-toastify";
import fetch from "isomorphic-unfetch";
import { getCurrentUser, parseToken } from "../../helpers/token";

import { Button, Confirm } from "semantic-ui-react";

class BlockSeller extends Component {
  state = { open: false };

  show = () => this.setState({ open: true });
  handleConfirm = () => {
    this.setState({ open: false });
    let currentUser = getCurrentUser();

    fetch("http://localhost:8080/api/blacklist/strings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.token}`,
      },
      credentials: "include",
      body: JSON.stringify({
        username: currentUser.username,
        companyName: this.props.companyName,
      }),
    })
      .then((r) => {
        if (r.ok) {
          return r;
        }
        if (r.status === 400) {
          return Promise.reject(new Error("You blocked this seller before"));
        }
        if (r.status === 401 || r.status === 403 || r.status === 500) {
          return Promise.reject(new Error("Bir hata oluştu"));
        }
        return Promise.reject(new Error("Bilinmeyen bir hata oluştu."));
      })
      .then((r) => r.json())
      .then((response) => {
        toast.info(`${response ? "Deleted" : "Something went wrong"} `);
        this.props.getSellers();
      })
      .catch((e) => {
        toast.error(e.message);
      });
  };

  handleCancel = () => this.setState({ open: false });

  render() {
    return (
      <div>
        <Button color="red" onClick={this.show}>
          Block
        </Button>
        <Confirm
          open={this.state.open}
          cancelButton="Never mind"
          confirmButton="Let's do it"
          onCancel={this.handleCancel}
          onConfirm={this.handleConfirm}
        />
      </div>
    );
  }
}

export default BlockSeller;
