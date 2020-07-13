import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CSS from 'csstype';
import { StateData } from '../../interfaces/shipment.interface';

interface IMyProps {}
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL
})

export default class Shipments extends Component<IMyProps, StateData> {
    private searchRef: React.RefObject<HTMLInputElement>;
    constructor(props: any){
        super(props);
        this.state = {
            data: [],
            currPage: 1,
            perPage: 20,
            activeIndex: 0,
            isSearch: false,
            searchedData: [],
            isError: false,
            ascending: true
        }
        this.searchRef = React.createRef();
    }

    handlePageNav(parm: number, index: number) {
        this.setState({
            currPage: parm,
            activeIndex: index
        })
    }

    handleSearchClick = () => {
        const searchInputValue = this.searchRef.current.value.toUpperCase();
        let searchedItem = this.state.data.find((item: any) => item.id === searchInputValue);
        searchedItem === undefined ?
            this.setState({
                isError: true
            })
        :
        this.setState({
            searchedData: searchedItem,
            isSearch: true,
            isError: false
        });

    }

    handleAllShipmentsButton = () => {
        this.setState({
            data: this.state.data,
            isSearch: false,
            isError: false,
        })
        this.searchRef.current.value = '';
    }

    getShipments = async (parm: any) => {
        let data = await api.get(`/${parm}`).then(({ data }) => data)
            .catch(error => console.log(error));
        this.setState({ data });
    }

    componentDidMount() {
        this.getShipments('?_sort=name&_order=asc');
    }

    render(){
        const { data, currPage, perPage, activeIndex, isSearch, searchedData, isError } = this.state;

        // pagination
        const indexOfLastShipment = currPage * perPage;
        const indexOfFirstShipment = indexOfLastShipment - perPage;
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(data.length / perPage); i++) {
            pageNumbers.push(i);
        }
        const getPages = pageNumbers.map((count, i:number) => {
            return (
                <li
                    key={count}
                    className="list-inline-item"
                    onClick={() => this.handlePageNav(count, i)}
                >
                    <button className={`btn btn-info ${i === activeIndex ? "disabled" : ""}`}>
                        {count}
                    </button>
                </li>
            );
        })

        // render data
        let currData = isSearch ? [searchedData] : (data.slice(indexOfFirstShipment, indexOfLastShipment));
        const getData = currData.map((res: any) => {
            return (
                    <tr key={res.id} title="Click on Id to view details page">
                        <td><Link to={`/shipment-details/${res.id}`}>{res.id}</Link></td>
                        <td>{res.name}</td>
                        <td>{res.cargo.length}</td>
                        <td>{res.mode}</td>
                        <td>{res.type}</td>
                        <td>{res.destination}</td>
                        <td>{res.origin}</td>
                        <td>{res.services.length}</td>
                        <td>{res.total}</td>
                        <td>{res.status}</td>
                        <td>{res.userId}</td>
                    </tr>
            )
        })

        return (
            <div className="p-4">
                <div className="d-flex justify-content-between">
                    <div className="d-flex align-items-center">
                        {(isSearch || isError) ?
                            <div className="d-flex align-items-center">
                                <button
                                    className="btn btn-primary ml-2"
                                    onClick={() => this.handleAllShipmentsButton()}
                                >All Shipments</button>
                                <p className="pl-4 mb-0">Search result</p>
                            </div>
                            :
                            <>
                                <ul className="list-inline">{getPages}</ul>
                                <p className="pl-4">Showing shipments {currData.length} of {data.length}</p>
                            </>
                        }
                    </div>
                    <div className="d-flex form-group">
                        <input 
                            type="text" 
                            className="form-control"
                            placeholder="Search by Id" 
                            ref={this.searchRef}
                        ></input>
                        <button 
                            className="btn btn-primary ml-2" 
                            onClick={() => this.handleSearchClick()}
                        >Search</button>
                    </div>
                </div>
                <table className={"table table-bordered table-hover"}>
                    <thead>
                        <tr className="text-capitalize text-info">
                            <th>
                                <span className="d-flex justify-content-between">
                                    <span>Id</span>
                                    <span
                                        style={sorting}
                                        title="Click to sorting"
                                    >
                                        <svg onClick={() => this.getShipments('?_sort=id&_order=desc')} width="1em" height="1em" viewBox="0 0 16 10" className="d-block" fill={"currentColor"} xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7.247 4.86l-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                                        </svg>
                                        <svg onClick={() => this.getShipments('?_sort=id&_order=asc')} width="1em" height="1em" viewBox="0 0 16 16" className="d-block" fill={ "currentColor"} xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                                        </svg>
                                    </span>
                                </span>
                            </th>
                            <th>
                                <span className="d-flex justify-content-between">
                                    <span>name</span>
                                    <span
                                        style={sorting}
                                        title="Click to sorting"
                                    >
                                        <svg onClick={() => this.getShipments('?_sort=name&_order=desc')} width="1em" height="1em" viewBox="0 0 16 10" className="d-block" fill={"currentColor"} xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7.247 4.86l-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                                        </svg>
                                        <svg onClick={() => this.getShipments('?_sort=name&_order=asc')} width="1em" height="1em" viewBox="0 0 16 16" className="d-block" fill={ "currentColor"} xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                                        </svg>
                                    </span>
                                </span>
                            </th>
                            <th>cargo</th>
                            <th>Mode</th>
                            <th>Type</th>
                            <th>destination</th>
                            <th>origin</th>
                            <th>services</th>
                            <th>total</th>
                            <th>
                                <span className="d-flex justify-content-between">
                                    <span>Status</span>
                                    <span
                                        style={sorting}
                                        title="Click to sorting"
                                    >
                                        <svg onClick={() => this.getShipments('?_sort=status&_order=desc')} width="1em" height="1em" viewBox="0 0 16 10" className="d-block" fill={"currentColor"} xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7.247 4.86l-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                                        </svg>
                                        <svg onClick={() => this.getShipments('?_sort=status&_order=asc')} width="1em" height="1em" viewBox="0 0 16 16" className="d-block" fill={ "currentColor"} xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                                        </svg>
                                    </span>
                                </span>
                            </th>
                            <th>userid</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!isError ?
                            getData
                            :
                            <tr>
                                <td colSpan={11}>No shipment found.</td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        );
    }

}

const sorting: CSS.Properties = {
    cursor: 'pointer'
}