require("dotenv/config");
const postgres = require("postgres");
const sql = postgres(process.env.DATABASE_URL);
(async () => {
  try {
    console.log(await sql.unsafe("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'sites' ORDER BY ordinal_position"));
    console.log(await sql.unsafe("SELECT to_char(created_at AT TIME ZONE 'America/New_York', 'YYYY-MM-DD') AS bucket, count(*)::int AS count FROM events GROUP BY to_char(created_at AT TIME ZONE 'America/New_York', 'YYYY-MM-DD') ORDER BY bucket LIMIT 3"));
    console.log(await sql.unsafe("SELECT to_char(created_at AT TIME ZONE $1, $2) AS bucket, count(*) AS count FROM events WHERE created_at >= $3 AND created_at <= $4 GROUP BY to_char(created_at AT TIME ZONE $1, $2) ORDER BY to_char(created_at AT TIME ZONE $1, $2)", ["America/New_York", "YYYY-MM-DD", new Date("2025-01-01T00:00:00Z"), new Date("2027-01-01T00:00:00Z")]));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    await sql.end();
  }
})();
