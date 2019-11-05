import React, { Component } from 'react';
import { Button, Modal, ModalBody, InputGroup, InputGroupAddon, Container, Table, Input } from 'reactstrap';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

class SupervizorHome extends Component {

    constructor(props) {
        super(props);

    /*    checkIfLogged().then(resp => {
            if (!resp) {
                this.props.history.push('/')
            }
        });*/

      //  this.logOut = this.logOut.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);


        this.state = { users: [], showModal: false, message: "", username: "", mail: "", password:"" }

    }

    loadData() {
        fetch('/api/user')
            .then(response => response.json())
            .then(data => this.setState({ users: data }));
    }

    componentWillMount() {
        this.loadData();
    }

    cleanData() {
        this.setState({ message: "", username: "", mail: "", password:""});
    }

    toggle = field => {
        this.setState(prev => {
            return { [field]: !prev[field] };
        });
    };

  /*  logOut() {
        fetch('/auth/logout',
            {
                method: 'GET',
                mode: 'cors',
                headers:
                {
                    credentials: 'include'
                },
            }
        ).catch(() => this.props.history.push('/'));
    }*/



    handleInputChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }


    handleSubmit(event) {
        let dataToSend = {
            username: this.state.username,
            password: this.state.password,
            mail: this.state.mail
     }

        fetch('/api/user',
            {
                method: 'POST',
                headers:
                {

                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                   // credentials: 'include'
                },
                mode:'cors',
                credentials:'include',
                body: JSON.stringify(dataToSend),
            }
        ).then(response => { if (response.status === 200) { this.loadData(); this.cleanData(); this.toggle('showModal'); toast.success("Korisnik sacuvan", { position: toast.POSITION_TOP_RIGHT }); } else { this.setState({ message: response.status }) } });
    }

    render() {
        console.log("RENDER:")
        console.log(this.state);
        let users = [...this.state.users];
        return (
            <div style={{ backgroundColor: '#923cb5', backgroundImage: `linear-gradient(150deg, #000000 30%, #923cb5 70%)`, margin: 0, height: '100vh', width: '100%', justifyContent: 'center', alignItems: 'center', }}>
                <ToastContainer autoClose={5000} />
                <Container>
                    <Modal
                        isOpen={this.state.showModal}
                        toggle={() => this.toggle('showModal')}
                        className="bg-transparent modal-xl"

                    >
                        <ModalBody>
                            <div>
                                <InputGroup size="sm">
                                    <InputGroupAddon sm={3} addonType="prepend">
                                        Username:
                                    </InputGroupAddon>
                                    <Input
                                        type="text" name="username" id="username" value={this.state.username} onChange={this.handleInputChange}
                                    ></Input>
                                </InputGroup>
                                <InputGroup size="sm">
                                    <InputGroupAddon addonType="prepend">
                                        Email:
                                     </InputGroupAddon>
                                    <Input
                                        type="text" name="mail" id="mail" value={this.state.mail} onChange={(event) => this.handleInputChange(event)}
                                    ></Input>
                                     <InputGroupAddon addonType="prepend">
                                        Password:
                                     </InputGroupAddon>
                                    <Input
                                        type="text" name="password" id="password" value={this.state.password} onChange={(event) => this.handleInputChange(event)}
                                    ></Input>
                                </InputGroup>
                                <p style={{ color: '#923cb5' }}>{this.state.message}</p>
                                <br></br>
                                <Button style={{ backgroundColor: "#923cb5" }} onClick={this.handleSubmit}>Dodaj korisnika</Button>
                            </div>
                        </ModalBody>
                    </Modal>
                </Container>
                <Container>
                    <Table>
                        <tbody>
                            <tr>
                                <td><h1 style={{ color: "#923cb5" }}>Users Page</h1></td>
                            </tr>
                        </tbody>
                    </Table>
                </Container>
                <Container>
                    <Button style={{ backgroundColor: "#923cb5" }} onClick={() => this.toggle('showModal')}>Dodaj novog korisnika</Button>
                    <Table >
                        <thead>
                            <tr><th>ID</th><th>Username</th><th>Email</th><th>Password</th><th>IsActive</th></tr>
                        </thead>
                        <tbody>
                            {
                                users.map((user) => {
                                    return <tr key={user.id}><td>{user.id}</td><td>{user.username}</td><td>{user.mail}</td><td>{user.password}</td><td>{JSON.stringify(user.isActive)}</td></tr>
                                })
                            }
                        </tbody>
                    </Table>
                </Container>
            </div>
        );
    };

}

export default SupervizorHome