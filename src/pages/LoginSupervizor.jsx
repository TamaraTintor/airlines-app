import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, InputGroup, InputGroupAddon, Container, Input } from 'reactstrap';
import { checkIfLogged } from '../common.js'

class LoginSupervizor extends Component {

    handleInputChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    constructor(props) {
        super(props);

        checkIfLogged().then(resp => {
            if (resp) {
                this.props.history.push('/supervizor')
            }
        });

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);


        this.state = { username: "", password: "", message: "" };
    }

    handleSubmit() {
               fetch('/auth/loginSupervizor',
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
            ).then(response => { if (response.status === 200) { this.props.history.push('/supervizor') } else { this.setState({ message: response.status }) } });
    }

    render() {
        return (
            <div style={{
                backgroundColor: '#923cb5', backgroundImage: ` linear-gradient(#7732a8, pink)`,
                margin: 0, height: '100vh', width: '100%', justifyContent: 'center', alignItems: 'center',
            }}>
                <div class="header">Login supervizor</div>
                <Container >
                    <div>
                        <InputGroup >
                            <InputGroupAddon addonType="prepend" class="label">
                                Username:
              </InputGroupAddon>
                            <Input type="text" name="username" id="username" value={this.state.username} onChange={this.handleInputChange} placeholder="username"
                            ></Input>
                        </InputGroup>
                        <InputGroup>
                            <InputGroupAddon addonType="prepend" style={{ backgroundColor: "pink" }}>
                                Password:
              </InputGroupAddon>
                            <Input class="polje"
                                type="password" name="password" id="password" value={this.state.password}
                                onChange={(event) => this.handleInputChange(event)}>
                            </Input>
                        </InputGroup>
                        <div class="form-group">                        
                            <p style={{ color: '#923cb5' }}>{this.state.message}</p>
                        </div>
                        <br></br>
                        <Button style={{ backgroundColor: "#923cb5" }} onClick={this.handleSubmit}>Log In</Button>{'  '}
                        <Link className="btn btn-outline-danger" to="/">Cancel</Link>
                    </div>
                </Container>
            </div>
        );
    };

}

export default LoginSupervizor;