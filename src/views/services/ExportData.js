// /* eslint-disable no-use-before-define */
// /* eslint-disable no-underscore-dangle */
// import React, { useState } from 'react';
// import { Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
// import CsLineIcons from 'cs-line-icons/CsLineIcons';
// import axios from 'axios';
// import { saveAs } from 'file-saver';
// import { parse } from 'json2csv';
// import * as XLSX from 'xlsx';
// import { toast } from 'react-toastify';
// import baseURL from '../../baseURL';

// const getToken = () => {
//   return localStorage.getItem('token');
// };

// const ExportDropdown = ({ searchQuery }) => {
//   const [loading, setLoading] = useState(false);

//   const fetchData = async () => {
//     const token = getToken();
//     try {
//       const response = await axios.get(`${baseURL}/api/sender/export?search=${searchQuery}`, {
//         headers: {
//           'x-auth-token': token,
//         },
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching sender data:', error);
//       return [];
//     }
//   };

//   const handleExport = async (format) => {
//     setLoading(true);
//     const data = await fetchData();
//     if (!data.length) {
//       alert('No Data Available For Export.');
//       setLoading(false);
//       return;
//     }

//     switch (format) {
//       case 'copy':
//         handleCopy(data);
//         break;
//       case 'excel':
//         handleExcel(data);
//         break;
//       case 'csv':
//         handleCSV(data);
//         break;
//       default:
//         break;
//     }
//     setLoading(false);
//   };

//   const handleCopy = (data) => {
//     const text = data.map((sender) => `${sender.name}, ${sender.email}`).join('\n');
//     navigator.clipboard
//       .writeText(text)
//       .then(() => {
//         toast.success('Data Copied To Clipboard');
//       })
//       .catch((err) => {
//         toast.error('Error Copying Data To clipboard:', err);
//       });
//   };

//   const handleCSV = (data) => {
//     const fields = ['name', 'email'];
//     const csv = parse(data, { fields });
//     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//     saveAs(blob, 'senders.csv');
//   };

//   const handleExcel = (data) => {
//     const worksheet = XLSX.utils.json_to_sheet(data);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Senders');
//     const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
//     const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
//     saveAs(blob, 'senders.xlsx');
//   };

//   return (
//     <Dropdown align={{ xs: 'end' }} className="d-inline-block ms-1">
//       <OverlayTrigger delay={{ show: 1000, hide: 0 }} placement="top" overlay={<Tooltip id="tooltip-top">Export</Tooltip>}>
//         <Dropdown.Toggle variant="foreground-alternate" className="dropdown-toggle-no-arrow btn btn-icon btn-icon-only shadow" disabled={loading}>
//           <CsLineIcons icon="download" />
//         </Dropdown.Toggle>
//       </OverlayTrigger>
//       <Dropdown.Menu className="shadow dropdown-menu-end">
//         <Dropdown.Item onClick={() => handleExport('copy')}>Copy</Dropdown.Item>
//         <Dropdown.Item onClick={() => handleExport('excel')}>Excel</Dropdown.Item>
//         <Dropdown.Item onClick={() => handleExport('csv')}>CSV</Dropdown.Item>
//       </Dropdown.Menu>
//     </Dropdown>
//   );
// };

// export default ExportDropdown;
import React from 'react'

const ExportData = () => {
  return (
    <div>ExportData</div>
  )
}

export default ExportData