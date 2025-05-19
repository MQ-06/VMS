// src/features/administrative_reports/components/ReportTable.jsx
import React from 'react';

const ReportTable = ({ title, data, loading }) => {
  return (
    <div className="overflow-x-auto rounded shadow-sm border border-gray-200">
      <h2 className="bg-blue-900 text-white p-3 font-semibold">{title}</h2>
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            {data.length > 0 &&
              Object.keys(data[0]).map(key => (
                <th key={key} className="p-3 text-left capitalize">{key.replace(/([A-Z])/g, ' $1')}</th>
              ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={10} className="p-4 text-center">Loading...</td></tr>
          ) : data.length === 0 ? (
            <tr><td colSpan={10} className="p-4 text-center text-gray-500">No data found.</td></tr>
          ) : (
            data.map((row, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50">
                {Object.values(row).map((val, i) => (
                  <td key={i} className="p-3">{String(val)}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReportTable;
