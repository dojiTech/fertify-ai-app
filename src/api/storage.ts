import * as SQLite from 'expo-sqlite';
import { FertilizerCalculation } from './firestore';
import { saveFertilizerCalculation as saveToFirestore, getFertilizerHistory as getFromFirestore } from './firestore';

// Database name
const DB_NAME = 'fertify.db';

// Initialize the database
export async function initStorage(): Promise<void> {
  const db = SQLite.openDatabase(DB_NAME);
  
  // Create tables if they don't exist
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
      () => console.log('Database initialized successfully'),
      (_, error) => {
        console.error('Error initializing database:', error);
        return false;
      }
    );
  });
}

// Save calculation to local storage and attempt to sync with Firestore
export async function saveFertilizerCalculation(
  calculation: Omit<FertilizerCalculation, 'id'>
): Promise<void> {
  const db = SQLite.openDatabase(DB_NAME);
  
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          `INSERT INTO fertilizer_calculations (
            userId, amount, nRatio, pRatio, kRatio,
            nContent, pContent, kContent, timestamp, notes, synced
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
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
            calculation.notes || null,
            0 // Not synced initially
          ],
          async (_, result) => {
            try {
              // Attempt to sync with Firestore
              await saveToFirestore(calculation);
              
              // Mark as synced if successful
              tx.executeSql(
                'UPDATE fertilizer_calculations SET synced = 1 WHERE id = ?;',
                [result.insertId]
              );
              
              resolve();
            } catch (error) {
              console.warn('Failed to sync with Firestore:', error);
              // Data is still saved locally, so we resolve successfully
              resolve();
            }
          }
        );
      },
      error => {
        console.error('Error saving to local database:', error);
        reject(error);
      }
    );
  });
}

// Get fertilizer history from local storage, fallback to Firestore if needed
export async function getFertilizerHistory(
  userId: string,
  limit: number = 10
): Promise<FertilizerCalculation[]> {
  const db = SQLite.openDatabase(DB_NAME);
  
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM fertilizer_calculations 
         WHERE userId = ? 
         ORDER BY timestamp DESC 
         LIMIT ?;`,
        [userId, limit],
        async (_, { rows: { _array } }) => {
          if (_array.length > 0) {
            // Convert SQLite records to FertilizerCalculation format
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
              timestamp: {
                toDate: () => new Date(row.timestamp),
                toMillis: () => row.timestamp
              },
              notes: row.notes
            }));
            resolve(calculations);
          } else {
            try {
              // If no local data, try to fetch from Firestore
              const firestoreData = await getFromFirestore(userId, limit);
              
              // Save Firestore data locally for future offline access
              firestoreData.forEach(calc => {
                tx.executeSql(
                  `INSERT INTO fertilizer_calculations (
                    userId, amount, nRatio, pRatio, kRatio,
                    nContent, pContent, kContent, timestamp, notes, synced
                  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                  [
                    calc.userId,
                    calc.amount,
                    calc.nRatio,
                    calc.pRatio,
                    calc.kRatio,
                    calc.nContent,
                    calc.pContent,
                    calc.kContent,
                    calc.timestamp.toMillis(),
                    calc.notes || null,
                    1 // Mark as synced since it came from Firestore
                  ]
                );
              });
              
              resolve(firestoreData);
            } catch (error) {
              console.error('Error fetching from Firestore:', error);
              // If both local and Firestore fail, return empty array
              resolve([]);
            }
          }
        },
        (_, error) => {
          console.error('Error querying local database:', error);
          reject(error);
          return false;
        }
      );
    });
  });
}

// Background sync function to push unsynced calculations to Firestore
export async function syncUnsyncedCalculations(): Promise<void> {
  const db = SQLite.openDatabase(DB_NAME);
  
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM fertilizer_calculations WHERE synced = 0;',
        [],
        async (_, { rows: { _array } }) => {
          try {
            for (const row of _array) {
              const calculation: Omit<FertilizerCalculation, 'id'> = {
                userId: row.userId,
                amount: row.amount,
                nRatio: row.nRatio,
                pRatio: row.pRatio,
                kRatio: row.kRatio,
                nContent: row.nContent,
                pContent: row.pContent,
                kContent: row.kContent,
                timestamp: {
                  toDate: () => new Date(row.timestamp),
                  toMillis: () => row.timestamp
                },
                notes: row.notes
              };
              
              try {
                await saveToFirestore(calculation);
                
                // Mark as synced
                tx.executeSql(
                  'UPDATE fertilizer_calculations SET synced = 1 WHERE id = ?;',
                  [row.id]
                );
              } catch (error) {
                console.warn(`Failed to sync calculation ${row.id}:`, error);
                // Continue with next record
              }
            }
            resolve();
          } catch (error) {
            console.error('Error during sync:', error);
            reject(error);
          }
        },
        (_, error) => {
          console.error('Error querying unsynced records:', error);
          reject(error);
          return false;
        }
      );
    });
  });
}