

import React, { Component } from 'react';
import { Button, Modal, ModalBody, InputGroup, InputGroupAddon, Container, Table, Input, FormGroup, Label, Form } from 'reactstrap';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { checkIfLogged } from '../common.js'
import ComboAviokompanije from '../combobox/ComboAvikomanije';
import ComboAvioni from '../combobox/ComboAvioni';
import ComboDestinacije from '../combobox/ComboDestinacije';
import date from 'date-and-time';

class FlightData extends Component {

    constructor(props) {
        super(props);

        checkIfLogged().then(resp => {
            if (!resp) {
                this.props.history.push('/')
            }
        });

        this.logOut = this.logOut.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSubmitAviokompaniju = this.handleSubmitAviokompaniju.bind(this);
        this.handleSubmitAvion = this.handleSubmitAvion.bind(this);
        this.handleSubmitDestinaciju = this.handleSubmitDestinaciju.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.loadDataAktivni = this.loadDataAktivni.bind(this);
        this.loadJednuAviokompaniju = this.loadJednuAviokompaniju.bind(this);
        this.loadJedanAvion = this.loadJedanAvion.bind(this);
        this.loadJednuDestinaciju = this.loadJednuDestinaciju.bind(this);
        this.handleIzmjena = this.handleIzmjena.bind(this);
        this.state = {
            flights: [], brand: "", seats: "", name: "", showModalAviokompanija: false,
            showModalAvion: false, showModalDestinacija: false, showModal: false, message: "",
            flightDate: "", price: "", seatReserved: "", id: "", destination: "", airplane: "", airCompany: "",
            selectedValueAvion: "", selectedValueAviokompanija: "", selectedValueDestinacija: "", showModalIzmjena: false
        }
    }

    loadDataAktivni() {
        fetch('/api/flight/aktivni')
            .then(response => response.json())
            .then(data => { console.log(this.state); this.setState({ flights: data }) });
    }

    loadData() {
        fetch('/api/flight')
            .then(response => response.json())
            .then(data => { console.log(this.state); this.setState({ flights: data }) });
    }

    componentWillMount() {
        this.loadData();
    }

    cleanData() {
        this.setState({ brand: "", seats: "", name: "", message: "", flightDate: "", price: "", seatReserved: "", destination: "", airplane: "", airCompany: "", selectedValueAvion: "", selectedValueAviokompanija: "", selectedValueDestinacija: "" });
    }

    toggle = field => {
        this.setState(prev => {
            return { [field]: !prev[field] };
        });
    };

    handleInputChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    loadJednuAviokompaniju(ime) {
        fetch('/api/airCompany/' + ime)
            .then(response => response.json())
            .then(data => { this.setState({ airCompany: data }) })
    }

    loadJednuDestinaciju(ime) {
        fetch('/api/destination/' + ime)
            .then(response => response.json())
            .then(data => { this.setState({ destination: data }) })
    }

    loadJedanAvion(ime) {
        fetch('/api/airplane/' + ime)
            .then(response => response.json())
            .then(data => { this.setState({ airplane: data }) })
    }

    handleSubmit() {
        var uneseniDatum = document.getElementById("exampleDate").value + "T" + document.getElementById("exampleTime").value + ".000+0000";
        let dataToSend = {
            flightDate: uneseniDatum,
            airCompany: this.state.airCompany,
            airplane: this.state.airplane,
            destination: this.state.destination,
            price: this.state.price
        }
        console.log(dataToSend);
        fetch('/api/flight',
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
                toast.success("Let sacuvan", { position: toast.POSITION_TOP_RIGHT });
            }
            else {
                this.setState({ message: response.status + " Greska prilikom dodavanja leta" })
            }
        });
    }

    handleSubmitAviokompaniju() {
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
                this.loadData(); this.cleanData(); this.toggle('showModalAviokompanija');
                toast.success("Avio kompanija sacuvana", { position: toast.POSITION_TOP_RIGHT });
            }
            else { this.setState({ message: "Greska prilikom dodavanja avio kompanije" }) }
        });
    }

    handleSubmitDestinaciju() {
        let dataToSend = {
            name: this.state.name,
        }
        fetch('/api/destination',
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
                this.loadData(); this.cleanData(); this.toggle('showModalDestinacija');
                toast.success("Destinacija sacuvana", { position: toast.POSITION_TOP_RIGHT });
            }
            else { this.setState({ message: "Greska prilikom dodavanja destinacije" }) }
        });
    }

    handleSubmitAvion() {
        let dataToSend = {
            brand: this.state.brand,
            seats: this.state.seats
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
                this.loadData(); this.cleanData(); this.toggle('showModalAvion');
                toast.success("Avion sacuvan", { position: toast.POSITION_TOP_RIGHT });
            }
            else { this.setState({ message: "Greska prilikom dodavanja avion" }) }
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

    handleSelectChangeAviokompanije = (selectedValueAviokompanija) => {
        this.setState({
            selectedValueAviokompanija: selectedValueAviokompanija
        });
        let data = {
            airCompany: this.loadJednuAviokompaniju(selectedValueAviokompanija)
        }
    }

    handleSelectChangeDestinacije = (selectedValueDestinacija) => {
        this.setState({
            selectedValueDestinacija: selectedValueDestinacija
        });
        let data = {
            destination: this.loadJednuDestinaciju(selectedValueDestinacija)
        }
    }

    handleSelectChangeAvion = (selectedValueAvion) => {
        this.setState({
            selectedValueAvion: selectedValueAvion
        });
        let data = {
            airplane: this.loadJedanAvion(selectedValueAvion)
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
        var putanja = '/api/flight/' + event.target.value;
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
                toast.success("Let suspendovan", { position: toast.POSITION_TOP_RIGHT });
            }
            else {
                toast.error("Let nije suspendovan", { position: toast.POSITION_TOP_RIGHT });
            }
        });
    }

    handleIzmjena(event) {
        var uneseniDatum = document.getElementById("exampleDateIzmjena").value + "T" + document.getElementById("exampleTimeIzmjena").value + ".000+0000";
        let dataToSend = {
            flightDate: uneseniDatum,
            airCompany: this.state.airCompany,
            airplane: this.state.airplane,
            destination: this.state.destination,
            price: this.state.price,
            id: this.state.id
        }
        console.log(dataToSend);
        fetch('api/flight',
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
                toast.success("Let izmjenjen", { position: toast.POSITION_TOP_RIGHT });
            }
            else {
                toast.error("Let nije izmjenjen", { position: toast.POSITION_TOP_RIGHT });
            }
        });
    }

    openModalWithItem(item) {
        let pomAir = {
            airCompany: this.loadJednuAviokompaniju(item.airCompany.name)
        }
        let pomDest = {
            destination: this.loadJednuDestinaciju(item.destination.name)
        }
        let pomAvion = {
            airplane: this.loadJedanAvion(item.airplane.name)
        }
        this.setState({
            showModalIzmjena: true,
            price: item.price,
            flightDate: item.flightDate,
            airCompany: pomAir,
            destination:pomDest,
            airplane:pomAvion
        })
    }


    render() {
        let flights = [...this.state.flights];
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
                                    <InputGroupAddon addonType="prepend">
                                        Price:
                                 </InputGroupAddon>
                                    <Input
                                        type="text" name="price" id="price" value={this.state.price} onChange={this.handleInputChange}
                                    ></Input>
                                </InputGroup>
                                <br></br>
                                <Form inline>
                                    <FormGroup>
                                        <Label for="exampleDate">Datum:</Label>
                                        <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
                                        <Input
                                            type="date"
                                            name="date"
                                            id="exampleDate"
                                            placeholder="date placeholder"
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="exampleTime">Vrijeme"</Label>
                                        <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
                                        <Input
                                            type="time"
                                            name="time"
                                            id="exampleTime"
                                            placeholder="time placeholder"
                                        />
                                    </FormGroup>
                                </Form>
                                <br></br>
                                <Form inline>
                                    <ComboAviokompanije name="airCompany" id="airCompany" value={this.state.airCompany} onSelectChange={this.handleSelectChangeAviokompanije} />
                                    <div>
                                        &nbsp;  Izabrali ste aviokompaniju: {this.state.selectedValueAviokompanija}
                                    </div>
                                </Form>
                                <br></br>
                                <Form inline>
                                    <ComboDestinacije name="destination" id="destination" value={this.state.destination} onSelectChange={this.handleSelectChangeDestinacije} />
                                    <div>
                                        &nbsp; Izabrali ste destinaciju: {this.state.selectedValueDestinacija}
                                    </div>
                                </Form>
                                <br></br>
                                <Form inline>
                                    <ComboAvioni name="airplane" id="airplane" value={this.state.airplane} onSelectChange={this.handleSelectChangeAvion} />
                                    <div>
                                        &nbsp; Izabrali ste avion: {this.state.selectedValueAvion}
                                    </div>
                                </Form>
                                <br></br>
                                <p style={{ color: '#923cb5' }}>{this.state.message}</p>
                                <br></br>
                                <Button style={{ backgroundColor: "#923cb5" }} onClick={this.handleSubmit}>Dodaj let</Button>
                            </div>
                        </ModalBody>
                    </Modal>
                </Container>

                <Container>
                    <Modal
                        isOpen={this.state.showModalAviokompanija}
                        toggle={() => this.toggle('showModalAviokompanija')}
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
                                <Button style={{ backgroundColor: "#923cb5" }} onClick={this.handleSubmitAviokompaniju}>Dodaj aviokompaniju</Button>
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
                                    <InputGroupAddon addonType="prepend">
                                        Price:
                                 </InputGroupAddon>
                                    <Input
                                        type="text" name="priceIzmjena" id="priceIzmjena" defaultValue={this.state.price} onChange={this.handleInputChange}
                                    ></Input>
                                </InputGroup>
                                <br></br>
                                <Form inline>
                                    <FormGroup>
                                        <Label for="exampleDate">Datum:</Label>
                                        <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
                                        <Input
                                            type="date"
                                            name="date"
                                            id="exampleDateIzmjena"
                                            placeholder="date placeholder"
                                            defaultValue={this.state.flightDate}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="exampleTime">Vrijeme:</Label>
                                        <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
                                        <Input
                                            type="time"
                                            name="time"
                                            id="exampleTimeIzmjena"
                                            placeholder="time placeholder"
                                        />
                                    </FormGroup>
                                </Form>
                                <br></br>
                                <Form inline>
                                    <ComboAviokompanije name="airCompanyIzmjena" id="airCompanyIzmjena" defaultValue={this.state.airCompany} onSelectChange={this.handleSelectChangeAviokompanije} />
                                    <div>
                                        &nbsp;  Nova aviokompanija je: {this.state.selectedValueAviokompanija}
                                    </div>
                                </Form>
                                <br></br>
                                <Form inline>
                                    <ComboDestinacije name="destinationIzmjna" id="destinationIzmjena" defaultValue={this.state.destination} onSelectChange={this.handleSelectChangeDestinacije} />
                                    <div>
                                        &nbsp; Nova destinacija je: {this.state.selectedValueDestinacija}
                                    </div>
                                </Form>
                                <br></br>
                                <Form inline>
                                    <ComboAvioni name="airplaneIzmjena" id="airplaneIzmjena" defaultValue={this.state.airplane} onSelectChange={this.handleSelectChangeAvion} />
                                    <div>
                                        &nbsp; Novi avion je: {this.state.selectedValueAvion}
                                    </div>
                                </Form>
                                <br></br>
                                <p style={{ color: '#923cb5' }}>{this.state.message}</p>
                                <br></br>
                                <Button style={{ backgroundColor: "#923cb5" }} onClick={this.handleIzmjena}>Izmjeni let</Button>
                            </div>
                        </ModalBody>
                    </Modal>
                </Container>

                <Container>
                    <Modal
                        isOpen={this.state.showModalDestinacija}
                        toggle={() => this.toggle('showModalDestinacija')}
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
                                <br></br>

                                <Button style={{ backgroundColor: "#923cb5" }} onClick={this.handleSubmitDestinaciju}>Dodaj destinaciju</Button>
                            </div>
                        </ModalBody>
                    </Modal>
                </Container>

                <Container>
                    <Modal
                        isOpen={this.state.showModalAvion}
                        toggle={() => this.toggle('showModalAvion')}
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

                                <Button style={{ backgroundColor: "#923cb5" }} onClick={this.handleSubmitAvion}>Dodaj avion</Button>
                            </div>
                        </ModalBody>
                    </Modal>
                </Container>

                <Container>
                    <Table borderless="true">
                        <tbody>
                            <tr>
                                <td><h1 style={{ color: "#923cb5" }}>flight Data</h1></td>
                                <td align="right" valign="middle"><Button style={{ backgroundColor: "#42378F" }} onClick={this.logOut}>Log out</Button></td>
                            </tr>
                        </tbody>
                    </Table>
                </Container>
                <Container>
                    <Table borderless="0">
                        <tr>
                            <td><Button style={{ backgroundColor: "#923cb5" }} onClick={() => this.toggle('showModal')}>Dodaj novi let</Button></td>
                            <td><Button style={{ backgroundColor: "#923cb5" }} onClick={() => this.toggle('showModalAviokompanija')}>Dodaj novu aviokompaniju</Button></td>
                            <td><Button style={{ backgroundColor: "#923cb5" }} onClick={() => this.toggle('showModalAvion')}>Dodaj novi avion</Button></td>
                            <td><Button style={{ backgroundColor: "#923cb5" }} onClick={() => this.toggle('showModalDestinacija')}>Dodaj novu destinaciju</Button></td>
                            <td align="right"> <p><font color="white">Prikazi aktivne letove:</font></p> </td>
                            <td align="right"><input type="checkbox" id="checkbox_aktivni" onChange={(event) => this.handleCheckBox(event)}></input></td>
                        </tr>
                    </Table>
                    <Table >
                        <thead>
                            <tr><th>ID</th><th>Datum</th><th>Price</th><th>IsActive</th><th>SeatReserved</th><th>Air Company</th><th>Destinacija</th><th>Avion</th><th>Suspenduj</th><th>Izmjeni</th></tr>
                        </thead>
                        <tbody>
                            {
                                flights.map((flight) => {
                                    return <tr key={flight.id}>
                                        <td>{flight.id}</td>
                                        <td>{
                                            date.format(new Date(flight.flightDate), 'DD.MM.YYYY HH:mm')
                                        /*new Intl.DateTimeFormat('en-GB', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute:'2-digit'
                                        }).format(new Date(flight.flightDate))*/}</td>
                                        <td>{flight.price}</td>
                                        <td>{String(flight.active)}</td>
                                        <td>{flight.seatReserved}</td>
                                        <td>{String(flight.airCompany.name)}</td>
                                        <td>{String(flight.destination.name)}</td>
                                        <td>{String(flight.airplane.brand)}</td>
                                        <td> {(() => {
                                            switch (String(flight.active)) {
                                                case "true": return <Button onClick={(event) => this.selectObject(event)} value={flight.id}>Suspenduj</Button>;
                                                case "false": return <Button disabled>Suspenduj</Button>;
                                                default: return <p></p>
                                            }
                                        })()}
                                        </td>
                                        <td><Button onClick={() => this.openModalWithItem(flight)}>Izmjeni</Button></td>
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

export default FlightData;