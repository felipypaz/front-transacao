'use client'
import styles from "./page.module.css";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ITEMS_PER_PAGE = 10; // Define o número de itens por página

export default function Home() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [paginatedData, setPaginatedData] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [filterAmount, setFilterAmount] = useState('');

  useEffect(() => {
    fetchData();
  }, []); // Chama a função fetchData uma vez quando o componente é montado

  useEffect(() => {
    paginateData();
  }, [data, currentPage, filterType, filterAmount]); // Atualiza a página atualizada ou os dados quando necessário

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/transacoes');
      setData(response.data);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const paginateData = () => {
    let filteredData = data;

    // Aplica filtros
    if (filterType) {
      filteredData = filteredData.filter(transaction => transaction.type === filterType);
    }
    if (filterAmount) {
      filteredData = filteredData.filter(transaction => `${transaction.amount}`.startsWith(filterAmount));
    }

    // Atualiza o total de páginas de acordo com os dados filtrados
    setTotalPages(Math.ceil(filteredData.length / ITEMS_PER_PAGE));

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setPaginatedData(filteredData.slice(startIndex, endIndex));
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleFilterTypeChange = (event) => {
    setFilterType(event.target.value);
    setCurrentPage(1); // Retorna para a primeira página ao aplicar um filtro
  };

  const handleFilterAmountChange = (event) => {
    setFilterAmount(event.target.value);
    setCurrentPage(1); // Retorna para a primeira página ao aplicar um filtro
  };

  return (
    <main className={styles.main}>
      <h1>Transações</h1>
      <div className={styles.filters}>
        <label htmlFor="filterType">Filtrar por tipo:</label>
        <select id="filterType" value={filterType} onChange={handleFilterTypeChange}>
          <option value="">Todos</option>
          <option value="credit">Crédito</option>
          <option value="debit">Débito</option>
        </select>
        <label htmlFor="filterAmount"> Filtrar por quantidade:</label>
        <input type="text" id="filterAmount" value={filterAmount} onChange={handleFilterAmountChange} />
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Amount</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.idempotencyId}</td>
                <td>{transaction.amount}</td>
                <td>{transaction.type}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">Nenhum item encontrado.</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className={styles.pagination}>
        <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}> Anterior </button>
        <span> Página {currentPage} de {totalPages} </span>
        <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}> Próxima </button>
      </div>
    </main>
  );
}
