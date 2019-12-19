import React, { Component } from 'react';
import { Button } from 'reactstrap';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';
import { checkIfLogged } from '../common.js'

class AdminHome extends Component {

    constructor(props) {
        super(props);

        checkIfLogged().then(resp => {
            if (!resp) {
                this.props.history.push('/')
            }
        });
        this.logOut = this.logOut.bind(this);
        this.loadAdmina = this.loadAdmina.bind(this);
        this.state = { admin: "" }

    }

    loadAdmina(ime) {
        fetch('/api/administrator/' + ime)
            .then(response => response.json())
            .then(data => { this.setState({ admin: data }) });
    }
    componentWillMount() {
        this.loadAdmina(localStorage.getItem("admin"));
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

    flightPage() {
        var novi = this.state.admin.airCompany.id;
        localStorage.setItem("id", novi);
        localStorage.setItem("kompanija", JSON.stringify(this.state.admin.airCompany));
        window.open("/flightData", "_self");

    }
    destinationPage() {
        window.open("/destinationData", "_self");
    }
    airplanePage() {
        window.open("/airplaneData", "_self");
    }

    render() {
        return (
            <div  style={{
                backgroundColor: '#001f4d', backgroundImage: ` linear-gradient(#001f4d, gray)`,
                margin: 0, height: '100vh', width: '100%', justifyContent: 'center', alignItems: 'center',}}>
                <h1 style={{ color: "#ffffff" , marginLeft: '50px'}}>Administrator Page</h1><br></br>
                <Button className="buttonSupervizor" onClick={() => this.destinationPage()} >Rad sa destinacijama </Button><br></br><br></br>
                <Button className="buttonSupervizor" onClick={() => this.flightPage()} >Rad sa letovima </Button><br></br><br></br>
                <Button className="buttonSupervizor" onClick={() => this.airplanePage()} >Rad sa avionima </Button><br></br><br></br>
                <Button style={{ backgroundColor: "#001433", top: "10px", right:"50px", width: "250px",position: "absolute" }} onClick={this.logOut}>Log out</Button>

            </div>
        );
    };
}

export default AdminHome;