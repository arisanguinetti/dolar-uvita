import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

const adapter = new FileSync('db.json')
const db = low(adapter)

db.defaults({ uvaValues: [], usdValues: [] }).write()

export default db;