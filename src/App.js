import React, { useState, useEffect } from "react";

import axios from "axios";

import "./App.css"; // Verlinke die CSS-Datei
 
const App = () => {

  const [data, setData] = useState([]);

  const [filteredData, setFilteredData] = useState([]);

  const [filters, setFilters] = useState({

    databaseName: "",

    schemaName: "",

    objectName: "",

    indexType: "",

    avgFragmentationInPercent: {

      operator: "equal",

      value: "",

    },

  });

  const [currentPage, setCurrentPage] = useState(1); // Aktuelle Seite

  const [itemsPerPage, setItemsPerPage] = useState(10); // Einträge pro Seite
 
  // Lädt die Daten von der API

  useEffect(() => {

    const fetchData = async () => {

      try {

        const response = await axios.get("http://localhost:5000/api/avgfrag");

        setData(response.data);

        setFilteredData(response.data); // Initial mit allen Daten

      } catch (error) {

        console.error("Error fetching data: ", error);

      }

    };
 
    fetchData();

  }, []);
 
  // Filteränderung behandeln

  const handleFilterChange = (e) => {

    const { name, value } = e.target;

    setFilters((prev) => ({

      ...prev,

      [name]: value,

    }));

  };
 
  const handleAvgFragmentationChange = (e) => {

    const { name, value } = e.target;

    setFilters((prev) => ({

      ...prev,

      avgFragmentationInPercent: {

        ...prev.avgFragmentationInPercent,

        [name]: value,

      },

    }));

  };
 
  // Filter anwenden

  const applyFilters = () => {

    const filtered = data.filter((row) => {

      return (

        (filters.databaseName ? row.DatabaseName.includes(filters.databaseName) : true) &&

        (filters.schemaName ? row.SchemaNames.includes(filters.schemaName) : true) &&

        (filters.objectName ? row.ObjectName.includes(filters.objectName) : true) &&

        (filters.indexType ? row.IndexType.includes(filters.indexType) : true) &&

        (filters.avgFragmentationInPercent.value

          ? filterAvgFragmentation(row.AvgFragmentationInPercent)

          : true)

      );

    });

    setFilteredData(filtered);

    setCurrentPage(1); // Zurück zur ersten Seite, wenn Filter angewendet werden

  };
 
  // Filter für AvgFragmentationInPercent anwenden

  const filterAvgFragmentation = (value) => {

    const { operator, value: filterValue } = filters.avgFragmentationInPercent;

    if (!filterValue) return true;
 
    const numberValue = parseFloat(filterValue);

    switch (operator) {

      case "greater":

        return value > numberValue;

      case "less":

        return value < numberValue;

      case "equal":

        return value === numberValue;

      default:

        return true;

    }

  };
 
  // Hilfsfunktionen um die einzigartigen Werte für Dropdowns zu extrahieren

  const getUniqueValues = (field) => {

    return [...new Set(data.map((item) => item[field]))];

  };
 
  // Berechnen der angezeigten Daten basierend auf der aktuellen Seite und der Anzahl der Einträge pro Seite

  const indexOfLastItem = currentPage * itemsPerPage;

  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
 
  // Seitenanzahl berechnen

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
 
  // Seitenwechsel

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
 
  // Änderung der Einträge pro Seite

  const handleItemsPerPageChange = (e) => {

    setItemsPerPage(Number(e.target.value));

    setCurrentPage(1); // Zurück zur ersten Seite, wenn sich die Anzahl der Einträge pro Seite ändert

  };
 
  // Funktion, um Filter anzuwenden, wenn Enter gedrückt wird

  const handleKeyPress = (e) => {

    if (e.key === "Enter") {

      applyFilters();

    }

  };
 
  return (
<div className="App">
<h1>AvgFrag Tabelle</h1>
<div className="filters">

        {/* Filter für alle Spalten */}
<div className="filter-row">

          {/* Database Name Filter */}
<input

            type="text"

            name="databaseName"

            placeholder="Filter DatabaseName"

            value={filters.databaseName}

            onChange={handleFilterChange}

            onKeyPress={handleKeyPress} // Event-Listener für Enter-Taste

          />
<select

            name="databaseName"

            value={filters.databaseName}

            onChange={handleFilterChange}
>
<option value="">Wählen Sie eine DatabaseName</option>

            {getUniqueValues("DatabaseName").map((value, index) => (
<option key={index} value={value}>

                {value}
</option>

            ))}
</select>
 
          {/* Schema Name Filter */}
<input

            type="text"

            name="schemaName"

            placeholder="Filter SchemaNames"

            value={filters.schemaName}

            onChange={handleFilterChange}

            onKeyPress={handleKeyPress} // Event-Listener für Enter-Taste

          />
<select

            name="schemaName"

            value={filters.schemaName}

            onChange={handleFilterChange}
>
<option value="">Wählen Sie ein Schema</option>

            {getUniqueValues("SchemaNames").map((value, index) => (
<option key={index} value={value}>

                {value}
</option>

            ))}
</select>
 
          {/* Object Name Filter */}
<input

            type="text"

            name="objectName"

            placeholder="Filter ObjectName"

            value={filters.objectName}

            onChange={handleFilterChange}

            onKeyPress={handleKeyPress} // Event-Listener für Enter-Taste

          />
<select

            name="objectName"

            value={filters.objectName}

            onChange={handleFilterChange}
>
<option value="">Wählen Sie ein Objekt</option>

            {getUniqueValues("ObjectName").map((value, index) => (
<option key={index} value={value}>

                {value}
</option>

            ))}
</select>
 
          {/* Index Type Filter */}
<input

            type="text"

            name="indexType"

            placeholder="Filter IndexType"

            value={filters.indexType}

            onChange={handleFilterChange}

            onKeyPress={handleKeyPress} // Event-Listener für Enter-Taste

          />
<select

            name="indexType"

            value={filters.indexType}

            onChange={handleFilterChange}
>
<option value="">Wählen Sie den IndexType</option>

            {getUniqueValues("IndexType").map((value, index) => (
<option key={index} value={value}>

                {value}
</option>

            ))}
</select>
 
          {/* Avg Fragmentation Filter */}
<div className="filter-avg-fragmentation">
<input

              type="text"

              name="value"

              placeholder="AvgFragmentationInPercent"

              value={filters.avgFragmentationInPercent.value}

              onChange={handleAvgFragmentationChange}

              onKeyPress={handleKeyPress} // Event-Listener für Enter-Taste

            />
<select

              name="operator"

              value={filters.avgFragmentationInPercent.operator}

              onChange={handleAvgFragmentationChange}
>
<option value="equal">Gleich</option>
<option value="greater">Größer als</option>
<option value="less">Kleiner als</option>
</select>
</div>
 
          <button onClick={applyFilters}>Filter anwenden</button>
</div>
</div>
 
      {/* Auswahl für Einträge pro Seite */}
<div className="items-per-page">
<label>Einträge pro Seite:</label>
<select onChange={handleItemsPerPageChange} value={itemsPerPage}>
<option value={5}>5</option>
<option value={10}>10</option>
<option value={20}>20</option>
<option value={50}>50</option>
</select>
</div>
 
      {/* Tabelle */}
<table>
<thead>
<tr>
<th>Datetime</th>
<th>DatabaseName</th>
<th>SchemaNames</th>
<th>ObjectName</th>
<th>IndexName</th>
<th>ObjectType</th>
<th>IndexType</th>
<th>PageCount</th>
<th>RecordCount</th>
<th>AvgFragmentationInPercent</th>
</tr>
</thead>
<tbody>

          {currentItems.length > 0 ? (

            currentItems.map((row, index) => (
<tr key={index}>
<td>{row.datetime}</td>
<td>{row.DatabaseName}</td>
<td>{row.SchemaNames}</td>
<td>{row.ObjectName}</td>
<td>{row.IndexName}</td>
<td>{row.ObjectType}</td>
<td>{row.IndexType}</td>
<td>{row.PageCount}</td>
<td>{row.RecordCount}</td>
<td>{row.AvgFragmentationInPercent}</td>
</tr>

            ))

          ) : (
<tr>
<td colSpan="10">Keine Daten gefunden</td>
</tr>

          )}
</tbody>
</table>
 
      {/* Pagination */}
<div className="pagination">
<button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>

          {"<"} Zurück
</button>
<span>Seite {currentPage} von {totalPages}</span>
<button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>

          Weiter {">"}
</button>
</div>
</div>

  );

};
 
export default App;

 