import React, { Component } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import "./Login.css";

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password: "",
      loginFailed: false
    };
  }

  validateForm() {
    return this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = event => {
    event.preventDefault()
    fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({
        'password': this.state.password
      }),
      headers: {
        'content-type': 'application/json',
      },
      credentials: 'include'
    })
    .then(res => res.json())
    .catch(error => {
      console.error('Error occured while logging in:', error);
      this.setState({loginFailed: true});
    })
    .then(data => {
      if (data.loginSuccess === true) window.location = '/portal'
      else this.setState({loginFailed: true});
    });
  }

  render() {
    return (
      <div className="Login">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <Button
            block
            bsSize="small"
            disabled={!this.validateForm()}
            type="submit"
          >
            Login
          </Button>
        {this.state.loginFailed && <p className="error-msg">Login failed</p>}
        </form>
      </div>
    );
  }
}
