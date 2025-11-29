import React from 'react';
import QRCode from 'react-qr-code';

const QRCodeGenerator = ({ value, label }) => {
    return (
        <div className="flex flex-col items-center p-4 bg-white rounded-xl shadow-md border border-gray-100">
            <div className="bg-white p-2 rounded-lg">
                <QRCode value={value} size={150} />
            </div>
            {label && <p className="mt-3 text-sm font-medium text-gray-600">{label}</p>}
            <button className="mt-4 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors">
                Download / Share
            </button>
        </div>
    );
};

export default QRCodeGenerator;
