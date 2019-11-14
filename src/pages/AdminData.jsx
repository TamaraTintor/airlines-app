

import React, { Component } from 'react';
import { Button, Modal, ModalBody, InputGroup, InputGroupAddon, Container, Table, Input } from 'reactstrap';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { checkIfLogged } from '../common.js'
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
        this.handleInputChange = this.handleInputChange.bind(this);
        this.loadDataAktivni = this.loadDataAktivni.bind(this);
        this.state = { administrators: [], showModal: false, message: "", username: "", active: "", password: "", airCompany: [] }



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

        this.setState({ message: "", username: "", active: "", password: "" });

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

    handleCheckBox(event) {
        var checkbox = document.getElementById("checkbox_aktivni");
        if (checkbox.checked === true) {
            this.loadDataAktivni();
        } else {
            this.loadData();
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
                                


                                <div class="btn-group">
  <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    Choose air company
  </button>
  <div class="dropdown-menu dropdown-menu-right">

  {
                                            administrators.map((admin) => {
                                                return <div class="input-group mb-3"><select className="form-control"  onChange={(event) => this.handleInputChange(event)}><option >{String(admin.airCompany.name)}</option> </select>
                                       <button class="dropdown-item" type="button">{String(admin.airCompany.name)}</button></div>
                                            })
                                        }
 
</div>
</div>

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
                                <td><h1 style={{ color: "#923cb5" }}>Admin data</h1></td>

                                <td><Button style={{ backgroundColor: "#42378F" }} onClick={this.logOut}>Log out</Button></td>
                            </tr>
                        </tbody>
                    </Table>
                </Container>
                <Container>
                    <Table borderless="0">
                        <tr><td><Button style={{ backgroundColor: "#923cb5" }} onClick={() => this.toggle('showModal')}>Dodaj novog adminstratora</Button></td>

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