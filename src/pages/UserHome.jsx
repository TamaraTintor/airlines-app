import React, { Component } from 'react';
import { Button/*, Modal, ModalBody, InputGroup, InputGroupAddon*/, Container, Table/*, Input*/ } from 'reactstrap';
import 'react-toastify/dist/ReactToastify.css';
import '../index.css';
import { checkIfLogged } from '../common.js'

class UserHome extends Component {

    constructor(props) {
        super(props);

            checkIfLogged().then(resp => {
                if (!resp) {
                    this.props.history.push('/user')
                }
                
            });

        this.logOut = this.logOut.bind(this);
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
        console.log("RENDER:")
        console.log(this.state);
        return (
            <div style={{   backgroundColor: '#923cb5', backgroundImage: ` linear-gradient(#7732a8, pink)`,
            margin: 0, height: '100vh', width: '100%', justifyContent: 'center', alignItems: 'center', }}>
                
                <Container>
                    <Table>
                        <tbody>
                            <tr>
                                <td><h1 style={{ color: "#923cb5" }}>User Page</h1></td>
                                <td><Button style={{ backgroundColor: "#42378F" }} onClick={this.logOut}>Log out</Button></td>
                            </tr>
                        </tbody>
                    </Table>
                    <p>USPJELA SI JELENA</p>
                </Container>
                
            </div>
        );
    };

}

export default UserHome