// Converts the Supabase table exports into the JSON snapshot the site reads from.
// Usage: node scripts/export-db-dump.mjs [dump-dir]
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const dumpDir = process.argv[2] ?? join(rootDir, 'pga2k-tracker-data/db-dump');
const outDir = join(rootDir, 'src/lib/data/snapshot');

const TABLES = ['courses', 'holes', 'matches', 'hole_results', 'players', 'teams', 'team_members'];

// Display-name overrides, keyed by ID so the original names stay out of the repo.
const NAME_OVERRIDES = {
  players: {
    'a73eafaa-138c-4cde-ad24-d898bdc76934': 'Anonymous Golfer 1',
    'b242e7b4-b294-4223-bdd3-e0569c1d440e': 'Anonymous Golfer 2',
  },
  teams: {
    '5a024068-6824-43f7-92d2-31c2aeaa319b': 'Sand Save Society',
    'f3112eff-fb9b-482d-a817-6d16d183eb7d': 'Long Ball Hitters',
    '1a3ae581-47ee-4aaa-8fd9-fa5f3bcc252f': 'Fore Sure!',
    '8e8ea2a7-9527-49da-a37b-453595d9851a': 'Tee Time Titans',
    '4b856422-e9fb-43dd-a7a5-b121c6ffd3ac': 'Tee Tricksters',
  },
};

/** Parses a single `INSERT INTO public.x (cols) VALUES (...), (...);` statement. */
function parseInsert(sql) {
  const header = sql.match(/^\s*INSERT INTO public\.(\w+) \((.*?)\) VALUES /);
  if (!header) throw new Error('Unrecognised export format');
  const columns = header[2].split(',').map((column) => column.trim());
  let i = header[0].length;

  const skipSpace = () => {
    while (/\s/.test(sql[i] ?? '')) i++;
  };

  const readValue = () => {
    skipSpace();
    if (sql[i] === "'") {
      let text = '';
      i++;
      while (true) {
        if (sql[i] === "'" && sql[i + 1] === "'") {
          text += "'";
          i += 2;
        } else if (sql[i] === "'") {
          i++;
          return text;
        } else {
          text += sql[i++];
        }
      }
    }
    if (sql.startsWith('ARRAY[', i)) {
      i += 'ARRAY['.length;
      const items = [];
      skipSpace();
      while (sql[i] !== ']') {
        items.push(readValue());
        skipSpace();
        if (sql[i] === ',') i++;
        skipSpace();
      }
      i++;
      return items;
    }
    const start = i;
    while (sql[i] !== ',' && sql[i] !== ')') i++;
    const token = sql.slice(start, i).trim();
    if (token === 'null') return null;
    if (token === 'true') return true;
    if (token === 'false') return false;
    if (/^-?\d+$/.test(token)) return Number(token);
    throw new Error(`Unexpected token: ${token}`);
  };

  const rows = [];
  while (true) {
    skipSpace();
    if (sql[i] !== '(') throw new Error(`Expected row at offset ${i}`);
    i++;
    const values = [];
    while (true) {
      values.push(readValue());
      skipSpace();
      if (sql[i++] === ')') break;
    }
    if (values.length !== columns.length) throw new Error(`Row has ${values.length} values`);
    rows.push(Object.fromEntries(columns.map((column, index) => [column, values[index]])));
    skipSpace();
    if (sql[i] === ';') return rows;
    i++;
  }
}

// Match the format the Supabase API returned, which the UI relies on (`date.split('T')`).
function normalizeTimestamp(key, value) {
  if (typeof value !== 'string' || !/^(date_played|created_at|updated_at)$/.test(key)) return value;
  return value.replace(' ', 'T').replace(/\+00$/, '+00:00');
}

const data = {};
for (const table of TABLES) {
  const rows = parseInsert(readFileSync(join(dumpDir, `${table}_rows.sql`), 'utf8'));
  data[table] = rows.map((row) => {
    const normalized = Object.fromEntries(
      Object.entries(row).map(([key, value]) => [key, normalizeTimestamp(key, value)])
    );
    const name = NAME_OVERRIDES[table]?.[row.id];
    return name ? { ...normalized, name } : normalized;
  });
}

// Refuse to write a snapshot with dangling references.
const idsOf = (table) => new Set(data[table].map((row) => row.id));
const REFERENCES = [
  ['holes', 'course_id', 'courses'],
  ['hole_results', 'match_id', 'matches'],
  ['team_members', 'team_id', 'teams'],
  ['team_members', 'player_id', 'players'],
  ['matches', 'course_id', 'courses'],
  ['matches', 'your_team_id', 'teams'],
  ['matches', 'opponent_team_id', 'teams'],
  ['matches', 'winner_id', 'teams'],
  ['matches', 'player1_id', 'players'],
  ['matches', 'player2_id', 'players'],
  ['matches', 'opponent1_id', 'players'],
  ['matches', 'opponent2_id', 'players'],
];
for (const [table, column, target] of REFERENCES) {
  const ids = idsOf(target);
  const broken = data[table].filter((row) => row[column] !== null && !ids.has(row[column]));
  if (broken.length) throw new Error(`${broken.length} broken ${table}.${column} references`);
}

for (const table of TABLES) {
  writeFileSync(join(outDir, `${table}.json`), `${JSON.stringify(data[table], null, 2)}\n`);
  console.log(`${table}: ${data[table].length} rows`);
}
