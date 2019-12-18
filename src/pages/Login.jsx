import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, InputGroup, InputGroupAddon, Container, Input, Label } from 'reactstrap';
import { checkIfLogged } from '../common.js'

class Login extends Component {

    handleInputChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    constructor(props) {
        super(props);

        checkIfLogged().then(resp => {
            if (resp) {
                this.props.history.push('/')
            }
        });

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = { username: "", password: "", message: "" };
    }

    loadSupervisorPage() {
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
        ).then(response => { if (response.status === 200) { this.props.history.push('/supervizor') } else { this.setState({ message: "Nisu ispravni username i password." }) } });
    }


    loadAdminPage() {
        fetch('/auth/loginAdmin',
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
        ).then(response => {
            if (response.status === 200) {
                this.props.history.push('/admin')
            } else {
                this.setState({ message: "Invalid credentials" })
            }
        });
    }
    loadUserPage() {
        fetch('/auth/loginUser',
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
        ).then(response => { if (response.status === 200) { this.props.history.push('/user') } else { this.setState({ message: "Invalid credentials" }) } });
    }


    handleSubmit() {
        var element = document.getElementById("tipKorisnika");
        localStorage.setItem('data', element.value);

        console.log(this, this.state);
        if (element.value === 'SUPERVIZOR') {
            this.loadSupervisorPage();
        } else if (element.value === 'ADMINISTARTOR') {
            this.loadAdminPage();
        } else {
            localStorage.setItem('user', this.state.username);
            this.loadUserPage();
        }
    }

    render() {
        return (
            <div style={{
                backgroundColor: '#923cb5', backgroundImage: ` linear-gradient(#7732a8, pink)`,
                margin: 0, height: '100vh', width: '100%', justifyContent: 'center', alignItems: 'center',
            }}>
                <div class="header">Login </div>
                <Container >
                    <div id="parent">
                        <form id="form_login">
                            <Label>Username: </Label>
                            <Input className="inputGroup" type="text" name="username" id="username" value={this.state.username} onChange={this.handleInputChange}></Input>
                            <Label>Password: </Label> 
                            <Input className="inputGroup" type="password" name="password" id="password" value={this.state.password} onChange={(event) => this.handleInputChange(event)}></Input>
                            <Label color="white">Tip korisnika:</Label>
                            <select className="combo" id="tipKorisnika">
                                <option>SUPERVIZOR</option>
                                <option>ADMINISTARTOR</option>
                                <option>KORISNIK</option>
                            </select>
                            <p style={{ color: '#923cb5' }}>{this.state.message}</p>
                            <br></br>
                            <Button style={{ backgroundColor: "#923cb5" }} onClick={this.handleSubmit}>Log In</Button>{'  '}
                            <Link className="btn btn-outline-danger" to="/">Cancel</Link>

                        </form>

                    </div>
                </Container>
            </div>
        );
    };

}

export default Login;