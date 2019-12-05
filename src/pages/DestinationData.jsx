

import React, { Component } from 'react';
import { Button, Modal, ModalBody, InputGroup, InputGroupAddon, Container, Table, Input } from 'reactstrap';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { checkIfLogged } from '../common.js'

class DestinationData extends Component {

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
       // this.show = this.show.bind(this);
        this.state = { destinations: [], showModal: false, message: "", name: "", showModal1: false }
    }

    loadDataAktivni() {
        fetch('/api/destination/aktivni')
            .then(response => response.json())
            .then(data => { console.log(this.state); this.setState({ destinations: data }) });
    }

    loadData() {
        fetch('/api/destination')
            .then(response => response.json())
            .then(data => { console.log(this.state); this.setState({ destinations: data, }) });
    }

    componentWillMount() {
        this.loadData();
    }

    cleanData() {
        this.setState({ message: "", name: "" });
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
                body: JSON.stringify(this.state),
            }


        ).then(response => {
            if (response.status === 202) {
                this.loadData(); this.cleanData(); this.toggle('showModal');
                toast.success("Destinacija sacuvana", { position: toast.POSITION_TOP_RIGHT });
            }
            else { this.setState({ message: response.status + " Greska prilikom dodavanja destinacije." }) }
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
        var putanja = '/api/destionation/' + event.target.value;
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
                toast.success("Destinacija obrisana", { position: toast.POSITION_TOP_RIGHT });
            }
            else {
                toast.error("Destinacija nije obrisana", { position: toast.POSITION_TOP_RIGHT });
            }
        });
    }

  

    render() {
        console.log("RENDER:")
        console.log(this.state);
        let destinations = [...this.state.destinations];
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
                                        Name:
                                </InputGroupAddon>
                                    <Input
                                        type="text" name="name" id="name" value={this.state.name} onChange={this.handleInputChange}
                                    ></Input>
                                </InputGroup>
                                <br></br>

                                <Button style={{ backgroundColor: "#923cb5" }} onClick={this.handleSubmit}>Dodaj destinaciju</Button>
                            </div>
                        </ModalBody>
                    </Modal>
                </Container>

                <Container>

                    <Table>
                        <tbody>
                            <tr>
                                <td><h1 style={{ color: "#923cb5" }}>Destination data</h1></td>

                                <td><Button style={{ backgroundColor: "#42378F" }} onClick={this.logOut}>Log out</Button></td>
                            </tr>
                        </tbody>
                    </Table>
                </Container>
                <Container>
                    <Table borderless="true">
                        <tr>
                            <td><Button style={{ backgroundColor: "#923cb5" }} onClick={() => this.toggle('showModal')}>Dodaj novu destinaciju</Button></td>
                            <td><Button style={{ backgroundColor: "#923cb5" }} onClick={() => this.toggle('showModal1')}>Izmjeni</Button></td>
                            <td align="right"> <p><font color="white">Prikazi ispravne destinacije:</font></p> </td>
                            <td align="right"><input type="checkbox" id="checkbox_aktivni" onChange={(event) => this.handleCheckBox(event)}></input></td>
                        </tr>
                    </Table>
                    <Table >
                        <thead>
                            <tr><th>ID</th><th>Name</th><th>IsActive</th><th>Suspenduj</th></tr>
                        </thead>
                        <tbody>
                            {
                                destinations.map((destionation) => {
                                    return <tr key={destionation.id}><td>{destionation.id}</td><td>{destionation.name}</td>
                                        <td>{String(destionation.active)}</td>
                                        <td> {(() => {
                                            switch (String(destionation.active)){
                                                case "true" :  return <Button onClick={(event) => this.selectObject(event)} value={destionation.name}>Suspenduj</Button>;
                                                case "false":  return <Button disabled>Suspenduj</Button>;
                                             }})()}
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

export default DestinationData