import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, InputGroup, InputGroupAddon, Container, Input } from 'reactstrap';
//import { checkIfLogged } from '../common.js'

class Login extends Component {

    handleInputChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    constructor(props) {
        super(props);

        /* checkIfLogged().then(resp => {
             if (resp) {
                 this.props.history.push('/login')
             }
         });*/

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);


        this.state = { username: "", password: "", role: "" };
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
        ).then(response => { if (response.status === 200) { this.props.history.push('/') } else { this.setState({ message: response.status }) } });
    }

    render() {
        return (


            <div style={{ backgroundColor: '#923cb5', backgroundImage:` linear-gradient(#7732a8, pink)`,
             margin: 0, height: '100vh', width: '100%', justifyContent: 'center', alignItems: 'center', }}>
                <div class="header">Login</div>
                <Container >
                    <div>
                        <InputGroup >
                            <InputGroupAddon  addonType="prepend" class="label">
                                Username:
              </InputGroupAddon>
                            <Input class="polje"
                                type="text" username="username" id="username" value={this.state.email} 
                                onChange={this.handleInputChange} onBlur={this.handleMailInputChange}>

                            </Input>
                        </InputGroup>
                        <InputGroup>
                            <InputGroupAddon addonType="prepend" style={{ backgroundColor: "pink" }}>
                                Password:
              </InputGroupAddon>
                            <Input  class="polje"
                                type="password" name="password" id="password" value={this.state.password} 
                                onChange={(event) => this.handleInputChange(event)} onBlur={this.handlePassInputChange}>
                            </Input>
                        </InputGroup>
                        <div class="form-group">
                            <label class ="label">Tip korisnika:</label>
                            <select class="form-control" id="tipKorisnika"> /*onda sa var element = document.getElementById("Mobility");
element.value = "dobije se to sto je selektovano";*/
                                <option>SUPERVIZOR</option>
                                <option>ADMINISTARTOR</option>
                                <option>KORISNIK</option>
                            
                            </select>
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

export default Login;