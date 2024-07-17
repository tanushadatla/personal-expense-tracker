import React, { useState, useEffect } from "react";
import { TrackContainer } from "./styledComponents";
import { NavLink } from 'react-router-dom';
import Cookies from 'js-cookies';
import LoaderSpinner from '../LoaderSpinner';
import { FaEdit, FaTrash, FaSave, FaDownload, FaPlus } from 'react-icons/fa';
import MyDocument from "../MyDocument";
import axios from 'axios'


import './index.css';

const Track = () => {
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [rowMonthId, setRowMonthId] = useState('')
    const [rowTableId, setRowTableId] = useState('')
    const [editRowId, setEditRowId] = useState(null);

    const [date, setDate] = useState('')
    const [name, setName] = useState('')
    const [amount, setAmount] = useState('')

    const [editRowData, setEditRowData] = useState({})
    const [editId, setEditId] = useState('')

    const apiStatusConstants = {
        initial: 'INITIAL',
        inProgress: 'INPROGRESS',
        success: 'SUCCESS',
        failure: 'FAILURE',
    };

    const [apiResponseData, setApiResponseData] = useState({
        status: apiStatusConstants.initial,
        data: [],
        errMsg: ''
    });

    const userName = Cookies.getItem('userName');

    const renderInProgress = () => {
        return (
            <LoaderSpinner />
        );
    };

    const renderFailure = () => {
        return (
            <div className="text-danger">Failure</div>
        );
    };

    const handleEditRow = async (expenseId, tableName, rowId) => {
        const response = await axios.get(`http://localhost:5100/expenses/${expenseId}/tables/${tableName}/rows/${rowId}`)
        setEditRowData(response.data)
        setEditId(rowId)
    };

    const submitEditedRow = async (monthId,tableName,rowId) => {
        const response = await axios.put(`http://localhost:5100/expenses/${monthId}/tables/${tableName}/rows/${rowId}`,editRowData)
        getData()
        setEditId('')
    };

    const handleDeleteRow = async (expenseId, tableName, rowId) => {
        try {
            const response = await fetch(`http://localhost:5100/expenses/${expenseId}/tables/${tableName}/rows/${rowId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                const data = await response.json();
                getData();
            } else {
                const errorData = await response.json();
                alert(errorData)
            }
        } catch (error) {
            alert('Error deleting table row:', error);
        }
    };

    const handleAddRow = async (month, table) => {
        const requestBody = {
            formData: { date, name, amount },
            monthId: month._id,
            tableName: table.tableName
        };

        try {
            const response = await fetch('http://localhost:5100/addRow', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                const data = await response.json();

                const dataResponse = await fetch('http://localhost:5100/expenses');
                const newData = await dataResponse.json();
                getData();
                setDate("")
                setName("")
                setAmount("")
            } else {
                alert('Error adding new row:', response);
            }
        } catch (error) {
            alert('Error adding new row:', error);
        }
    };

    

    const renderSuccessData = () => {
        return (
            <div>
                {apiResponseData.data.map((month, index) => (
                    <div key={index} className="mb-4 bg-white p-2 text-dark">
                        <div className="bg-white p-2 text-center w-100 text-dark" style={{ height: '8vh' }}>
                            <h1 style={{ fontWeight: 'bold' }}>{month.monthNumber}, {month.monthYear}</h1>
                        </div>
                        <div className="table-container" style={{ gap: '20px' }}>
                            {month.tables.map((table, tableIndex) => (
                                <table key={tableIndex} className="table table-bordered" style={{ borderBottom: '2px solid #000' }}>
                                    <thead className="table-white" style={{ borderBottom: '2px solid #000' }}>
                                        <tr>
                                            <th>{table.tableName}</th>
                                            {table.columns.map((column, columnIndex) => (
                                                <th key={columnIndex}>{column}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {table.rows.map((row, rowIndex) => (
                                            <tr key={rowIndex}>
                                                <td style={{ border: '1px solid #000' }} className="bg-white">
                                                    <div className="btn-group btn-table bg-white">
                                                        <button className="btn btn-outline-success btn-sm btn-table" style={{ borderRadius: '4px' }} onClick={() => { handleEditRow(month._id, table.tableName, row._id) }}>
                                                            <FaEdit />
                                                        </button>
                                                        <button className="btn btn-outline-danger btn-sm btn-table" style={{ borderRadius: '4px' }} onClick={() => { handleDeleteRow(month._id, table.tableName, row._id) }}>
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                </td>
                                                {editId != row._id ? <>
                                                    <td className="text-dark bg-white">{row.date}</td>
                                                    <td className="text-dark bg-white">{row.name}</td>
                                                    <td className="text-dark bg-white">{row.amount}</td>
                                                </> :
                                                    <>
                                                        <td className="bg-white" style={{ border: "2px solid #000" }}>
                                                            <input
                                                                className="form-control"
                                                                type="text"
                                                                value={editRowData.date}
                                                                onChange={(e) => setEditRowData({ ...editRowData, date: e.target.value })}
                                                            />
                                                        </td>
                                                        <td className="bg-white" style={{ border: "4px solid #000" }}>
                                                            <input
                                                                className="form-control"
                                                                type="text"
                                                                value={editRowData.name}
                                                                onChange={(e) => setEditRowData({ ...editRowData, name: e.target.value })}
                                                            />
                                                        </td>
                                                        <td className="bg-white" style={{ border: "4px solid #000" }}>
                                                            <input
                                                                className="form-control"
                                                                type="text"
                                                                value={editRowData.amount}
                                                                onChange={(e) => setEditRowData({ ...editRowData, amount: e.target.value })}
                                                            />
                                                        </td>
                                                        <td className="bg-white" style={{ border: "4px solid #000" }}>
                                                            <button
                                                                className="btn btn-outline-primary"
                                                                onClick={() => {submitEditedRow(month._id,table.tableName,row._id)}}
                                                            >
                                                                Save
                                                            </button>
                                                        </td>
                                                    </>
                                                }
                                            </tr>
                                        ))}
                                        <tr>
                                            <td style={{ border: '1px solid #000' }} className="bg-white">
                                                <button className="btn btn-outline-primary btn-table w-100" style={{ borderRadius: '2px' }} onClick={() => handleAddRow(month, table)}>
                                                    <FaPlus />
                                                </button>
                                            </td>
                                            <td className="bg-white" style={{ border: "1px solid #000" }}>
                                                <input className="form-control" value={rowMonthId === month._id && rowTableId === table._id ? date : ''} onChange={(e) => { setDate(e.target.value); setRowMonthId(month._id); setRowTableId(table._id) }} type="number" placeholder="Enter date" />
                                            </td>
                                            <td className="bg-white" style={{ border: "1px solid #000" }}>
                                                <input className="form-control" value={rowMonthId === month._id && rowTableId === table._id ? name : ''} onChange={(e) => { setName(e.target.value); setRowMonthId(month._id); setRowTableId(table._id) }} type="text" placeholder="Enter name" />
                                            </td>
                                            <td className="bg-white" style={{ border: "1px solid #000" }}>
                                                <input className="form-control" value={rowMonthId === month._id && rowTableId === table._id ? amount : ''} onChange={(e) => { setAmount(e.target.value); setRowMonthId(month._id); setRowTableId(table._id) }} type="number" placeholder="Enter amount" />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            ))}
                            {/* Rest of the content */}
                        </div>
                        <div className="w-100 mt-4">
                            <h3 className="table-title text-dark">Calculations</h3>
                            <table className="table w-100">
                                <thead className="thead-light">
                                    <tr className="text-dark">
                                        <th style={{ border: '2px solid #000' }}>Total Income</th>
                                        <th style={{ border: '2px solid #000' }}>Total Expense</th>
                                        <th style={{ border: '2px solid #000' }}>Current Savings</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="text-dark">
                                        <td style={{ border: '2px solid #000', width: '33%' }}>
                                            {month.calculations.totalIncome}
                                        </td>
                                        <td style={{ border: '2px solid #000', width: '33%' }}>
                                            {month.calculations.totalExpense}
                                        </td>
                                        <td style={{ border: '2px solid #000', width: '33%' }}>
                                            {month.calculations.currentAmount}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            {/* <div className="w-100 d-flex justify-content-end mb-4 mt-2">
                                <button className="btn btn-outline-success" onClick={() => { exportPdfe(month) }}>
                                    <FaDownload /> Download PDF
                                </button>
                            </div> */}
                            {month.calculations.totalExpense > month.calculations.totalIncome / 2 ?
                                <div className="w-100 p-4" style={{ backgroundColor: '#feebc6', borderRadius: '20px' }}>
                                    <div className="w-100 p-4" style={{ backgroundColor: '#feebc6', borderRadius: '20px' }}>
                                        <h4 className="text-danger">
                                            You have exceeded your limit in this month. You shouldn't spend more than half of your income.
                                        </h4>
                                    </div>

                                </div> : ''
                            }
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const getData = async () => {
        const api = 'http://localhost:5100/expenses';
        const userId = Cookies.getItem('userId');
        const options = {
            method: 'GET',
        };
        try {
            setApiResponseData({ ...apiResponseData, status: apiStatusConstants.inProgress });
            const response = await fetch(`${api}/${userId}`, options);
            if (response.ok) {
                const data = await response.json();
                console.log(data)
                setApiResponseData({ ...apiResponseData, status: apiStatusConstants.success, data });
            } else if (response.status === 401) {
                setApiResponseData({ ...apiResponseData, status: apiStatusConstants.failure, errMsg: 'Unauthorized user!' });
            }
        } catch (error) {
            console.error('Error during data fetching:', error);
        }
    };

    const renderApiStatus = () => {
        const apiStatus = apiResponseData.status;
        switch (apiStatus) {
            case apiStatusConstants.inProgress:
                return renderInProgress();
            case apiStatusConstants.failure:
                return renderFailure();
            case apiStatusConstants.success:
                return renderSuccessData();
            default:
                return null;
        }
    };

    useEffect(() => {
        getData();
        renderApiStatus();
    }, []);

    return (
        <div className="w-100" style={{ backgroundColor: '#fff', color: '#000', border: '2px solid #000' }}>
    <TrackContainer className="w-100">
        <div className="d-flex w-100">
            <div className="months-container" style={{ backgroundColor: '#fff', color: '#000', border: '2px solid #000' }}>
                        <h1 className="text-dark">Welcome Back, {userName}</h1>
                        <div className="header-container p-4 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#fff', color: '#000', border: '1px solid #000', gap: '5px' , height: '50px'  }}>
                            <h5 className="text-dark" style={{ textAlign: 'center', width: '100%' }}>Start Tracking your Expenses</h5>


                            {/* <NavLink to="/add-expense" className="w-100 btn btn-outline-success">
                                Add New Month
                            </NavLink> */}
                            {/* <input
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                placeholder="Year"
                                className="w-100"
                                style={{
                                    padding: '6px 10px',
                                    outline: 'none',
                                    border: '1px solid #000',
                                    outline: '1px solid #000',
                                    borderRadius: '4px',
                                    backgroundColor: 'transparent',
                                    color: '#000'
                                }}
                            /> */}
                            {/* <input
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                                placeholder="Month Number"
                                className="w-100"
                                style={{
                                    padding: '6px 10px',
                                    outline: 'none',
                                    border: '1px solid #000',
                                    outline: '1px solid #000',
                                    borderRadius: '4px',
                                    backgroundColor: 'transparent',
                                    color: '#000'
                                }}
                            /> */}
                            {/* <button className="w-100 btn btn-outline-dark">
                                <i className="fa fa-arrow-left"></i><span className="text-dark"> Delete Month</span>
                            </button> */}
                        </div>
                        {/* <div className="text-secondary">
                            If you want to add a new month's Earnings and Expenditure, you can click on <NavLink to="/add-expense">Add New Month</NavLink> button.
                        </div> */}
                        {renderApiStatus()}
                    </div>
                </div>
            </TrackContainer>
        </div>
    );
};

export default Track;

