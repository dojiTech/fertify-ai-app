import * as SQLite from 'expo-sqlite';
import { FertilizerCalculation } from './firestore';

// Open the database
const db = SQLite.openDatabase('fertify.db');

// Initialize the database
export function initDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS fertilizer_calculations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId TEXT NOT NULL,
          amount REAL NOT NULL,
          nRatio REAL NOT NULL,
          pRatio REAL NOT NULL,
          kRatio REAL NOT NULL,
          nContent REAL NOT NULL,
          pContent REAL NOT NULL,
          kContent REAL NOT NULL,
          timestamp INTEGER NOT NULL,
          notes TEXT,
          synced INTEGER DEFAULT 0
        );`,
        [],
        () => resolve(),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

// Save a fertilizer calculation locally
export function saveFertilizerCalculationLocal(calculation: Omit<FertilizerCalculation, 'id'>): Promise<number> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO fertilizer_calculations (
          userId, amount, nRatio, pRatio, kRatio, nContent, pContent, kContent, timestamp, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          calculation.userId,
          calculation.amount,
          calculation.nRatio,
          calculation.pRatio,
          calculation.kRatio,
          calculation.nContent,
          calculation.pContent,
          calculation.kContent,
          calculation.timestamp.toMillis(),
          calculation.notes || null
        ],
        (_, result) => resolve(result.insertId),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

// Get fertilizer calculation history from local database
export function getFertilizerHistoryLocal(userId: string, limitCount = 10): Promise<FertilizerCalculation[]> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM fertilizer_calculations 
         WHERE userId = ? 
         ORDER BY timestamp DESC 
         LIMIT ?;`,
        [userId, limitCount],
        (_, { rows: { _array } }) => {
          const calculations = _array.map(row => ({
            id: row.id.toString(),
            userId: row.userId,
            amount: row.amount,
            nRatio: row.nRatio,
            pRatio: row.pRatio,
            kRatio: row.kRatio,
            nContent: row.nContent,
            pContent: row.pContent,
            kContent: row.kContent,
            timestamp: new SQLite.Timestamp(row.timestamp),
            notes: row.notes
          }));
          resolve(calculations);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

// Mark a calculation as synced with Firestore
export function markCalculationAsSynced(id: number): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE fertilizer_calculations SET synced = 1 WHERE id = ?;',
        [id],
        () => resolve(),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

// Get unsynced calculations
export function getUnsyncedCalculations(): Promise<FertilizerCalculation[]> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM fertilizer_calculations WHERE synced = 0;',
        [],
        (_, { rows: { _array } }) => {
          const calculations = _array.map(row => ({
            id: row.id.toString(),
            userId: row.userId,
            amount: row.amount,
            nRatio: row.nRatio,
            pRatio: row.pRatio,
            kRatio: row.kRatio,
            nContent: row.nContent,
            pContent: row.pContent,
            kContent: row.kContent,
            timestamp: new SQLite.Timestamp(row.timestamp),
            notes: row.notes
          }));
          resolve(calculations);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}