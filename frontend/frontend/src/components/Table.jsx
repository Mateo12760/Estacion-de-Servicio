// src/components/Table.jsx
import React, { useState } from 'react';

const Table = ({ data = [], columns = [], onEdit, onDelete, searchPlaceholder = 'Buscar...' }) => {
  const [searchText, setSearchText] = useState('');

  // Filtrar datos según búsqueda
  const filteredData = data.filter((item) =>
    columns.some((col) => {
      const value = item[col.accessor];
      return value && value.toString().toLowerCase().includes(searchText.toLowerCase());
    })
  );

  return (
    <div>
      {/* Input de búsqueda */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder={searchPlaceholder}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* Tabla */}
      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            {columns.map((col) => (
              <th key={col.accessor}>{col.header}</th>
            ))}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} className="text-center">
                No hay datos para mostrar
              </td>
            </tr>
          ) : (
            filteredData.map((item) => (
              <tr key={item.id}>
                {columns.map((col) => (
                  <td key={col.accessor}>{item[col.accessor]}</td>
                ))}
                <td>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => onEdit && onEdit(item)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => onDelete && onDelete(item.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
