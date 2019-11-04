import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, InputGroup, InputGroupAddon, Container, Input } from 'reactstrap';
import { checkIfLogged } from '../common.js'

class Login extends Component {

    handleInputChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    constructor(props) {
        super(props);

        checkIfLogged().then(resp => {
            if (resp) {
                this.props.history.push('/login')
            }
        });

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);


        this.state = { username: "", password: "", message: "" };
    }

    handleSubmit() {
        fetch('/api/login',
            {
                method: 'POST',
                headers:
                {

                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    credentials: 'include'
                },
                body: JSON.stringify(this.state),
            }
        ).then(response => { if (response.status === 200) { this.props.history.push('/') } else { this.setState({ message: "Neispravni podaci." }) } });
    }

    render() {
        return (
            <div style={{ backgroundColor: '#923cb5', backgroundImage: `linear-gradient(150deg, #000000 0%, #923cb5 70%)`, margin: 0, height: '100vh', width: '100%', justifyContent: 'center', alignItems: 'center', }}>
                <h1 style={{ color: "#923cb5" }}>Login page</h1>
                <Container >
                    <div>
                        <InputGroup size="sm">
                            <InputGroupAddon sm={3} addonType="prepend" className=" bg-dark">
                                Username:
              </InputGroupAddon>
                            <Input style={{ backgroundColor: '#923cb5', backgroundImage: `linear-gradient(50deg, #923cb5 0%, #000000 5%)`, color: "#923cb5" }}
                                type="text" username="username" id="username" value={this.state.email} onChange={this.handleInputChange} onBlur={this.handleMailInputChange}>

                            </Input>
                        </InputGroup>
                        <InputGroup size="sm">
                            <InputGroupAddon addonType="prepend" style={{ backgroundColor: "#923cb5" }}>
                                Password:
              </InputGroupAddon>
                            <Input className="bg-dark text-success" style={{ backgroundColor: '#923cb5', backgroundImage: `linear-gradient(50deg, #000000 0%, #923cb5 99%)` }}
                                type="password" name="password" id="password" value={this.state.password} onChange={(event) => this.handleInputChange(event)} onBlur={this.handlePassInputChange}>
                            </Input>
                        </InputGroup>
                        <p style={{ color: '#923cb5' }}>{this.state.message}</p>
                        <br></br>
                        <Button style={{ backgroundColor: "#923cb5" }} onClick={this.handleSubmit}>Log In</Button>{'  '}
                        <Link className="btn btn-outline-danger" to="/">Cancel</Link>
                    </div>
                </Container>
            </div>
        );
    };

}

export default Login;