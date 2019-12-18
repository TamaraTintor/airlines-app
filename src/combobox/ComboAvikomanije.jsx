import React, { Component } from 'react';
import '../index.css';

class ComboAviokompanije extends Component {
    constructor(props) {
        super(props)

        this.state = { airCompany: [] }

        this.loadDataAktivni = this.loadDataAktivni.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    loadData() {
        fetch('/api/airCompany')
            .then(response => response.json())
            .then(data => { console.log(this.state); this.setState({ airCompany: data }) });
    }

    loadDataAktivni() {
        fetch('/api/airCompany/aktivni')
            .then(response => response.json())
            .then(data => { console.log(this.state); this.setState({ airCompany: data }) });
    }

    handleChange = (event) => {
        let selectedValue = event.target.value;
        this.props.onSelectChange(selectedValue);
    }

    componentDidMount() {
        this.loadDataAktivni();
    }

    render() {
        let airCompany = [...this.state.airCompany];
        return (
            <select name="customSearch" className="combo" onChange={this.handleChange}>
                <option value="" selected disabled hidden>Izaberite aviokompaniju: </option>
                {
                    airCompany.map((kompanije) =>                   
                        <option key={kompanije.id} value={kompanije.name}>
                            {kompanije.name}
                        </option>
                    )}
            </select>
        )
    }
}

export default ComboAviokompanije;