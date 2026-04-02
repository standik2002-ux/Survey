// ─────────────────────────────────────────────
// Google Apps Script – Plak dit in script.google.com
// Maak eerst een Google Sheet aan, open dan
// Extensions > Apps Script, verwijder alles en
// plak deze code. Daarna: Deploy > New deployment >
// Web app > Execute as: Me > Who has access: Anyone
// Kopieer de URL en geef die aan Claude.
// ─────────────────────────────────────────────

const SHEET_NAME = 'Responses';

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        'Timestamp', 'Q1 Leeftijd', 'Q2 Frequentie',
        'Q3 Vertrouwen AI', 'Q4 AI Hulpverlening',
        'Q5 Vertrouwen Persoonsgegevens', 'Q6 Prioriteiten',
        'Q7 Verhaal Vastleggen', 'Q8 Veilige Plek',
        'Q9 Samenvattingen', 'Q10 Reden Geen AI'
      ]);
    }

    const data = JSON.parse(e.parameter.data);
    sheet.appendRow([
      data.timestamp,
      data.q1, data.q2, data.q3, data.q4, data.q5,
      Array.isArray(data.q6) ? data.q6.join(', ') : (data.q6 || ''),
      data.q7, data.q8, data.q9,
      data.q10 || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet || sheet.getLastRow() <= 1) {
      return ContentService
        .createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const rows = sheet.getDataRange().getValues().slice(1).map(row => ({
      timestamp: row[0],
      q1: String(row[1]),
      q2: String(row[2]),
      q3: String(row[3]),
      q4: String(row[4]),
      q5: String(row[5]),
      q6: row[6] ? String(row[6]).split(', ') : [],
      q7: String(row[7]),
      q8: String(row[8]),
      q9: String(row[9]),
      q10: String(row[10] || '')
    }));

    return ContentService
      .createTextOutput(JSON.stringify(rows))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
