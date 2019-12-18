

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
        this.handleIzmjena=this.handleIzmjena.bind(this);
        this.show=this.show.bind(this);
        this.state = { destinations: [], showModal: false, message: "", name: "", showModalIzmjena: false, id:"", active:""}
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
                body: JSON.stringify(dataToSend),
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
        var putanja = '/api/destination/' + event.target.value;
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

  
    handleIzmjena(event) {
        let dataToSend = {
            name: document.getElementById("nameIzmjena").value,
            id: this.state.id,
            active: this.state.active
        }
        fetch('api/destination',
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
                toast.success("Destinacija izmjenjena", { position: toast.POSITION_TOP_RIGHT });
            }
            else {
                toast.error("Destinacija nije izmjenjena", { position: toast.POSITION_TOP_RIGHT });
            }
        });
    }


    openModalWithItem(item) {
        this.setState({
            showModalIzmjena: true,
            id: item.id,
            name: item.name,
            active: item.active
        })
       
    }

    show(){
        var elements=document.getElementById("buttonIzmjena");
        elements.style.display="none";
        
        }
        
    render() {
        console.log("RENDER:")
        console.log(this.state);
        let destinations = [...this.state.destinations];
        return (
            <div style={{ backgroundColor: 'teal', margin: 0, height: '100vh', width: '100%', justifyContent: 'center', alignItems: 'center', }}>
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
                    <Modal
                        isOpen={this.state.showModalIzmjena}
                        toggle={() => this.toggle('showModalIzmjena')}
                        className="bg-transparent modal-xl">
                        <ModalBody>
                            <div>
                                <InputGroup size="sm">
                                    <InputGroupAddon sm={3} addonType="prepend">
                                        Name:
                                </InputGroupAddon>
                                    <Input
                                        type="text" name="nameIzmjena" id="nameIzmjena" defaultValue={this.state.name} onChange={this.handleInputChange}
                                    ></Input>
                                </InputGroup>
                                <br></br>

                                <Button style={{ backgroundColor: "#923cb5" }} onClick={this.handleIzmjena}>Izmjeni destinaciju</Button>
                            </div>
                        </ModalBody>
                    </Modal>
                </Container>

                <Container>
                    <Table borderless="true">
                        <tbody>
                                     <h1 style={{ color: "white" }}>Destination Data</h1>
                                <div align="right" valign="middle"><Button style={{ backgroundColor: "#42378F" }} onClick={this.logOut}>Log out</Button></div>
                            
                        </tbody>
                    </Table>
                </Container>
                <Container>
                    <Table borderless="true">
                        <tr>
                            <td><Button style={{ backgroundColor: "#923cb5" }} onClick={() => this.toggle('showModal')}>Dodaj novu destinaciju</Button></td>
                            <td align="right"> <p><font color="white">Prikazi aktivne destinacije:</font></p> </td>
                            <td align="right"><input type="checkbox" id="checkbox_aktivni" onChange={(event) => this.handleCheckBox(event)}></input></td>
                        </tr>
                    </Table>
                    <Table >
                        <thead >
                            <tr><th>ID</th><th>Name</th><th>IsActive</th>
                            <th
                               style={ (localStorage.getItem('data') !== "ADMINISTARTOR") ? {}:{display:'none'}
                            }>Suspenduj</th><th style={ (localStorage.getItem('data') !== "ADMINISTARTOR") ? {}:{display:'none'}}>Izmjeni</th></tr>
                        </thead>
                        <tbody>
                            {
                                destinations.map((destionation) => {
                                    return <tr key={destionation.id}>
                                        <td>{destionation.id}</td>
                                        <td>{destionation.name}</td>
                                        <td>{String(destionation.active)}</td>
                                        <td> {(() => {
                                            switch (String(destionation.active)) {
                                                case "true": 
                                               
                                               return (localStorage.getItem('data') !== "ADMINISTARTOR") ? <Button onClick={(event) => this.selectObject(event)}  value={destionation.name}>Suspenduj</Button> : null;
                                                case "false": return  (localStorage.getItem('data') !== "ADMINISTARTOR") ?<Button disabled>Suspenduj</Button> :null;
                                                default: return <p></p>
                                            }
                                        })()}
                                        </td>
                           
<td>
{ (localStorage.getItem('data') !== "ADMINISTARTOR") ? <Button onClick={() => this.openModalWithItem(destionation)}>Izmjeni</Button> : null }

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

export default DestinationData;