# Data Dictionary Generator

A comprehensive tool for generating database documentation from schema definitions. Create professional data dictionaries with table-table relationship diagrams and export them as HTML or PDF.

## Features

- 📊 **Visual Database Overview**: See statistics about tables, columns, and relationships
- 🔗 **Entity Relationship Diagram**: Visual representation of table connections
- 📑 **Detailed Table Documentation**: Complete column information with data types, keys, and descriptions
- 📥 **Multiple Input Methods**: Upload JSON files, paste directly, or use sample schemas
- 📤 **Export Options**: Generate HTML or PDF versions for sharing and documentation
- 🎨 **Modern UI**: Clean, responsive design that works on all devices

## How to Use

### Step 1: Prepare Your Database Schema

#### MySQL / MariaDB

```sql
-- Get table structure
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_KEY,
    COLUMN_COMMENT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'your_database_name'
ORDER BY TABLE_NAME, ORDINAL_POSITION;

-- Get foreign key relationships
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'your_database_name'
    AND REFERENCED_TABLE_NAME IS NOT NULL;
```

#### PostgreSQL

```sql
-- Get table structure
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- Get foreign key relationships
SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY';
```

#### SQLite

```sql
-- Get all tables
SELECT name FROM sqlite_master WHERE type='table';

-- For each table, get its schema
PRAGMA table_info(table_name);

-- Get foreign keys for a table
PRAGMA foreign_key_list(table_name);
```

#### MongoDB (using Node.js)

```javascript
const db = client.db('your_database');
const collections = await db.listCollections().toArray();

for (const collection of collections) {
    const sampleDoc = await db.collection(collection.name).findOne();
    // Extract field names and types from sample document
}
```

### Step 2: Convert to JSON Format

Convert your database schema to the following JSON structure:

```json
{
  "database": "Your Database Name",
  "tables": [
    {
      "name": "table_name",
      "description": "Description of what this table stores",
      "columns": [
        {
          "name": "column_name",
          "type": "DATA_TYPE",
          "nullable": true/false,
          "primaryKey": true/false,
          "foreignKey": true/false,
          "description": "Description of this column"
        }
      ]
    }
  ],
  "relationships": [
    {
      "from": "table_a",
      "to": "table_b",
      "fromColumn": "column_in_table_a",
      "toColumn": "column_in_table_b",
      "type": "one-to-one" | "one-to-many" | "many-to-one" | "many-to-many"
    }
  ]
}
```

### Step 3: Generate Documentation

1. **Open the Tool**: Open `index.html` in your web browser
2. **Input Your Schema**:
   - Upload a JSON file using the file picker
   - OR paste JSON directly into the text area
   - OR select a sample schema from the dropdown
3. **Click "Generate Dictionary"**: The tool will parse and visualize your schema
4. **Review**: Examine the generated data dictionary

### Step 4: Export Documentation

- **Export as HTML**: Creates a standalone HTML file with embedded styles
- **Export as PDF**: Generates a PDF document for printing or sharing

## JSON Schema Format

### Required Fields

- `database` (string): Name of the database
- `tables` (array): List of table definitions
  - `name` (string): Table name
  - `columns` (array): List of column definitions
    - `name` (string): Column name
    - `type` (string): Data type

### Optional Fields

#### Table Level
- `description` (string): Description of the table's purpose

#### Column Level
- `nullable` (boolean): Whether the column can contain NULL values (default: true)
- `primaryKey` (boolean): Whether this is a primary key column (default: false)
- `foreignKey` (boolean): Whether this is a foreign key column (default: false)
- `description` (string): Description of what the column represents

#### Relationships
- `relationships` (array): List of table relationships
  - `from` (string): Source table name
  - `to` (string): Target table name
  - `fromColumn` (string): Column in source table
  - `toColumn` (string): Column in target table
  - `type` (string): Relationship type (one-to-one, one-to-many, many-to-one, many-to-many)

## Complete Example

```json
{
  "database": "E-commerce Platform",
  "tables": [
    {
      "name": "users",
      "description": "Customer accounts",
      "columns": [
        {
          "name": "id",
          "type": "INT",
          "nullable": false,
          "primaryKey": true,
          "description": "Unique user identifier"
        },
        {
          "name": "email",
          "type": "VARCHAR(255)",
          "nullable": false,
          "description": "User email address"
        },
        {
          "name": "created_at",
          "type": "TIMESTAMP",
          "nullable": false,
          "description": "Account creation date"
        }
      ]
    },
    {
      "name": "orders",
      "description": "Customer orders",
      "columns": [
        {
          "name": "id",
          "type": "INT",
          "nullable": false,
          "primaryKey": true,
          "description": "Unique order identifier"
        },
        {
          "name": "user_id",
          "type": "INT",
          "nullable": false,
          "foreignKey": true,
          "description": "Reference to user who placed the order"
        },
        {
          "name": "total_amount",
          "type": "DECIMAL(10,2)",
          "nullable": false,
          "description": "Total order amount"
        }
      ]
    }
  ],
  "relationships": [
    {
      "from": "orders",
      "to": "users",
      "fromColumn": "user_id",
      "toColumn": "id",
      "type": "many-to-one"
    }
  ]
}
```

## Python Script to Generate JSON from MySQL

```python
import mysql.connector
import json

def export_schema_to_json(host, user, password, database):
    conn = mysql.connector.connect(
        host=host,
        user=user,
        password=password,
        database=database
    )
    cursor = conn.cursor(dictionary=True)
    
    # Get tables
    cursor.execute("SHOW TABLES")
    tables = [list(row.values())[0] for row in cursor.fetchall()]
    
    schema = {
        "database": database,
        "tables": [],
        "relationships": []
    }
    
    # Get columns for each table
    for table in tables:
        cursor.execute(f"DESCRIBE {table}")
        columns = []
        
        for col in cursor.fetchall():
            columns.append({
                "name": col['Field'],
                "type": col['Type'],
                "nullable": col['Null'] == 'YES',
                "primaryKey": col['Key'] == 'PRI',
                "foreignKey": col['Key'] == 'MUL',
                "description": ""
            })
        
        schema['tables'].append({
            "name": table,
            "description": "",
            "columns": columns
        })
    
    # Get foreign keys
    cursor.execute("""
        SELECT 
            TABLE_NAME,
            COLUMN_NAME,
            REFERENCED_TABLE_NAME,
            REFERENCED_COLUMN_NAME
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
        WHERE TABLE_SCHEMA = %s
            AND REFERENCED_TABLE_NAME IS NOT NULL
    """, (database,))
    
    for fk in cursor.fetchall():
        schema['relationships'].append({
            "from": fk['TABLE_NAME'],
            "to": fk['REFERENCED_TABLE_NAME'],
            "fromColumn": fk['COLUMN_NAME'],
            "toColumn": fk['REFERENCED_COLUMN_NAME'],
            "type": "many-to-one"
        })
    
    cursor.close()
    conn.close()
    
    return schema

# Usage
schema = export_schema_to_json('localhost', 'root', 'password', 'your_database')
with open('schema.json', 'w') as f:
    json.dump(schema, f, indent=2)

print("Schema exported to schema.json")
```

## Node.js Script for PostgreSQL

```javascript
const { Client } = require('pg');
const fs = require('fs');

async function exportSchema(config, outputFile) {
    const client = new Client(config);
    await client.connect();
    
    const schema = {
        database: config.database,
        tables: [],
        relationships: []
    };
    
    // Get tables
    const tablesResult = await client.query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
    `);
    
    for (const { table_name } of tablesResult.rows) {
        // Get columns
        const columnsResult = await client.query(`
            SELECT 
                column_name,
                data_type,
                is_nullable,
                column_default
            FROM information_schema.columns
            WHERE table_name = $1
            ORDER BY ordinal_position
        `, [table_name]);
        
        const columns = columnsResult.rows.map(col => ({
            name: col.column_name,
            type: col.data_type.toUpperCase(),
            nullable: col.is_nullable === 'YES',
            primaryKey: false, // Would need additional query
            foreignKey: false,
            description: ''
        }));
        
        schema.tables.push({
            name: table_name,
            description: '',
            columns
        });
    }
    
    // Get foreign keys
    const fkResult = await client.query(`
        SELECT
            tc.table_name,
            kcu.column_name,
            ccu.table_name AS foreign_table_name,
            ccu.column_name AS foreign_column_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
    `);
    
    schema.relationships = fkResult.rows.map(row => ({
        from: row.table_name,
        to: row.foreign_table_name,
        fromColumn: row.column_name,
        toColumn: row.foreign_column_name,
        type: 'many-to-one'
    }));
    
    await client.end();
    
    fs.writeFileSync(outputFile, JSON.stringify(schema, null, 2));
    console.log(`Schema exported to ${outputFile}`);
}

// Usage
exportSchema({
    host: 'localhost',
    port: 5432,
    database: 'your_database',
    user: 'postgres',
    password: 'password'
}, 'schema.json');
```

## Included Sample Schemas

The tool includes three complete sample schemas:

1. **E-commerce Platform**: Online store with users, products, orders
2. **Blog Platform**: Content management with authors, posts, comments
3. **School Management System**: Students, teachers, courses, enrollments

## Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Opera

## Technical Details

### Technologies Used
- **HTML5**: Semantic structure
- **CSS3**: Modern styling with gradients and animations
- **JavaScript**: ES6+ features for parsing and rendering
- **jsPDF**: PDF generation library
- **html2canvas**: HTML to canvas conversion for PDF export

### File Structure

```
Q5/
├── index.html          # Main application interface
├── styles.css          # Styling and layout
├── script.js           # Core logic and functionality
├── samples.js          # Sample database schemas
└── README.md          # This documentation
```

## Tips for Best Results

1. **Add Descriptions**: Include table and column descriptions for better documentation
2. **Mark Keys**: Properly mark primary and foreign keys for accurate diagrams
3. **Define Relationships**: Explicitly define all table relationships
4. **Use Consistent Naming**: Follow naming conventions for tables and columns
5. **Test JSON**: Validate your JSON before uploading (use jsonlint.com)

## Troubleshooting

### "Invalid schema format" Error
- Check that your JSON is valid
- Ensure all required fields are present
- Verify table names and column definitions

### PDF Export Not Working
- Ensure you have a stable internet connection (for CDN libraries)
- Try exporting as HTML first
- Check browser console for errors

### Diagram Not Showing Correctly
- Verify relationship definitions
- Check that referenced tables exist
- Ensure foreign key columns are marked correctly

## Future Enhancements

Potential improvements:
- Support for indexes and constraints
- SQL DDL generation
- Comparison between schema versions
- Interactive diagram with drag-and-drop
- Support for views and stored procedures
- Dark mode theme

## License

Free to use for educational and commercial purposes.

---

**Made for database developers and documentation enthusiasts** 📚✨



