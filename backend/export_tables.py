# export_tables.py
import mysql.connector
import os

def export_database_to_markdown():
    try:
        db = mysql.connector.connect(
            host="localhost",
            user="root",
            password="Home@2024",
            database="pocketsmart"
        )
        cursor = db.cursor()

        # Get list of tables
        cursor.execute("SHOW TABLES")
        tables = [row[0] for row in cursor.fetchall()]

        markdown_content = "# PocketSmart MySQL Database Preview\n\n"
        markdown_content += "This file is auto-generated to let you view your MySQL tables directly inside VS Code.\n\n"

        for table in tables:
            markdown_content += f"## Table: `{table}`\n\n"

            # 1. Get Columns (Schema)
            cursor.execute(f"DESCRIBE {table}")
            columns = cursor.fetchall()
            markdown_content += "### Schema\n"
            markdown_content += "| Field | Type | Null | Key | Default | Extra |\n"
            markdown_content += "|---|---|---|---|---|---|\n"
            for col in columns:
                col_str = " | ".join([str(val) if val is not None else "" for val in col])
                markdown_content += f"| {col_str} |\n"
            markdown_content += "\n"

            # 2. Get Data (Rows)
            cursor.execute(f"SELECT * FROM {table}")
            rows = cursor.fetchall()
            
            # Fetch column headers
            cursor.execute(f"SHOW COLUMNS FROM {table}")
            col_names = [col[0] for col in cursor.fetchall()]

            markdown_content += "### Data Records\n"
            if not rows:
                markdown_content += "*No records found in this table.*\n\n"
            else:
                header_row = " | ".join(col_names)
                separator_row = " | ".join(["---"] * len(col_names))
                markdown_content += f"| {header_row} |\n"
                markdown_content += f"| {separator_row} |\n"
                for row in rows:
                    row_str = " | ".join([str(val) if val is not None else "" for val in row])
                    markdown_content += f"| {row_str} |\n"
                markdown_content += "\n"
            
            markdown_content += "---\n\n"

        # Save to markdown preview file
        current_dir = os.path.dirname(os.path.abspath(__file__))
        preview_path = os.path.join(current_dir, "database_preview.md")
        with open(preview_path, "w", encoding="utf-8") as f:
            f.write(markdown_content)

        print(f"Database preview successfully exported to {preview_path}")

        cursor.close()
        db.close()
    except Exception as e:
        print("Failed to export database to markdown:", e)

if __name__ == "__main__":
    export_database_to_markdown()
