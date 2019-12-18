import React, { Component } from 'react';
import { Button, Modal, ModalBody, InputGroup, InputGroupAddon, Container, Table, Input,Label } from 'reactstrap';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import '../index.css';
import { checkIfLogged } from '../common.js'

class UserData extends Component {

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
        this.handleCheckBox = this.handleCheckBox.bind(this);
        this.selectObject = this.selectObject.bind(this);
        this.state = { users: [], showModal: false, message: "", username: "", mail: "", password: "" }
    }

    loadDataAktivni() {
        fetch('/api/user/aktivni')
            .then(response => response.json())
            .then(data => { console.log(this.state); this.setState({ users: data }) });
    }

    loadData() {
        fetch('/api/user')
            .then(response => response.json())
            .then(data => { console.log(this.state); this.setState({ users: data }) });
    }

    componentWillMount() {
        this.loadDataAktivni();
    }

    handleCheckBox(event) {
        var checkbox = document.getElementById("checkbox_aktivni");
        if (checkbox.checked === true) {
            this.loadData();
        } else {
            this.loadDataAktivni();
        }
    }

    cleanData() {
        this.setState({ message: "", username: "", mail: "", password: "" });
    }

    toggle = field => {
        this.setState(prev => {
            return { [field]: !prev[field] };
        });
    };

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
                },
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify(dataToSend),
            }
        ).then(response => {
            if (response.status === 202) {
                this.loadData(); this.cleanData(); this.toggle('showModal');
                toast.success("Korisnik sacuvan", { position: toast.POSITION_TOP_RIGHT });
            }
            else { this.setState({ message: "Greska prilikom dodavanja korisnika" }) }
        });
    }


    selectObject(event)//da suspenduje objekat
    {
        var putanja = '/api/user/' + event.target.value;
        fetch(putanja,
            {
                method: 'DELETE',
                headers:
                {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
                credentials: 'include',
            }
        ).then(response => {
            if (response.status === 202) {
                this.loadData();
                toast.success("Korisnik suspendovan", { position: toast.POSITION_TOP_RIGHT });
            }
            else {
                toast.error("Korisnik nije suspendovan", { position: toast.POSITION_TOP_RIGHT });
            }
        });
    }



    render() {
        let users = [...this.state.users];
        return (
            <div style={{
                backgroundColor: '#001f4d', backgroundImage: ` linear-gradient(#001f4d, gray)`,
                margin: 0, height: '100vh', width: '100%', justifyContent: 'center', alignItems: 'center',
            }}><ToastContainer autoClose={3000} />
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
                                        type="text" name="username" id="username" value={this.state.username} onChange={this.handleInputChange}                                     ></Input>
                                </InputGroup>
                                <InputGroup size="sm">
                                    <InputGroupAddon addonType="prepend">
                                        Email:
                                     </InputGroupAddon>
                                    <Input
                                        type="text" name="mail" id="mail" value={this.state.mail} onChange={(event) => this.handleInputChange(event)}
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
                                <Button className="supervizorButton" onClick={this.handleSubmit}>Dodaj korisnika</Button>
                            </div>
                        </ModalBody>
                    </Modal>
                </Container>
                <h1 style={{ color: "#ffffff", marginLeft: '50px' }}>User Data</h1><br></br>
                <Button style={{ backgroundColor: "#001433", top: "10px", right: "50px", width: "250px", position: "absolute" }} onClick={this.logOut}>Log out</Button>

                <Button className="supervizorButton" style={{ marginLeft: "50px" }} onClick={() => this.toggle('showModal')}>Dodaj novog korisnika</Button>
                <Label className="label" style={{ marginLeft: "50px" }}>Prikazi sve korisnike:</Label>
                <input style={{width:"50px"}} type="checkbox" id="checkbox_aktivni" onChange={(event) => this.handleCheckBox(event)}></input><br></br><br></br>
                <Container>
                    <Table id="tabela">
                        <thead>
                            <tr><th>ID</th><th>Username</th><th>Email</th><th>Aktivan</th><th>Suspenduj</th></tr>
                        </thead>
                        <tbody>
                            {
                                users.map((user) => {
                                    return <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.username}</td>
                                        <td>{user.mail}</td>
                                        <td>{String(user.active)}</td>
                                        <td> {(() => {
                                            switch (String(user.active)) {
                                                case "true": return <Button onClick={(event) => this.selectObject(event)} value={user.username}>Suspenduj</Button>;
                                                case "false": return <Button disabled>Suspenduj</Button>;
                                                default: return <p></p>
                                            }
                                        })()}
                                        </td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </Table>
                </Container>
            </div>
        );
    };
}

export default UserData;