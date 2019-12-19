import React, { Component } from 'react';
import { Button, Modal, ModalBody, InputGroup, InputGroupAddon, Container, Table, Input,Label } from 'reactstrap';
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
            .then(data => { this.setState({ airplanes: data }) });
    }

    loadData() {
        fetch('/api/airplane')
            .then(response => response.json())
            .then(data => { this.setState({ airplanes: data, }) });
    }

    componentWillMount() {
        this.loadDataAktivni();
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
                this.loadDataAktivni(); this.cleanData(); this.toggle('showModal');
                toast.success("Avion sacuvan", { position: toast.POSITION_TOP_RIGHT });
            }
            else { this.setState({ message: " Greska prilikom dodavanja aviona." }) }
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

    selectObject(event)
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
                this.loadDataAktivni();
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
            active: true
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
                this.loadDataAktivni(); this.cleanData(); this.toggle('showModalIzmjena');
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
        let airplanes = [...this.state.airplanes];
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

                                <Button className="supervizorButton" onClick={this.handleSubmit}>Dodaj avion</Button>
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
                                <Button className="supervizorButton" onClick={this.handleIzmjena}>Izmjeni avion</Button>
                            </div>
                        </ModalBody>
                    </Modal>
                </Container>

                <h1 style={{ color: "#ffffff", marginLeft: '50px' }}>Airplane Data</h1><br></br>
                <Button style={{ backgroundColor: "#001433", top: "10px", right: "50px", width: "250px", position: "absolute" }} onClick={this.logOut}>Log out</Button>

                <Button className="supervizorButton" style={{ marginLeft: "50px" }} onClick={() => this.toggle('showModal')}>Dodaj novi avion</Button>
                <Label className="label" style={{ marginLeft: "50px" }}>Prikazi sve avione:</Label>
                <input style={{ width: "50px" }} type="checkbox" id="checkbox_aktivni" onChange={(event) => this.handleCheckBox(event)}></input><br></br><br></br>

                <Container className="scrollit">
                    <Table >
                        <thead>
                            <tr><th>ID</th><th>Brand</th><th>Seats</th><th>IsActive</th><th
                                style={(localStorage.getItem('data') !== "ADMINISTARTOR") ? {} : { display: 'none' }
                                }
                            >Suspenduj</th><th style={(localStorage.getItem('data') !== "ADMINISTARTOR") ? {} : { display: 'none' }}>Izmjeni</th></tr>
                        </thead>
                        <tbody>
                            {
                                airplanes.map((airplane) => {
                                    return <tr key={airplane.id}>
                                        <td>{airplane.id}</td>
                                        <td>{airplane.brand}</td>
                                        <td>{String(airplane.seats)}</td>
                                        <td>{String(airplane.active)}</td>
                                        <td style={(localStorage.getItem('data') !== "ADMINISTARTOR") ? {} : { display: 'none' }}> {(() => {
                                            switch (String(airplane.active)) {
                                                case "true": return (localStorage.getItem('data') !== "ADMINISTARTOR") ? <Button onClick={(event) => this.selectObject(event)} value={airplane.id}>Suspenduj</Button> : null;
                                                case "false": return (localStorage.getItem('data') !== "ADMINISTARTOR") ? <Button disabled>Suspenduj</Button> : null;
                                                default: return <p></p>
                                            }
                                        })()}
                                        </td>

                                        <td style={(localStorage.getItem('data') !== "ADMINISTARTOR") ? {} : { display: 'none' }}>
                                            {(localStorage.getItem('data') !== "ADMINISTARTOR") ? <Button onClick={() => this.openModalWithItem(airplane)}>Izmjeni</Button> : null}

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

export default AirplaneData;