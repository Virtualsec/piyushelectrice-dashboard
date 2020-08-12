import React, { Component } from "react";
import uuid from "uuid/v4";
import { Axios } from "../Constants";
import { isLoggedIn } from "../utils";
import {AddClient} from "AddClient.js"

export default class extends Component {
  constructor() {
    super();
    this.state = {
      clients: [],
    };
  }

  componentDidMount = () => {
    !isLoggedIn()
      ? this.props.history.replace("/login")
      : Axios.get("/client").then(({ data }) =>
          this.setState({ clients: data.reverse() }, () =>
            window.$("#clients").DataTable({ aaSorting: [] })
          )
        );
  };

  updateClient = (idx) => {
    const { clients } = this.state;
    localStorage.setItem("client", JSON.stringify(clients[idx]));
    this.props.history.push("/updateclient");
  };

  render = () => {
    const { clients } = this.state;
    return (
      <div className="container-fluid mt-5">
        <div class="row">
          <div class="col-md-4">
          <AddClient/>
          </div>
          <div class="col-md-8">
          {clients.length > 0 && (
          <table id="clients" className="table table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th>Mobile</th>
                <th>Date</th>
                <th className="d-none d-lg-table-cell">Address</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client, idx) => {
                const { name, mobile, date } = client;
                const { area, wing, room, building } = client.address;
                return (
                  <tr
                    key={uuid()}
                    onClick={this.updateClient.bind(this, idx)}
                    style={{ cursor: "pointer" }}
                  >
                    <td> {name} </td>
                    <td> {mobile} </td>
                    <td> {date} </td>
                    <td className="d-none d-lg-table-cell">
                      {`${wing}/${room}, ${building}, ${area}`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
          </div>
        </div>
      </div>
    );
  };
}
