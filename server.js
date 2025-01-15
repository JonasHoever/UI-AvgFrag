// server.js

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(cors()); // CORS aktivieren

// Erstelle die Verbindung zur MariaDB-Datenbank
const db = mysql.createConnection({
  host: "77.90.28.141",
  user: "avg", // Dein MariaDB-Benutzername
  password: "EDEKA", // Dein MariaDB-Passwort
  database: "orpfrd_test_gwc_sql_nb",
});

// Verbindung zur Datenbank herstellen
db.connect((err) => {
  if (err) {
    console.error("Fehler bei der Verbindung zur DB:", err);
    return;
  }

  console.log("\x1b[32m%s\x1b[0m", "Datenbank verbunden");

  // Starte den Ping-Mechanismus
  setInterval(() => {
    const start = Date.now(); // Zeitpunkt vor dem Ping

    db.ping((pingErr) => {
      const end = Date.now(); // Zeitpunkt nach dem Ping
      const latency = end - start; // Berechne die Latenz in Millisekunden

      if (pingErr) {
        // Überschreibe die vorherige Ausgabe und zeige die Fehlermeldung an
        process.stdout.write("\x1b[31mDatenbank-Ping fehlgeschlagen\x1b[0m\n");
      } else {
        // Überschreibe die vorherige Ausgabe und zeige die Reaktionszeit an
        process.stdout.write(`\x1b[32mDatenbank-Ping: ${latency} ms\x1b[0m\r`);
      }
    });
  }, 500); // Alle 0,5 Sekunden einen Ping senden
});

// API-Route, um Daten abzurufen
app.get("/api/avgfrag", (req, res) => {
  const query = "SELECT * FROM AvgFrag";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Fehler beim Abrufen der Daten:", err);
      return res.status(500).send("Fehler beim Abrufen der Daten.");
    }

    res.json(results);
  });
});

// Starte den Server
app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});
