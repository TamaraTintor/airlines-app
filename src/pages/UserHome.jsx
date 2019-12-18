import React, { Component } from 'react';
import { Button, Table, Label, Input } from 'reactstrap';
import 'react-toastify/dist/ReactToastify.css';
import '../index.css';
import { ToastContainer, toast } from 'react-toastify';
import { checkIfLogged } from '../common.js'
import ComboDestinacije from '../combobox/ComboDestinacije';
import ComboAviokompanije from '../combobox/ComboAvikomanije';
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
        this.handleDatum=this.handleDatum.bind(this);
        this.loadAvionePoDestinaciji = this.loadAvionePoDestinaciji.bind(this);
        this.state = { flights: [], tickets: [], numberOfTicket: "", flight: "", message: "", selectedValueAviokompanija: "", selectedValueDestinacija: "", datum: "", user: "" };
    }

    loadData() {
        fetch('/api/flight/aktivni')
            .then(response => response.json())
            .then(data => { console.log(this.state); this.setState({ flights: data }) });
    }

    loadAvionePoDestinaciji(ime) {
        fetch('/api/flight/destination/' + ime)
            .then(response => response.json())
            .then(data => { console.log(this.state); this.setState({ flights: data }) });
    }

    loadAvionePoDestinaciji(datum) {
        fetch('/api/flight/' + datum)
            .then(response => response.json())
            .then(data => { console.log(this.state); this.setState({ flights: data }) });
    }


    componentWillMount() {
        this.loadData();
        this.loadUser();
    }

    loadKupljeneKarte(username) {
        fetch('/api/ticket/' + username)
            .then(response => response.json())
            .then(data => { console.log(this.state); this.setState({ tickets: data }) });
    }

    loadJednuDestinaciju(ime) {
        fetch('/api/destination/' + ime)
            .then(response => response.json())
            .then(data => { this.setState({ destination: data }) })
    }

    cleanData() {
        this.setState({ message: "", flight: "", numberOfTicket: "", selectedValueDestinacija: "", selectedValueAviokompanija: "", datum: "" });
    }

    toggle = field => {
        this.setState(prev => {
            return { [field]: !prev[field] };
        });
    };

    loadUser() {
        fetch('/api/user/igor')
            .then(response => response.json())
            .then(data => { this.setState({ user: data }) })
    }

    loadLet(id) {
        fetch('/api/flight/' + id)
            .then(response => response.json())
            .then(data => { this.setState({ flight: data }) })
    }

    handleSubmit() {
        let dataToSend = {
            numberOfTicket: document.getElementById("number").value,
            flight: this.state.flight,
            user: this.state.user
        }
        console.log("kartaaaa" + dataToSend.flight)
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
                this.loadData(); this.cleanData();
                toast.success("Karta je kupljena", { position: toast.POSITION_TOP_RIGHT });
            }
            else {
                this.setState({ message: response.status + " Greska prilikom kupovine karte." })
            }
        });
    }

    handleInputChange(event) {
        this.setState({ [event.target.name]: event.target.value });
        this.loadAvionePoDatumu(event.target.value);
    }

    handleSelectChangeDestinacije = (selectedValueDestinacija) => {
        this.setState({
            selectedValueDestinacija: selectedValueDestinacija,
        });
        this.loadAvionePoDestinaciji(selectedValueDestinacija);
    }

    handleDatum = (selectedValueDatum) => {
        this.setState({
            selectedValueDatum: selectedValueDatum,
        });
        this.loadAvionePoDatumu(selectedValueDatum);
    }

    izaberi(event) {
        let data = {
            flight: this.loadLet(event.target.value)
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
        let flights = [...this.state.flights];
        return (
            <html>
                <body>
                    <ToastContainer autoClose={4000} />
                    <div style={{ backgroundColor: '#923cb5', justifyContent: 'center', alignItems: 'center', }}>
                        <div>
                            <p>User page</p>
                            <p><Button style={{ backgroundColor: "#42378F" }} onClick={this.logOut}>Log out</Button></p>
                            <p><Button style={{ backgroundColor: "#42378F" }} onClick={this.handleSubmit}>Kupi</Button></p>
                        </div>
                        <div className="sve">
                            <div className="lijevo">
                                <ComboDestinacije name="destination" id="destination" onSelectChange={this.handleSelectChangeDestinacije} />
                                <Label className="label">Izaberite datum leta:</Label>
                                <input className="date" type="date" name="datum" id="datum" onSelectChange={this.handleInputChange}></input>
                                <Label className="label">Unesite broj osoba:</Label>
                                <input className="date" type="number" min="1" id="number"></input>
                            </div>
                            <div className="desno">
                                <Table >
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
                    </div>
                </body>
            </html>
        );
    };

}

export default UserHome;