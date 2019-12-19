import React, { Component } from 'react';
import { Button, Table, Label, Modal, ModalBody } from 'reactstrap';
import 'react-toastify/dist/ReactToastify.css';
import '../index.css';
import { ToastContainer, toast } from 'react-toastify';
import { checkIfLogged } from '../common.js'
import ComboDestinacije from '../combobox/ComboDestinacije';
import date from 'date-and-time';

class UserHome extends Component {

    constructor(props) {
        super(props);

        checkIfLogged().then(resp => {
            if (!resp) {
                this.props.history.push('/user')
            }

        });

        this.logOut = this.logOut.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.loadJednuDestinaciju = this.loadJednuDestinaciju.bind(this);
        this.loadData = this.loadData.bind(this);
        this.loadUser = this.loadUser.bind(this);
        this.loadLet = this.loadLet.bind(this);
        this.izaberi = this.izaberi.bind(this);
        this.loadLetovePoDestinaciji = this.loadLetovePoDestinaciji.bind(this);
        this.resetujPodatke = this.resetujPodatke.bind(this);
        this.prikaziKarte = this.prikaziKarte.bind(this);
        this.state = { flights: [], tickets: [], destinacija: "", numberOfTicket: "", flight: "", message: "", selectedValue: "", user: "" };
    }

    loadData() {
        fetch('/api/flight/aktivni')
            .then(response => response.json())
            .then(data => { this.setState({ flights: data }) });
    }

    loadLetovePoDestinaciji(ime) {
        fetch('/api/flight/destination/' + ime)
            .then(response => response.json())
            .then(data => { this.setState({ flights: data }) });
    }

    componentWillMount() {
        this.loadData();
        this.loadUser();
    }

    loadKupljeneKarte(username) {
        fetch('/api/ticket/' + username)
            .then(response => response.json())
            .then(data => { this.setState({ tickets: data }) });
    }

    loadJednuDestinaciju(ime) {
        fetch('/api/destination/' + ime)
            .then(response => response.json())
            .then(data => { this.setState({ destination: data }) })
    }

    cleanData() {
        this.setState({ destinacija: "", numberOfTicket: "", flight: "", message: "", selectedValue: "", showModal: false });
    }

    toggle = field => {
        this.setState(prev => {
            return { [field]: !prev[field] };
        });
    };

    loadUser() {
        var user = localStorage.getItem("user");
        fetch('/api/user/' + user)
            .then(response => response.json())
            .then(data => { this.setState({ user: data }) })
    }

    loadLet(id) {
        fetch('/api/flight/' + id)
            .then(response => response.json())
            .then(data => { this.setState({ flight: data }) })
    }

    prikaziKarte(ime) {
        this.toggle('showModal');
        var user = localStorage.getItem("user");
        fetch('/api/ticket/' + user)
            .then(response => response.json())
            .then(data => { this.setState({ tickets: data }) })
    }

    handleSubmit() {
        let dataToSend = {
            numberOfTicket: document.getElementById("number").value,
            flight: this.state.flight,
            user: this.state.user
        }
        fetch('/api/ticket',
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
                this.loadData(); this.cleanData(); this.resetujPodatke();
                toast.success("Karta je kupljena", { position: toast.POSITION_TOP_RIGHT });
            }
            else {
                this.setState({ message:" Greska prilikom kupovine karte." })
            }
        });
    }

    handleInputChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSelectChangeDestinacije = (selectedValue) => {
        this.setState({
            selectedValue: selectedValue,
        });
        this.loadLetovePoDestinaciji(selectedValue);
    }

    izaberi(event) {
        let data = {
            flight: this.loadLet(event.target.value)
        }
    }

    resetujPodatke() {
        this.loadData();
        var polje = document.getElementById("number");
        polje.value = "";
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
        let flights = [...this.state.flights];
        let tickets = [...this.state.tickets];
        return (
            <div style={{
                backgroundColor: '#001f4d', backgroundImage: ` linear-gradient(#001f4d, gray)`,
                margin: 0, height: '100vh', width: '100%', justifyContent: 'center', alignItems: 'center',
            }}>
                <ToastContainer autoClose={4000} />
                <Modal isOpen={this.state.showModal}
                    toggle={() => this.toggle('showModal')}
                    className="bg-transparent modal-xl">
                    <ModalBody className="scrollit">
                        <Table>
                            <thead>
                                <tr><th>Datum Leta</th><th>Vrijeme leta</th><th>Price</th><th>Broj mjesta</th><th>Destinacija</th></tr>
                            </thead>
                            <tbody>
                                {
                                    tickets.map((ticket) => {
                                        return <tr key={ticket.id}>
                                            <td>{
                                                date.format(new Date(ticket.flight.flightDate), 'DD.MM.YYYY')
                                            }</td>
                                            <td>{
                                                date.format(new Date(ticket.flight.flightDate), 'HH:mm')
                                            }</td>
                                            <td>{ticket.flight.price}</td>
                                            <td>{ticket.numberOfTicket}</td>
                                            <td>{String(ticket.flight.destination.name)}</td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </Table>
                    </ModalBody>
                </Modal>

                <h1 style={{ color: "#ffffff", marginLeft: '50px' }}>User Page</h1><br></br>
                <Button style={{ backgroundColor: "#001433", top: "10px", right: "50px", width: "250px", position: "absolute" }} onClick={this.logOut}>Log out</Button>
                <div className="lijevo">
                    <Button className="date" onClick={this.resetujPodatke}>Prikazi sve letove</Button>
                    <ComboDestinacije name="destination" id="destination" onSelectChange={this.handleSelectChangeDestinacije} />
                    <Label className="label">Unesite broj osoba:</Label>
                    <input className="date" type="number" min="1" id="number"></input>
                    <Button className="date" onClick={this.handleSubmit}>Kupi</Button>
                    <Button className="date" id="karte" onClick={this.prikaziKarte}>Prikazi moje karte</Button>
                </div>
                <div className="desno scrollit">
                    <Table>
                        <thead>
                            <tr><th>Datum Leta</th><th>Vrijeme leta</th><th>Price</th><th>SeatReserved</th><th>Air Company</th><th>Destinacija</th><th>Avion</th><th>Izaberi kartu</th></tr>
                        </thead>
                        <tbody>
                            {
                                flights.map((flight) => {
                                    return <tr key={flight.id}>
                                        <td>{
                                            date.format(new Date(flight.flightDate), 'DD.MM.YYYY')
                                        }</td>
                                        <td>{
                                            date.format(new Date(flight.flightDate), 'HH:mm')
                                        }</td>
                                        <td>{flight.price}</td>
                                        <td>{flight.seatReserved}</td>
                                        <td>{String(flight.airCompany.name)}</td>
                                        <td>{String(flight.destination.name)}</td>
                                        <td>{String(flight.airplane.brand)}</td>
                                        <td> {(() => {
                                            switch (String(flight.active)) {
                                                case "true": return <Button onClick={(event) => this.izaberi(event)} value={flight.id}>izaberi</Button>;
                                                default: return <p></p>
                                            }
                                        })()}
                                        </td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </Table>


                </div>
            </div>

        );
    };

}

export default UserHome;