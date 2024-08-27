import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Receipt = () => {
    const [companyInfo, setCompanyInfo] = useState({
        name: '',
        address: '',
        phone: ''
    });

    const [products, setProducts] = useState([{ description: '', qty: '', unit: '', rate: '', total: 0 }]);

    const [suggestions] = useState(["PLY 18MM", "PLY 12MM", "ADHESIVE 50 KG", "TAPE ROLL"]);

    const handleCompanyInfoChange = (e) => {
        setCompanyInfo({
            ...companyInfo,
            [e.target.name]: e.target.value,
        });
    };

    const addProductRow = () => {
        setProducts([...products, { description: '', qty: 0, unit: '', rate: 0, total: 0 }]);
    };

    const handleInputChange = (index, event) => {
        const { name, value } = event.target;
        const newProducts = [...products];
        newProducts[index][name] = value;
    
        if (name === 'qty' || name === 'rate') {
            const qty = newProducts[index].qty ? parseFloat(newProducts[index].qty) : 0;
            const rate = newProducts[index].rate ? parseFloat(newProducts[index].rate) : 0;
            newProducts[index].total = qty * rate;
        }
    
        setProducts(newProducts);
    };
    

    const removeProductRow = (index) => {
        const newProducts = products.filter((_, i) => i !== index);
        setProducts(newProducts);
    };

    const totalAmount = products.reduce((acc, product) => acc + product.total, 0);

    const generatePDF = () => {
        const doc = new jsPDF();

        // Title and Company Info
        doc.setFontSize(16);
        doc.text('ESTIMATE', 105, 20, { align: 'center' });

        doc.setFontSize(12);
        doc.text("Name : "+companyInfo.name, 20, 30);
        doc.text("Address : "+companyInfo.address, 20, 36);
        doc.text(`Phone: ${companyInfo.phone}`, 20, 42);

        // Table Headers and Data
        doc.autoTable({
            startY: 50,
            head: [['S.No', 'Item Description', 'Qty', 'Unit', 'Rate/Unit', 'Total']],
            body: products.map((product, index) => [
                index + 1,
                product.description,
                product.qty,
                product.unit,
                product.rate,
                product.total
            ]),
            theme: 'grid',
            styles: {
                fontSize: 10,
                cellPadding: 1,
                lineColor: [0, 0, 0], // Set border color to black
                lineWidth: 0.3,       // Border thickness
            },
            headStyles: {
                fillColor: [240, 240, 240],
                textColor: [0, 0, 0],
                halign: 'center',
            },
            bodyStyles: {
                halign: 'center',
                textColor: [0, 0, 0],
            },
            columnStyles: {
                0: { halign: 'center' }, // S.No
                1: { halign: 'left' },   // Item Description
                2: { halign: 'center' }, // Qty
                3: { halign: 'center' }, // Unit
                4: { halign: 'center' }, // Rate/Unit
                5: { halign: 'center' }, // Total
            },
            foot: [['', '', '', '', 'Total Amount:',`${totalAmount}`+" Rs"]],
            footStyles: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                halign: 'center',
                fontStyle: 'bold',
            },
            // didDrawCell: (data) => {
            //     if (data.column.index === 5 && data.section === 'foot') {
            //         doc.setFontSize(10);
            //         doc.setTextColor(0, 0, 0);
            //     }
            // },
        });

        // Total Amount
        doc.setFontSize(12);
        doc.save(`${companyInfo.name+"_estimate.pdf"}`);
    };

    return (
        <div className="container mt-4">
            <h1 className="mb-4 text-center">Receipt Generator</h1>
            <div className="card p-4 shadow-sm">
                <form>
                    <div className="row mb-3">
                        <div className="col-md-4">
                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                value={companyInfo.name}
                                onChange={handleCompanyInfoChange}
                                placeholder="Name"
                            />
                        </div>
                        <div className="col-md-4">
                            <input
                                type="text"
                                name="address"
                                className="form-control"
                                value={companyInfo.address}
                                onChange={handleCompanyInfoChange}
                                placeholder="Address"
                            />
                        </div>
                        <div className="col-md-4">
                            <input
                                type="text"
                                name="phone"
                                className="form-control"
                                value={companyInfo.phone}
                                onChange={handleCompanyInfoChange}
                                placeholder="Phone Number"
                            />
                        </div>
                    </div>

                    {products.map((product, index) => (
                        <div className="row mb-3" key={index}>
                            <div className="col-md-4">
                                <input
                                    type="text"
                                    name="description"
                                    list="product-suggestions"
                                    className="form-control"
                                    value={product.description}
                                    onChange={(e) => handleInputChange(index, e)}
                                    placeholder="Item Description"
                                />
                                <datalist id="product-suggestions">
                                    {suggestions.map((suggestion, idx) => (
                                        <option key={idx} value={suggestion} />
                                    ))}
                                </datalist>
                            </div>
                            <div className="col-md-2">
                                <input
                                    type="number"
                                    name="qty"
                                    className="form-control"
                                    value={product.qty}
                                    onChange={(e) => handleInputChange(index, e)}
                                    placeholder="Qty"
                                />
                            </div>
                            <div className="col-md-2">
                                <input
                                    type="text"
                                    name="unit"
                                    className="form-control"
                                    value={product.unit}
                                    onChange={(e) => handleInputChange(index, e)}
                                    placeholder="Unit"
                                />
                            </div>
                            <div className="col-md-2">
                                <input
                                    type="number"
                                    name="rate"
                                    className="form-control"
                                    value={product.rate}
                                    onChange={(e) => handleInputChange(index, e)}
                                    placeholder="Rate"
                                />
                            </div>
                            <div className="col-md-2 d-flex align-items-center">
                                <span className="me-2">₹{product.total}</span>
                                <button
                                    type="button"
                                    className="btn btn-danger btn-sm"
                                    onClick={() => removeProductRow(index)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                    <div className="row">
                        <div className="col-md-12 text-center">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={addProductRow}
                            >
                                Add Product
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <div className="mt-4 text-center">
                <h2>Total Amount: ₹{totalAmount}</h2>
                <button
                    type="button"
                    className="btn btn-warning"
                    onClick={generatePDF}
                >
                    Generate PDF
                </button>
            </div>
        </div>
    );
};

export default Receipt;
