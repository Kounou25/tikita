'use client';
import { useState } from 'react';

export default function Home() {
  const [customer, setCustomer] = useState('');
  const [email, setEmail] = useState('');
  const [items, setItems] = useState([{ description: '', quantity: 1, price: 0 }]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await fetch('/api/invoice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer, email, items })
    });

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Tikita-pro recu ${customer}`;
    a.click();
  };

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1 , price: 2 }]);
  };

  return (
    <>
      <div className="form-container">
        <h1 >TIKITA PRO </h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nom du client"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Numero de telephone"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {items.map((item, index) => (
            <div className="item" key={index}>
              <input
                type="text"
                placeholder=" description"
                value={item.description}
                onChange={(e) => {
                  const newItems = [...items];
                  newItems[index].description = e.target.value;
                  setItems(newItems);
                }}
              />
              <input
                type="number"
                placeholder=" Quantite"
                value={item.quantity || ""}
                onChange={(e) => {
                  const newItems = [...items];
                  newItems[index].quantity = e.target.value;
                  setItems(newItems);
                }}
              />
              <input
                type="number"
                placeholder=" prix"
                value={item.price || ""}
                onChange={(e) => {
                  const newItems = [...items];
                  newItems[index].price = e.target.value;
                  setItems(newItems);
                }}
              />
            </div>
          ))}

          <button className="add-item-btn" type="button" onClick={addItem}>
            ajouter a la facture
          </button>
          <button className="submit-btn" type="submit">
            Generer le recu
          </button>
        </form>
      </div>

      <footer>
        <p><strong>TIKITA PRO V1</strong></p>
        <p>Créée avec ❤️ par <a href="https://wa.me/22788715276" target="_blank">Kounou Gilbert</a></p>
        </footer>
        <script src="https://feedyourback.com/tunnel.js" data-id='cm2hf1xnk02ikuwx1qyjef01w' defer ></script>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');

        .form-container {
          max-width: 600px;
          margin: 60px auto;
          padding: 30px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
          font-family: 'Inter', sans-serif;
          color: black;
        }

        h1 {
          text-align: center;
          font-size: 2.2rem;
          margin-bottom: 1.5rem;
          font-weight: 600;
        }

        input {
          width: 100%;
          padding: 14px;
          margin-bottom: 20px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 1rem;
          background: rgba(0, 0, 0, 0.05);
          color: black;
          transition: background 0.3s ease, box-shadow 0.3s ease;
        }

        input:focus {
          background: rgba(0, 0, 0, 0.1);
          box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
          outline: none;
        }

        .item {
          display: flex;
          gap: 15px;
        }

        .item input {
          flex: 1;
        }

        .add-item-btn {
          width: 100%;
          padding: 12px;
          background-color: #ff9800;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
          margin-bottom: 20px;
        }

        .add-item-btn:hover {
          background-color: #e68900;
        }

        .submit-btn {
          width: 100%;
          padding: 15px;
          background-color: #2196f3;
          color: white;
          border: none;
          font-size: 1.2rem;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .submit-btn:hover {
          background-color: #1e88e5;
        }

        footer {
          text-align: center;
          padding: 20px;
          color : white;
          margin-top: 40px;
        }

        footer p {
          margin: 0;
        }

        footer a {
          color: #2196f3;
          text-decoration: none;
        }

        @media (max-width: 600px) {
          .item {
            flex-direction: column;
          }

          h1 {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </>
  );
}
