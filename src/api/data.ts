import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('fertify.db');

export interface FertilizerCalculation {
  id?: number;
  userId: string;
  amount: number;
  nRatio: number;
  pRatio: number;
  kRatio: number;
  nContent: number;
  pContent: number;
  kContent: number;
  timestamp: number;
  notes?: string;
}

export function initDatabase() {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS fertilizer_calculations (\n' +
      '  id INTEGER PRIMARY KEY AUTOINCREMENT,\n' +
      '  userId TEXT,\n' +
      '  amount REAL,\n' +
      '  nRatio REAL,\n' +
      '  pRatio REAL,\n' +
      '  kRatio REAL,\n' +
      '  nContent REAL,\n' +
      '  pContent REAL,\n' +
      '  kContent REAL,\n' +
      '  timestamp INTEGER,\n' +
      '  notes TEXT\n' +
      ');'
    );
  });
}

export function saveFertilizerCalculation(calculation: Omit<FertilizerCalculation, 'id'>): Promise<number> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO fertilizer_calculations (userId, amount, nRatio, pRatio, kRatio, nContent, pContent, kContent, timestamp, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [calculation.userId, calculation.amount, calculation.nRatio, calculation.pRatio, calculation.kRatio, calculation.nContent, calculation.pContent, calculation.kContent, calculation.timestamp, calculation.notes],
        (_, result) => resolve(result.insertId),
        (_, error) => { reject(error); return false; }
      );
    });
  });
}

export function getFertilizerHistory(userId: string, limitCount = 10): Promise<FertilizerCalculation[]> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM fertilizer_calculations WHERE userId = ? ORDER BY timestamp DESC LIMIT ?',
        [userId, limitCount],
        (_, result) => resolve(result.rows._array),
        (_, error) => { reject(error); return false; }
      );
    });
  });
}