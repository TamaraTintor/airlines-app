import React, { Component } from 'react';
import { Button, Modal, ModalBody, InputGroup, InputGroupAddon, Container, Table, Input } from 'reactstrap';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { checkIfLogged } from '../common.js'

class AirplaneData extends Component {

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
        this.selectObject = this.selectObject.bind(this);
        this.handleIzmjena = this.handleIzmjena.bind(this);
        this.state = { airplanes: [], showModal: false, message: "", brand: "", seats: "", showModalIzmjena: false, id: "", active: "" }
    }

    loadDataAktivni() {
        fetch('/api/airplane/aktivni')
            .then(response => response.json())
            .then(data => { console.log(this.state); this.setState({ airplanes: data }) });
    }

    loadData() {
        fetch('/api/airplane')
            .then(response => response.json())
            .then(data => { console.log(this.state); this.setState({ airplanes: data, }) });
    }

    componentWillMount() {
        this.loadData();
    }

    cleanData() {
        this.setState({ message: "", brand: "", seats: "" });
    }

    toggle = field => {
        this.setState(prev => {
            return { [field]: !prev[field] };
        });
    };

    handleInputChange(event) {
        this.setState({ [event.target.id]: event.target.value });
    }

    handleSubmit() {
        let dataToSend = {
            brand: this.state.brand,
            seats: this.state.seats,
        }
        fetch('/api/airplane',
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
                toast.success("Avion sacuvan", { position: toast.POSITION_TOP_RIGHT });
            }
            else { this.setState({ message: response.status + " Greska prilikom dodavanja aviona." }) }
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

    selectObject(event)//da suspenduje objekat
    {
        var putanja = '/api/airplane/' + event.target.value;
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
                toast.success("Avion obrisan", { position: toast.POSITION_TOP_RIGHT });
            }
            else {
                toast.error("Avion nije obrisan", { position: toast.POSITION_TOP_RIGHT });
            }
        });
    }

    handleIzmjena(event) {

        let dataToSend = {
            id: this.state.id,
            brand: document.getElementById("brandIzmjena").value,
            seats: document.getElementById("seatsIzmjena").value,
            active: this.state.active
        }
        fetch('api/airplane',
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
                this.loadData(); this.cleanData(); this.toggle('showModalIzmjena');
                toast.success("Avion izmjenjen", { position: toast.POSITION_TOP_RIGHT });
            }
            else {
                toast.error("Avion nije izmjenjen", { position: toast.POSITION_TOP_RIGHT });
            }
        });
    }

    openModalWithItem(item) {
        this.setState({
            showModalIzmjena: true,
            id: item.id,
            brand: item.brand,
            seats: item.seats,
            active: item.active
        })
    }

    render() {
        console.log("RENDER:")
        console.log(this.state);
        let airplanes = [...this.state.airplanes];
        return (
            <div style={{ backgroundColor: '#923cb5', backgroundImage: `linear-gradient(150deg, #000000 30%, #923cb5 70%)`, margin: 0, height: '100vh', width: '100%', justifyContent: 'center', alignItems: 'center', }}>
                <ToastContainer autoClose={3000} />
                <Container>
                    <Modal
                        isOpen={this.state.showModal}
                        toggle={() => this.toggle('showModal')}
                        className="bg-transparent modal-xl">
                        <ModalBody>
                            <div>
                                <InputGroup size="sm">
                                    <InputGroupAddon sm={3} addonType="prepend">
                                        Brand:
                                </InputGroupAddon>
                                    <Input
                                        type="text" name="brand" id="brand" value={this.state.brand} onChange={this.handleInputChange}
                                    ></Input>
                                </InputGroup>
                                <br></br>
                                <InputGroup size="sm">
                                    <InputGroupAddon sm={3} addonType="prepend">
                                        Seats:
                                </InputGroupAddon>
                                    <Input
                                        type="text" name="seats" id="seats" value={this.state.seats} onChange={this.handleInputChange}
                                    ></Input>
                                </InputGroup>
                                <br></br>

                                <Button style={{ backgroundColor: "#923cb5" }} onClick={this.handleSubmit}>Dodaj avion</Button>
                            </div>
                        </ModalBody>
                    </Modal>
                </Container>

                <Container>
                    <Modal
                        isOpen={this.state.showModalIzmjena}
                        toggle={() => this.toggle('showModaIzmjena')}
                        className="bg-transparent modal-xl">
                        <ModalBody>
                            <div>
                                <InputGroup size="sm">
                                    <InputGroupAddon sm={3} addonType="prepend">
                                        Brand:
                                </InputGroupAddon>
                                    <Input
                                        type="text" name="brandIzmjena" id="brandIzmjena" defaultValue={this.state.brand} onChange={this.handleInputChange}
                                    ></Input>
                                </InputGroup>
                                <br></br>
                                <InputGroup size="sm">
                                    <InputGroupAddon sm={3} addonType="prepend">
                                        Seats:
                                </InputGroupAddon>
                                    <Input
                                        type="text" name="seatsIzmjena" id="seatsIzmjena" defaultValue={this.state.seats} onChange={this.handleInputChange}
                                    ></Input>
                                </InputGroup>
                                <br></br>
                                <Button style={{ backgroundColor: "#923cb5" }} onClick={this.handleIzmjena}>Izmjeni avion</Button>
                            </div>
                        </ModalBody>
                    </Modal>
                </Container>

                <Container>
                    <Table borderless="true">
                        <tbody>
                            <tr>
                                <td><h1 style={{ color: "#923cb5" }}>Airplane Data</h1></td>
                                <td align="right" valign="middle"><Button style={{ backgroundColor: "#42378F" }} onClick={this.logOut}>Log out</Button></td>
                            </tr>
                        </tbody>
                    </Table>
                </Container>
                <Container>
                    <Table borderless="true">
                        <tr>
                            <td><Button style={{ backgroundColor: "#923cb5" }} onClick={() => this.toggle('showModal')}>Dodaj novi avion</Button></td>
                            <td align="right"> <p><font color="white">Prikazi aktivne avione:</font></p> </td>
                            <td align="right"><input type="checkbox" id="checkbox_aktivni" onChange={(event) => this.handleCheckBox(event)}></input></td>
                        </tr>
                    </Table>
                    <Table >
                        <thead>
                            <tr><th>ID</th><th>Brand</th><th>Seats</th><th>IsActive</th><th>Suspenduj</th><th>Izmjeni</th></tr>
                        </thead>
                        <tbody>
                            {
                                airplanes.map((airplane) => {
                                    return <tr key={airplane.id}>
                                        <td>{airplane.id}</td>
                                        <td>{airplane.brand}</td>
                                        <td>{String(airplane.seats)}</td>
                                        <td>{String(airplane.active)}</td>
                                        <td> {(() => {
                                            switch (String(airplane.active)) {
                                                case "true": return <Button onClick={(event) => this.selectObject(event)} value={airplane.id}>Suspenduj</Button>;
                                                case "false": return <Button disabled>Suspenduj</Button>;
                                                default: return <p></p>
                                            }
                                        })()}
                                        </td>
                                        <td><Button onClick={() => this.openModalWithItem(airplane)}>Izmjeni</Button></td>
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

export default AirplaneData;