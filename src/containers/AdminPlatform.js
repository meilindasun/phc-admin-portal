import React, { Component } from "react";
import { ListGroup, ListGroupItem, Button, Grid, Row, Col, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import './AdminPlatform.css'

export default class AdminPlatform extends Component {

  constructor(props) {
    super(props)
    this.state = {services: [], newServiceName: '', serviceNameIsInvalid: false}
  }

  getFormData() {
    fetch('/api/getForm', {
      method: 'GET',
      credentials: 'include'
    })
    .then(res => res.json())
    .catch(error => console.error('Error while fetching form data: ', error))
    .then(res => {
      if (res.loginSuccess !== undefined && !res.loginSuccess) {
        window.location = '/'
      }
      else {
        this.setState({services: res.services})
      }
    })
  }

  componentDidMount() {
    this.getFormData()
  }

  handleDelete(key) {
    const serviceName = key.replace("-button", "")
    const newServices = this.state.services.filter(item => item !== serviceName)
    this.setState({services: newServices})
  }

  handleNewServiceNameSubmit() {
    const { services, newServiceName } = this.state
    if (!newServiceName.endsWith('__c')) this.setState({newServiceName: '', serviceNameIsInvalid: true})
    else {
      this.setState({serviceNameIsInvalid: false, services: [...this.state.services, newServiceName]})
    }
  }

  handleNewServiceNameChange(event) {
    this.setState({newServiceName:event.target.value})
  }

  render() {
    //console.log(services)
    if (this.state.services) {
      console.log()
      return (
        <div>
        <ListGroup>
          {this.state.services.map(s =>
            <ListGroupItem key={s}>
              <Grid>
                <Row>
                  <Col md={8} className="service-name">
                    {s}
                  </Col>
                  <Col md={4}>
                      <Button bsStyle="danger" onClick={this.handleDelete.bind(this, s + "-button")} key={s + "-button"}>Delete</Button>
                  </Col>
                </Row>
              </Grid>
            </ListGroupItem>)}
        </ListGroup>
        <h4>Add new service</h4>
        <div className="new-service">
          <form>
            <FormGroup controlId="new-service" bsSize="large">
              <ControlLabel>New service API name</ControlLabel>
              <FormControl
                type="text"
                value={this.state.newServiceName}
                onChange={this.handleNewServiceNameChange.bind(this)}
              />
            </FormGroup>
            {this.state.serviceNameIsInvalid && <p className="error-msg">Wrong!</p>}
            <Button bsStyle="success" onClick={this.handleNewServiceNameSubmit.bind(this)}>Submit</Button>
          </form>
        </div>
      </div>
      )
    }
    return <h1>Loading</h1>
  }
}
