import * as SQLite from 'expo-sqlite';

// Open database (creates if doesn't exist)
export const db = SQLite.openDatabaseSync('slopify.db');

// Types
export interface SlopRecord {
  id: number;
  original_uri: string;
  slop_uri: string;
  caption: string;
  slop_level: string;
  slop_mode: string;
  is_favorite: number;
  created_at: string;
}

export interface InsertSlopData {
  originalUri: string;
  slopUri: string;
  caption: string;
  slopLevel: string;
  slopMode?: string;
}

// ============================================
// Initialize Schema
// ============================================
export async function initDatabase(): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS slops (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      original_uri TEXT NOT NULL,
      slop_uri TEXT NOT NULL,
      caption TEXT NOT NULL,
      slop_level TEXT NOT NULL,
      slop_mode TEXT DEFAULT 'facebook',
      is_favorite INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  // Migration: Add new columns if they don't exist
  try {
    await db.execAsync(`ALTER TABLE slops ADD COLUMN slop_mode TEXT DEFAULT 'facebook'`);
  } catch (e) { /* Column already exists */ }
  
  try {
    await db.execAsync(`ALTER TABLE slops ADD COLUMN is_favorite INTEGER DEFAULT 0`);
  } catch (e) { /* Column already exists */ }
  
  console.log('✅ Database initialized');
}

// ============================================
// CRUD Operations
// ============================================

/**
 * Insert a new slop record
 * @returns The ID of the newly inserted record
 */
export async function insertSlop(data: InsertSlopData): Promise<number> {
  const result = await db.runAsync(
    'INSERT INTO slops (original_uri, slop_uri, caption, slop_level, slop_mode) VALUES (?, ?, ?, ?, ?)',
    [data.originalUri, data.slopUri, data.caption, data.slopLevel, data.slopMode || 'facebook']
  );
  return result.lastInsertRowId;
}

/**
 * Get all slops, newest first
 */
export async function getAllSlops(favoritesOnly: boolean = false): Promise<SlopRecord[]> {
  if (favoritesOnly) {
    return await db.getAllAsync<SlopRecord>(
      'SELECT * FROM slops WHERE is_favorite = 1 ORDER BY created_at DESC'
    );
  }
  return await db.getAllAsync<SlopRecord>(
    'SELECT * FROM slops ORDER BY created_at DESC'
  );
}

/**
 * Get a single slop by ID
 */
export async function getSlopById(id: number): Promise<SlopRecord | null> {
  return await db.getFirstAsync<SlopRecord>(
    'SELECT * FROM slops WHERE id = ?',
    [id]
  );
}

/**
 * Delete a slop by ID
 */
export async function deleteSlop(id: number): Promise<void> {
  await db.runAsync('DELETE FROM slops WHERE id = ?', [id]);
}

/**
 * Delete all slops (for testing/reset)
 */
export async function deleteAllSlops(): Promise<void> {
  await db.runAsync('DELETE FROM slops');
}

/**
 * Get the count of all slops
 */
export async function getSlopCount(): Promise<number> {
  const result = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM slops'
  );
  return result?.count ?? 0;
}

/**
 * Update a slop's caption
 */
export async function updateSlopCaption(id: number, caption: string): Promise<void> {
  await db.runAsync('UPDATE slops SET caption = ? WHERE id = ?', [caption, id]);
}

/**
 * Toggle favorite status
 */
export async function toggleFavorite(id: number): Promise<boolean> {
  const slop = await getSlopById(id);
  if (!slop) return false;
  
  const newStatus = slop.is_favorite ? 0 : 1;
  await db.runAsync('UPDATE slops SET is_favorite = ? WHERE id = ?', [newStatus, id]);
  return newStatus === 1;
}

/**
 * Get stats for dashboard
 */
export async function getStats(): Promise<{ total: number; favorites: number; mostUsedMode: string | null }> {
  const total = await getSlopCount();
  
  const favResult = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM slops WHERE is_favorite = 1'
  );
  const favorites = favResult?.count ?? 0;
  
  const modeResult = await db.getFirstAsync<{ slop_mode: string }>(
    'SELECT slop_mode, COUNT(*) as count FROM slops GROUP BY slop_mode ORDER BY count DESC LIMIT 1'
  );
  
  return { total, favorites, mostUsedMode: modeResult?.slop_mode ?? null };
}
