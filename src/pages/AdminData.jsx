import React, { Component } from 'react';
import { Button, Modal, ModalBody, InputGroup, InputGroupAddon, Container, Table, Input, Label } from 'reactstrap';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { checkIfLogged } from '../common.js'
import ComboAviokompanije from '../combobox/ComboAvikomanije';

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
        this.handleIzmjena = this.handleIzmjena.bind(this);
        this.state = { administrators: [], showModal: false, message: "", username: "", passwordIzmjena: "", password: "", airCompany: "", name: "", showModal1: false, selectedValue: "", showModalIzmjena: false }
    }

    loadDataAktivni() {
        fetch('/api/administrator/aktivni')
            .then(response => response.json())
            .then(data => { this.setState({ administrators: data }) });
    }

    loadData() {
        fetch('/api/administrator')
            .then(response => response.json())
            .then(data => { this.setState({ administrators: data }) });
    }

    componentWillMount() {
        this.loadDataAktivni();
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
            .then(data => { this.setState({ airCompany: data }) })
    }

    handleSubmit() {

        let dataToSend = {
            username: this.state.username,
            password: this.state.password,
            airCompany: this.state.airCompany
        }
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
                body: JSON.stringify(dataToSend),
            }
        ).then(response => {
            if (response.status === 202) {
                this.loadDataAktivni(); this.cleanData(); this.toggle('showModal');
                toast.success("Administrator sacuvan", { position: toast.POSITION_TOP_RIGHT });
            }
            else {
                this.setState({ message: " Greska prilikom dodavanja administratora" })
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
                body: JSON.stringify(dataToSend),
            }
        ).then(response => {
            if (response.status === 202) {
                this.loadDataAktivni(); this.cleanData(); this.toggle('showModal1');
                toast.success("Aviokompanija sacuvana", { position: toast.POSITION_TOP_RIGHT });
            }
            else { this.setState({ message: "Greska prilikom dodavanja aviokompanije" }) }
        });
    }

    handleCheckBox(event) {
        var checkbox = document.getElementById("checkbox_aktivni");
        if (checkbox.checked === true) {
            this.loadData();
        } else {
            this.loadDataAktivni();
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

    selectObject(event) {
        var putanja = '/api/administrator/' + event.target.value;
        var asd = fetch(putanja,
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
                this.loadDataAktivni();
                toast.success("Administrator suspendovan", { position: toast.POSITION_TOP_RIGHT });
            }
            else {
                toast.error("Administrator nije suspendovan", { position: toast.POSITION_TOP_RIGHT });
            }
        });
    }

    handleIzmjena(event) {
        let dataToSend = {
            username: this.state.username,
            password: this.state.password,
            airCompany: this.state.airCompany,
            active: true
        }
        fetch('api/administrator',
            {
                method: 'PUT',
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
                this.loadDataAktivni(); this.cleanData(); this.toggle('showModalIzmjena');
                toast.success("Administrator izmjenjen", { position: toast.POSITION_TOP_RIGHT });
            }
            else {
                toast.error("Administrator nije izmjenjen", { position: toast.POSITION_TOP_RIGHT });
            }
        });
    }

    openModalWithItem(item) {
        let pom = {
            airCompany: this.loadJednu(item.airCompany.name)
        }
        this.setState({
            showModalIzmjena: true,
            username: item.username,
            password: "",
            airCompany: pom
        })
    }


    render() {
        let administrators = [...this.state.administrators];
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
                                    Izabrali ste aviokompaniju: {this.state.selectedValue}
                                </div>
                                <p style={{ color: '#923cb5' }}>{this.state.message}</p>
                                <br></br>
                                <Button className="supervizorButton" onClick={this.handleSubmit}>Dodaj administratora</Button>
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
                                <Button className="supervizorButton" onClick={this.handleSubmitAvio}>Dodaj aviokompaniju</Button>
                            </div>
                        </ModalBody>
                    </Modal>
                </Container>

                <Container>
                    <Modal
                        isOpen={this.state.showModalIzmjena}
                        toggle={() => this.toggle('showModalIzmjena')}
                        className="bg-transparent modal-xl">
                        <ModalBody>
                            <div>
                                <InputGroup size="sm">
                                    <InputGroupAddon sm={3} addonType="prepend">
                                        Username:
                                </InputGroupAddon>
                                    <Input
                                        type="text" name="usernameIzmjena" id="usernameIzmjena" defaultValue={this.state.username} onChange={this.handleInputChange}
                                    ></Input>
                                </InputGroup>
                                <br></br>
                                <InputGroup size="sm">
                                    <InputGroupAddon addonType="prepend">
                                        Password:
                                 </InputGroupAddon>
                                    <Input
                                        type="text" name="password" id="password" value={this.state.password} onChange={this.handleInputChange}
                                    ></Input>
                                </InputGroup>
                                <br></br>
                                <ComboAviokompanije name="airCompanyIzmjena" id="airCompanyIzmjena" /*value={this.state.airCompany} /*selected={this.state.airCompany.name}*/ onSelectChange={this.handleSelectChange} />  <br></br> <br></br>
                                <div>
                                    Nova aviokompanija: {this.state.selectedValue}
                                </div>
                                <p style={{ color: '#923cb5' }}>{this.state.message}</p>
                                <br></br>
                                <Button className="supervizorButton" onClick={this.handleIzmjena}>Izmjeni administratora</Button>
                            </div>
                        </ModalBody>
                    </Modal>
                </Container>
                <h1 style={{ color: "#ffffff", marginLeft: '50px' }}>Admin Data</h1><br></br>
                <Button style={{ backgroundColor: "#001433", top: "10px", right: "50px", width: "250px", position: "absolute" }} onClick={this.logOut}>Log out</Button>

                <Button className="supervizorButton" style={{ marginLeft: "50px" }} onClick={() => this.toggle('showModal')}>Dodaj novog administratora</Button>
                <Button className="supervizorButton" style={{ marginLeft: "50px" }} onClick={() => this.toggle('showModal1')}>Dodaj novu aviokompaniju</Button>

                <Label className="label" style={{ marginLeft: "50px" }}>Prikazi sve administratore:</Label>
                <input style={{ width: "50px" }} type="checkbox" id="checkbox_aktivni" onChange={(event) => this.handleCheckBox(event)}></input><br></br><br></br>

                <Container className="scrollit">
                    <Table>
                        <thead>
                            <tr><th>ID</th><th>Username</th><th>IsActive</th><th>Air Company</th><th>Suspenduj</th><th>Izmjeni</th></tr>
                        </thead>
                        <tbody>
                            {
                                administrators.map((admin) => {
                                    return <tr key={admin.id}>
                                        <td>{admin.id}</td>
                                        <td>{admin.username}</td>
                                        <td>{String(admin.active)}</td>
                                        <td>{String(admin.airCompany.name)}</td>
                                        <td> {(() => {
                                            switch (String(admin.active)) {
                                                case "true": return <Button onClick={(event) => this.selectObject(event)} value={admin.username}>Suspenduj</Button>;
                                                case "false": return <Button disabled>Suspenduj</Button>;
                                                default: return <p></p>
                                            }
                                        })()}
                                        </td>
                                        <td><Button onClick={() => this.openModalWithItem(admin)}>Izmjeni</Button></td>
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

export default AdminData;