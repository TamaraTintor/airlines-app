

import React, { Component } from 'react';
import { Button, Modal, ModalBody, InputGroup, InputGroupAddon, Container, Table, Input,Label } from 'reactstrap';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { checkIfLogged } from '../common.js'

class AircompanyData extends Component {

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
        this.selectObject = this.selectObject.bind(this);
        this.loadDataAktivni = this.loadDataAktivni.bind(this);
        this.handleIzmjena=this.handleIzmjena.bind(this);
        this.state = { airCompanies: [], showModal: false, message: "", name: "", showModalIzmjena: false, id:"",active:"" }
    }

    loadDataAktivni() {
        fetch('/api/airCompany/aktivni')
            .then(response => response.json())
            .then(data => { this.setState({ airCompanies: data }) });
    }

    loadData() {
        fetch('/api/airCompany')
            .then(response => response.json())
            .then(data => { this.setState({ airCompanies: data, }) });
    }

    componentWillMount() {
        this.loadDataAktivni();
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
                this.loadDataAktivni(); this.cleanData(); this.toggle('showModal');
                toast.success("Avio kompanija sacuvana", { position: toast.POSITION_TOP_RIGHT });
            }
            else { this.setState({ message: " Greska prilikom dodavanja avio kompanije." }) }
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
        var putanja = '/api/airCompany/' + event.target.value;
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
                toast.success("Avio kompanija obrisana", { position: toast.POSITION_TOP_RIGHT });
            }
            else {
                toast.error("Avio kompanija nije obrisana", { position: toast.POSITION_TOP_RIGHT });
            }
        });
    }

    handleIzmjena(event) {
        let dataToSend = {
            name: document.getElementById("nameIzmjena").value,
            id: this.state.id,
            active: true
        }
        fetch('api/airCompany',
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
                toast.success("Avio kompanija izmjenjena", { position: toast.POSITION_TOP_RIGHT });
            }
            else {
                toast.error("Avio kompanija nije izmjenjena", { position: toast.POSITION_TOP_RIGHT });
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

    render() {
        let airCompanies = [...this.state.airCompanies];
        return (
            <div style={{
                backgroundColor: '#001f4d', backgroundImage: ` linear-gradient(#001f4d, gray)`,
                margin: 0, height: '100vh', width: '100%', justifyContent: 'center', alignItems: 'center',
            }}><ToastContainer autoClose={4000} />
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

                                <Button className="supervizorButton" onClick={this.handleSubmit}>Dodaj avio kompaniju</Button>
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

                                <Button className="supervizorButton" onClick={this.handleIzmjena}>Izmjeni avio kompaniju</Button>
                            </div>
                        </ModalBody>
                    </Modal>
                </Container>
                <h1 style={{ color: "#ffffff", marginLeft: '50px' }}>Aircompany Data</h1><br></br>
                <Button style={{ backgroundColor: "#001433", top: "10px", right: "50px", width: "250px", position: "absolute" }} onClick={this.logOut}>Log out</Button>

                <Button className="supervizorButton" style={{ marginLeft: "50px" }} onClick={() => this.toggle('showModal')}>Dodaj novu avio kompaniju</Button>
                <Label className="label" style={{ marginLeft: "50px" }}>Prikazi sve avio kompanije:</Label>
                <input style={{width:"50px"}} type="checkbox" id="checkbox_aktivni" onChange={(event) => this.handleCheckBox(event)}></input><br></br><br></br>
                <Container className="scrollit">
                    <Table >
                        <thead>
                            <tr><th>ID</th><th>Name</th><th>IsActive</th><th>Suspenduj</th><th>Izmjeni</th></tr>
                        </thead>
                        <tbody>
                            {
                                airCompanies.map((airCompany) => {
                                    return <tr key={airCompany.id}><td>{airCompany.id}</td><td>{airCompany.name}</td>
                                        <td>{String(airCompany.active)}</td>
                                        <td> {(() => {
                                            switch (String(airCompany.active)) {
                                                case "true": return <Button onClick={(event) => this.selectObject(event)} value={airCompany.name}>Suspenduj</Button>;
                                                case "false": return <Button disabled>Suspenduj</Button>;
                                                default: return <p></p>
                                            }
                                        })()}
                                        </td>
                                        <td><Button onClick={() => this.openModalWithItem(airCompany)}>Izmjeni</Button></td>
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

export default AircompanyData