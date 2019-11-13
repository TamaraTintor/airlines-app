

import React, { Component } from 'react';
import { Button, Modal, ModalBody, InputGroup, InputGroupAddon, Container, Table, Input } from 'reactstrap';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { checkIfLogged } from '../common.js'
class AdminHome extends Component {

    constructor(props) {
        super(props);

        /*   checkIfLogged().then(resp => {
               if (!resp) {
                   this.props.history.push('/')
               }
           });
   */
        // this.logOut = this.logOut.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);


        this.state = {
            administrators: [], showModal: false,message: "",
            username: "",  password: "",active: "", air_company: ""
        }


    }

    loadData() {
        fetch('/api/administrator')
            .then(response => response.json())
            .then(data =>{console.log(this.state); this.setState({ administrators: data })});
    }

    componentWillMount() {
        this.loadData();
    }

    cleanData() {
        this.setState({
            message: "",
            username: "", password: ""//, isActive: "", air_company: ""
        });
    }
    toggle = field => {
        this.setState(prev => {
            return { [field]: !prev[field] };
        });
    };


    handleInputChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit() {
        let dataToSend = {
            username: this.state.username,
            password: this.state.password,
           // isActive: this.state.isActive,

        }
        fetch('/api/administrator',
            {
                method: 'POST',
                headers:
                {

                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                 //   credentials: 'include'
                },
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify(this.state),
            }
        ).then(response => { if (response.status === 200) { this.props.history.push('/') } else { this.setState({ message: "Invalid credentials" }) } });
    }




    render() {
        console.log("RENDER:")
        console.log(this.state);
        let administrators = [...this.state.administrators];
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
                                        Password:
                                 </InputGroupAddon>
                                    <Input
                                        type="text" name="password" id="password" value={this.state.password} onChange={(event) => this.handleInputChange(event)}
                                    ></Input>
                                </InputGroup>
                                <p style={{ color: '#923cb5' }}>{this.state.message}</p>
                                <br></br>
                                <Button style={{ backgroundColor: "#923cb5" }} onClick={this.handleSubmit}>Dodaj administratora</Button>
                            </div>
                        </ModalBody>
                    </Modal>
                </Container>
                <Container>
                    <Table>
                        <tbody>
                            <tr>
                                <td><h1 style={{ color: "#923cb5" }}>Admin Page</h1></td>
                            </tr>
                        </tbody>
                    </Table>
                </Container>
                <Container>
                    <Button style={{ backgroundColor: "#923cb5" }} onClick={() => this.toggle('showModal')}>Dodaj novog administratora</Button>
                    <Table >
                        <thead>
                            <tr><th>ID</th><th>Username</th><th>Password</th><th>IsActive</th><th>Air Company</th></tr>
                        </thead>
                        <tbody>
                            {
                                administrators.map((admin) => {
                                    return <tr key={admin.id}><td>{admin.id}</td><td>{admin.username}</td><td>{admin.password}</td>
                                       
                                       </tr>//onclick="show1()"
                                })
                            }
                        </tbody>
                    </Table>
                </Container>
            </div>
        );
    };


}

export default AdminHome