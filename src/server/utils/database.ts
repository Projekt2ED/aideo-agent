/**
 * SQLite 数据库工具（使用 sql.js，纯 JS 实现，无需原生编译）
 */
import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.resolve(__dirname, '../../../data/aideo.db');

let db: Database | null = null;

export async function initDatabase(): Promise<Database> {
  if (db) return db;

  const SQL = await initSqlJs();

  // 确保 data 目录存在
  const dataDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // 如果数据库文件存在则加载，否则创建新数据库
  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  // 创建表
  db.run(`
    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL DEFAULT '新对话',
      vid TEXT,
      video_name TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  // 迁移：为旧表添加 vid 和 video_name 列（如果不存在）
  try {
    const tableInfo = db.exec("PRAGMA table_info(conversations)");
    const columns = tableInfo[0]?.values.map((row: any[]) => row[1]) || [];
    if (!columns.includes('vid')) {
      db.run("ALTER TABLE conversations ADD COLUMN vid TEXT");
      console.log('📦 已为 conversations 表添加 vid 列');
    }
    if (!columns.includes('video_name')) {
      db.run("ALTER TABLE conversations ADD COLUMN video_name TEXT");
      console.log('📦 已为 conversations 表添加 video_name 列');
    }
  } catch (e) {
    // 忽略迁移错误（新数据库不需要迁移）
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      task_id TEXT,
      status TEXT DEFAULT 'sent',
      FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      volc_task_id TEXT,
      conversation_id TEXT,
      vid TEXT,
      prompt TEXT,
      skill_type TEXT,
      title TEXT,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      result TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      completed_at TEXT,
      failed_at TEXT
    )
  `);

  saveDatabase();
  console.log('📦 SQLite 数据库初始化完成');
  return db;
}

export function getDatabase(): Database {
  if (!db) throw new Error('数据库未初始化，请先调用 initDatabase()');
  return db;
}

export function saveDatabase() {
  if (!db) return;
  // 使用防抖机制，避免频繁同步写磁盘
  scheduleSave();
}

// ============ 防抖保存机制 ============

let saveTimer: NodeJS.Timeout | null = null;
const SAVE_DEBOUNCE_MS = 2000; // 2秒防抖

/**
 * 延迟保存数据库（防抖机制）
 * 避免每次写操作都同步写磁盘，提高性能
 */
function scheduleSave() {
  if (saveTimer) return; // 已有定时器，跳过
  
  saveTimer = setTimeout(() => {
    saveTimer = null;
    if (db) {
      try {
        const data = db.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(DB_PATH, buffer);
      } catch (err) {
        console.error('❌ 保存数据库失败:', err);
      }
    }
  }, SAVE_DEBOUNCE_MS);
}

/**
 * 立即保存数据库（用于关键操作和优雅关闭）
 */
export function flushDatabase() {
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
  }
  if (db) {
    try {
      const data = db.export();
      const buffer = Buffer.from(data);
      fs.writeFileSync(DB_PATH, buffer);
    } catch (err) {
      console.error('❌ 保存数据库失败:', err);
    }
  }
}

// ============ 对话操作 ============

export function createConversation(id: string, title: string, vid?: string, videoName?: string): void {
  const now = new Date().toISOString();
  getDatabase().run(
    'INSERT INTO conversations (id, title, vid, video_name, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
    [id, title, vid || null, videoName || null, now, now]
  );
  saveDatabase();
}

export function getConversations(): any[] {
  const result = getDatabase().exec('SELECT id, title, vid, video_name, created_at, updated_at FROM conversations ORDER BY updated_at DESC');
  if (result.length === 0) return [];
  return result[0].values.map((row: any[]) => ({
    id: row[0],
    title: row[1],
    vid: row[2],
    videoName: row[3],
    createdAt: row[4],
    updatedAt: row[5],
  }));
}

export function updateConversation(id: string, title: string): void {
  const now = new Date().toISOString();
  getDatabase().run(
    'UPDATE conversations SET title = ?, updated_at = ? WHERE id = ?',
    [title, now, id]
  );
  saveDatabase();
}

export function deleteConversation(id: string): void {
  getDatabase().run('DELETE FROM messages WHERE conversation_id = ?', [id]);
  getDatabase().run('DELETE FROM conversations WHERE id = ?', [id]);
  saveDatabase();
}

// ============ 消息操作 ============

export function addMessage(
  id: string,
  conversationId: string,
  role: string,
  content: string,
  taskId?: string,
  status = 'sent'
): void {
  const now = new Date().toISOString();
  getDatabase().run(
    'INSERT INTO messages (id, conversation_id, role, content, timestamp, task_id, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [id, conversationId, role, content, now, taskId || null, status]
  );
  // 更新对话的更新时间
  getDatabase().run('UPDATE conversations SET updated_at = ? WHERE id = ?', [now, conversationId]);
  saveDatabase();
}

export function getMessages(conversationId: string): any[] {
  const result = getDatabase().exec(
    'SELECT * FROM messages WHERE conversation_id = ? ORDER BY timestamp ASC',
    [conversationId]
  );
  if (result.length === 0) return [];
  return result[0].values.map((row: any[]) => ({
    id: row[0],
    conversationId: row[1],
    role: row[2],
    content: row[3],
    timestamp: row[4],
    taskId: row[5],
    status: row[6],
  }));
}

export function updateMessageStatus(id: string, status: string): void {
  getDatabase().run('UPDATE messages SET status = ? WHERE id = ?', [status, id]);
  saveDatabase();
}

// ============ 任务操作 ============

export function createTask(task: {
  id: string;
  volcTaskId?: string;
  conversationId?: string;
  vid?: string;
  prompt?: string;
  skillType?: string;
  title?: string;
  description?: string;
}): void {
  const now = new Date().toISOString();
  getDatabase().run(
    `INSERT INTO tasks (id, volc_task_id, conversation_id, vid, prompt, skill_type, title, description, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)`,
    [task.id, task.volcTaskId || null, task.conversationId || null, task.vid || null,
     task.prompt || null, task.skillType || null, task.title || null, task.description || null, now, now]
  );
  saveDatabase();
}

export function getTasks(): any[] {
  const result = getDatabase().exec('SELECT * FROM tasks ORDER BY created_at DESC');
  if (result.length === 0) return [];
  return result[0].values.map(row => mapTask(row));
}

export function getTaskById(id: string): any | null {
  const result = getDatabase().exec('SELECT * FROM tasks WHERE id = ?', [id]);
  if (result.length === 0 || result[0].values.length === 0) return null;
  return mapTask(result[0].values[0]);
}

export function getTaskByVolcId(volcTaskId: string): any | null {
  const result = getDatabase().exec('SELECT * FROM tasks WHERE volc_task_id = ?', [volcTaskId]);
  if (result.length === 0 || result[0].values.length === 0) return null;
  return mapTask(result[0].values[0]);
}

export function updateTask(id: string, updates: {
  status?: string;
  result?: any;
  volcTaskId?: string;
}): void {
  const now = new Date().toISOString();
  const fields: string[] = ['updated_at = ?'];
  const values: any[] = [now];

  if (updates.status) {
    fields.push('status = ?');
    values.push(updates.status);
    if (updates.status === 'completed') {
      fields.push('completed_at = ?');
      values.push(now);
    } else if (updates.status === 'failed') {
      fields.push('failed_at = ?');
      values.push(now);
    }
  }
  if (updates.result !== undefined) {
    fields.push('result = ?');
    values.push(typeof updates.result === 'string' ? updates.result : JSON.stringify(updates.result));
  }
  if (updates.volcTaskId) {
    fields.push('volc_task_id = ?');
    values.push(updates.volcTaskId);
  }

  values.push(id);
  getDatabase().run(`UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`, values);
  saveDatabase();
}

export function deleteTask(id: string): void {
  getDatabase().run('DELETE FROM tasks WHERE id = ?', [id]);
  saveDatabase();
}

export function getTaskStats(): any {
  const result = getDatabase().exec(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN status = 'processing' THEN 1 ELSE 0 END) as processing,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
      SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed
    FROM tasks
  `);
  if (result.length === 0) return { total: 0, pending: 0, processing: 0, completed: 0, failed: 0 };
  const row = result[0].values[0];
  return {
    total: row[0] || 0,
    pending: row[1] || 0,
    processing: row[2] || 0,
    completed: row[3] || 0,
    failed: row[4] || 0,
  };
}

function mapTask(row: any[]): any {
  return {
    id: row[0],
    volcTaskId: row[1],
    conversationId: row[2],
    vid: row[3],
    prompt: row[4],
    skillType: row[5],
    title: row[6],
    description: row[7],
    status: row[8],
    result: row[9] ? JSON.parse(row[9] as string) : null,
    createdAt: row[10],
    updatedAt: row[11],
    completedAt: row[12],
    failedAt: row[13],
  };
}
