

import React, { Component } from 'react';
import { Button, Modal, ModalBody, InputGroup, InputGroupAddon, Container, Table, Input } from 'reactstrap';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { checkIfLogged } from '../common.js'
import ComboAviokompanije from '../combobox/ComboAvikomanije';

//import Async from 'react-select/lib/Async';

class AdminData extends Component {

    constructor(props) {
        super(props);

        checkIfLogged().then(resp => {
            if (!resp) {
                this.props.history.push('/')
            }
        });

        this.logOut = this.logOut.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSubmitAvio = this.handleSubmitAvio.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.loadDataAktivni = this.loadDataAktivni.bind(this);
        this.loadJednu = this.loadJednu.bind(this);
        this.state = { administrators: [], showModal: false, message: "", username: "", password: "", airCompany: "", name: "", showModal1: false, selectedValue: "" }
    }

    loadDataAktivni() {
        fetch('/api/administrator/aktivni')
            .then(response => response.json())
            .then(data => { console.log(this.state); this.setState({ administrators: data }) });
    }

    loadData() {
        fetch('/api/administrator')
            .then(response => response.json())
            .then(data => { console.log(this.state); this.setState({ administrators: data }) });
    }

    componentWillMount() {
        this.loadData();
    }

    cleanData() {
        this.setState({ message: "", username: "", password: "", name: "", selectedValue: "", airCompany: "" });
    }

    toggle = field => {
        this.setState(prev => {
            return { [field]: !prev[field] };
        });
    };

    handleInputChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    loadJednu(ime) {
        fetch('/api/airCompany/' + ime)
            .then(response => response.json())
            .then(data => { console.log("Avioooo  " + ime); this.setState({ airCompany: data }) })
    }


    handleSubmit() {

        let dataToSend = {
            username: this.state.username,
            password: this.state.password,
            airCompany: this.state.airCompany
        }
        // const [data1, data2] = Promise.all(fetch);
        fetch('/api/administrator',
            {

                method: 'POST',
                headers:
                {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify(this.state),
            }
        ).then(response => {
            if (response.status === 202) {
                this.loadData(); this.cleanData(); this.toggle('showModal');
                toast.success("Administrator sacuvan", { position: toast.POSITION_TOP_RIGHT });
            }
            else {
                this.setState({ message: response.status + " Greska prilikom dodavanja administratora" })
            }
        });
    }

    handleSubmitAvio() {
        let dataToSend = {
            name: this.state.name,
        }
        fetch('/api/airCompany',
            {
                method: 'POST',
                headers:
                {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify(this.state),
            }
        ).then(response => {
            if (response.status === 202) {
                this.loadData(); this.cleanData(); this.toggle('showModal1');
                toast.success("Aviokompanija sacuvana", { position: toast.POSITION_TOP_RIGHT });
            }
            else { this.setState({ message: "Greska prilikom dodavanja aviokompanije" }) }
        });
    }

    handleCheckBox(event) {
        var checkbox = document.getElementById("checkbox_aktivni");
        if (checkbox.checked === true) {
            this.loadDataAktivni();
        } else {
            this.loadData();
        }
    }

    handleSelectChange = (selectedValue) => {

        this.setState({
            selectedValue: selectedValue
        });
        let data = {
            airCompany: this.loadJednu(selectedValue)
        }
    }

    logOut() {
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
    }

    render() {
        console.log("RENDER:")
        console.log(this.state);
        let administrators = [...this.state.administrators];
        return (
            <div style={{ backgroundColor: '#923cb5', backgroundImage: `linear-gradient(150deg, #000000 30%, #923cb5 70%)`, margin: 0, height: '100vh', width: '100%', justifyContent: 'center', alignItems: 'center', }}>
                <ToastContainer autoClose={4000} />
                <Container>
                    <Modal
                        isOpen={this.state.showModal}
                        toggle={() => this.toggle('showModal')}
                        className="bg-transparent modal-xl">
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
                                <br></br>
                                <InputGroup size="sm">
                                    <InputGroupAddon addonType="prepend">
                                        Password:
                                 </InputGroupAddon>
                                    <Input
                                        type="text" name="password" id="password" value={this.state.password} onChange={(event) => this.handleInputChange(event)}
                                    ></Input>
                                </InputGroup>
                                <br></br>
                                <ComboAviokompanije name="airCompany" id="airCompany" value={this.state.airCompany} onSelectChange={this.handleSelectChange} />  <br></br> <br></br>
                                <div>
                                    Selected value: {this.state.selectedValue}
                                </div>
                                <p style={{ color: '#923cb5' }}>{this.state.message}</p>
                                <br></br>
                                <Button style={{ backgroundColor: "#923cb5" }} onClick={this.handleSubmit}>Dodaj administratora</Button>
                            </div>
                        </ModalBody>
                    </Modal>
                </Container>

                <Container>
                    <Modal
                        isOpen={this.state.showModal1}
                        toggle={() => this.toggle('showModal1')}
                        className="bg-transparent modal-xl">
                        <ModalBody>
                            <div>
                                <InputGroup size="sm">
                                    <InputGroupAddon sm={3} addonType="prepend">
                                        Name:
                                </InputGroupAddon>
                                    <Input
                                        type="text" name="name" id="name" value={this.state.name} onChange={this.handleInputChange}
                                    ></Input>
                                </InputGroup>
                                <p style={{ color: '#923cb5' }}>{this.state.message1}</p>
                                <br></br>
                                <Button style={{ backgroundColor: "#923cb5" }} onClick={this.handleSubmitAvio}>Dodaj aviokompaniju</Button>
                            </div>
                        </ModalBody>
                    </Modal>
                </Container>
                <Container>

                    <Table>
                        <tbody>
                            <tr>
                                <td><h1 style={{ color: "#923cb5" }}>Admin data</h1></td>

                                <td><Button style={{ backgroundColor: "#42378F" }} onClick={this.logOut}>Log out</Button></td>
                            </tr>
                        </tbody>
                    </Table>
                </Container>
                <Container>
                    <Table borderless="0">
                        <tr>
                            <td><Button style={{ backgroundColor: "#923cb5" }} onClick={() => this.toggle('showModal')}>Dodaj novog adminstratora</Button></td>
                            <td><Button style={{ backgroundColor: "#923cb5" }} onClick={() => this.toggle('showModal1')}>Dodaj novu aviokompaniju</Button></td>
                            <td align="right"> <p><font color="white">Prikazi aktivne korisnike:</font></p> </td>
                            <td align="right"><input type="checkbox" id="checkbox_aktivni" onChange={(event) => this.handleCheckBox(event)}></input></td>
                        </tr>
                    </Table>
                    <Table >
                        <thead>
                            <tr><th>ID</th><th>Username</th><th>Password</th><th>IsActive</th><th>Air Company</th></tr>
                        </thead>
                        <tbody>
                            {
                                administrators.map((admin) => {
                                    return <tr key={admin.id}><td>{admin.id}</td><td>{admin.username}</td><td>{admin.password}</td>
                                        <td>{String(admin.active)}</td><td>{String(admin.airCompany.name)}</td>
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

export default AdminData