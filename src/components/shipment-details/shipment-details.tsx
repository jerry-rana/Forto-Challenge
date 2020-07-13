import React, { Component } from 'react';
import axios from 'axios';
import CSS from 'csstype';
import { Link } from 'react-router-dom';
import {RouteComponentProps} from 'react-router';

interface IMyProps {}
interface IMyState {
    details: {
        id: any,
        name: any, 
        cargo: any,
        mode: any,
        type: any,
        destination: any,
        origin: any,
        services: any,
        total: any,
        status: any,
        userId: any
    },
    isEdit: boolean
}
interface RouterParams {
    id: string
}

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL
})

export default class ShipmentDetails extends Component<IMyProps & RouteComponentProps<RouterParams>, IMyState>{
    constructor(props: any){
        super(props)
        this.state = {
            details: {
                id: '',
                name: '', 
                cargo: [],
                mode: '',
                type: '',
                destination: '',
                origin: '',
                services: [],
                total: '',
                status: '',
                userId: ''
            },
            isEdit: false
        }
    }

    getShipment = async () => {
        const { id } = this.props.match.params;
        let data = await api.get(`/${id}`).then(({ data }) => data)
            .catch(error => console.log(error));
        this.setState({ details: data });
    }

    updateShipment = async (id: any) => {
        await api.patch(`/${id}`, this.state.details)
            .catch(error => console.log(error));
        this.setState({ isEdit: false });
        this.getShipment();
        window.alert('Shipment name has been updated successfully.');
    }
       
    handleOnChange = (e:any) => {
        this.setState({details: {...this.state.details, [e.target.name]: e.target.value}})
    }

    componentDidMount() {
        this.getShipment();
    }

    render(){
        const { id, name, cargo, mode, type, destination, origin, services, total, status, userId  } = this.state.details;

        return(
            <div className="m-4">
                <Link to="/" className="btn btn-primary mb-3">Back</Link>
                <div className="card">
                    <div className="card-header d-flex justify-content-between">
                    <span><b>Id: </b>{id}</span>
                    <span><b>Type: </b>{type}</span>
                    <span><b>Mode: </b>{mode}</span>
                    <span><b>Status: </b>{status}</span>
                    </div>
                    <div className="card-body">
                        {!this.state.isEdit ?
                            <h5 className="card-title">
                                {name}
                                <span
                                    style={editIcon}
                                    className=" ml-3"
                                    title="Edit name"
                                    onClick={() => this.setState({ isEdit: true })}
                                >
                                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-pencil-square text-danger" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                        <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                    </svg>
                                </span>
                            </h5>
                            :
                            <div className="form-group d-flex">
                                <input type="text" required
                                    placeholder="Name"
                                    name="name"
                                    value={name}
                                    className="form-control flex-grow-1"
                                    onChange={(e) => this.handleOnChange(e)}
                                />
                                <button 
                                    className="btn btn-success ml-3"
                                    onClick={() => this.updateShipment(id)}
                                >Update</button>
                            </div>
                        }
                        <div className="p-4">
                            <div className="d-flex">
                                <div className="w-50 pr-4">
                                    <h5>Cargo</h5>
                                    <table className="table table-bordered bg-light">
                                        <thead>
                                            <tr>
                                                <th>Type</th>
                                                <th>Description</th>
                                                <th>Volume</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cargo.map((item: any, i: any) => {
                                                return <tr key={i}>
                                                    <td>{item.type}</td>
                                                    <td>{item.description}</td>
                                                    <td>{item.volume}</td>
                                                </tr>
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="w-50 pl-4">
                                    <h5>Services</h5>
                                    <table className="table table-bordered bg-light">
                                        <thead>
                                            <tr>
                                                <th>Type</th>
                                                <th>Value</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {services.map((item: any, i: any) => {
                                                return <tr key={i}>
                                                    <td>{item.type}</td>
                                                    <td>{item.value}</td>
                                                </tr>
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="card-text d-flex justify-content-between">
                            <p><b>Destination: </b>{destination}</p>
                            <p><b>Origin: </b>{origin}</p> 
                            <p><b>UserId: </b>{userId}</p> 
                        </div>
                        <div className="card-text d-flex justify-content-end">
                            <p><b>Total: </b>{total}</p> 
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
const editIcon: CSS.Properties = {
    cursor: 'pointer'
}