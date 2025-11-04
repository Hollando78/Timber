#!/usr/bin/env python3
"""
Extract timber span data from Building Regulations Approved Document A PDF
"""

import camelot
import pdfplumber
import pandas as pd
import json
from pathlib import Path
import re

def explore_pdf_structure(pdf_path):
    """Explore the PDF to find table locations and structure"""
    print(f"Exploring PDF: {pdf_path}")
    
    with pdfplumber.open(pdf_path) as pdf:
        print(f"Total pages: {len(pdf.pages)}")
        
        # Search for pages containing timber/joist keywords
        timber_pages = []
        for i, page in enumerate(pdf.pages):
            text = page.extract_text()
            if text and any(keyword in text.lower() for keyword in ['timber', 'joist', 'span', 'floor']):
                timber_pages.append(i + 1)
                print(f"Page {i + 1}: Found timber-related content")
                
                # Look for tables on this page
                tables = page.extract_tables()
                if tables:
                    print(f"  Found {len(tables)} tables")
                    for j, table in enumerate(tables):
                        if table and len(table) > 2:  # Skip small tables
                            print(f"    Table {j + 1}: {len(table)} rows x {len(table[0]) if table[0] else 0} cols")
                            # Print first few rows to identify content
                            for row_idx, row in enumerate(table[:3]):
                                print(f"      Row {row_idx + 1}: {row}")
        
        return timber_pages

def extract_tables_camelot(pdf_path, pages=None):
    """Extract tables using Camelot"""
    print(f"Extracting tables with Camelot from pages: {pages}")
    
    try:
        if pages:
            pages_str = ','.join(map(str, pages))
            tables = camelot.read_pdf(pdf_path, pages=pages_str, flavor='lattice')
        else:
            tables = camelot.read_pdf(pdf_path, flavor='lattice')
        
        print(f"Camelot found {len(tables)} tables")
        
        extracted_data = []
        for i, table in enumerate(tables):
            df = table.df
            print(f"\nTable {i + 1} from page {table.page}:")
            print(f"Shape: {df.shape}")
            print(f"Parsing report: {table.parsing_report}")
            print("First few rows:")
            print(df.head())
            
            # Check if this looks like a timber span table
            table_text = ' '.join(df.astype(str).values.flatten()).lower()
            if any(keyword in table_text for keyword in ['timber', 'joist', 'span', 'mm', 'centres', 'c16', 'c24']):
                print("*** This appears to be a timber span table! ***")
                extracted_data.append({
                    'page': table.page,
                    'table_index': i,
                    'dataframe': df,
                    'accuracy': table.accuracy
                })
        
        return extracted_data
    
    except Exception as e:
        print(f"Camelot extraction failed: {e}")
        return []

def extract_tables_pdfplumber(pdf_path, pages=None):
    """Extract tables using pdfplumber as backup"""
    print(f"Extracting tables with pdfplumber from pages: {pages}")
    
    extracted_data = []
    
    with pdfplumber.open(pdf_path) as pdf:
        pages_to_check = pages if pages else range(1, len(pdf.pages) + 1)
        
        for page_num in pages_to_check:
            page = pdf.pages[page_num - 1]  # pdfplumber uses 0-based indexing
            text = page.extract_text()
            
            # Check if page contains timber-related content
            if text and any(keyword in text.lower() for keyword in ['timber', 'joist', 'span', 'floor']):
                tables = page.extract_tables()
                
                for i, table in enumerate(tables):
                    if table and len(table) > 2:  # Skip small tables
                        df = pd.DataFrame(table[1:], columns=table[0] if table[0] else None)
                        
                        print(f"\nTable {i + 1} from page {page_num}:")
                        print(f"Shape: {df.shape}")
                        print("First few rows:")
                        print(df.head())
                        
                        # Check if this looks like a timber span table
                        table_text = ' '.join(df.astype(str).values.flatten()).lower()
                        if any(keyword in table_text for keyword in ['timber', 'joist', 'span', 'mm', 'centres', 'c16', 'c24']):
                            print("*** This appears to be a timber span table! ***")
                            extracted_data.append({
                                'page': page_num,
                                'table_index': i,
                                'dataframe': df,
                                'method': 'pdfplumber'
                            })
    
    return extracted_data

def parse_timber_data(extracted_tables):
    """Parse extracted tables to identify timber span data"""
    timber_data = {
        'sources': [],
        'floor_joists': {}
    }
    
    for table_info in extracted_tables:
        df = table_info['dataframe']
        page = table_info['page']
        
        print(f"\nParsing table from page {page}:")
        print(df.to_string())
        
        # Try to identify timber sizes and spans
        # This is a heuristic approach - will need refinement based on actual table structure
        
        # Look for columns that might contain timber sizes (like 47x100, 47x150, etc.)
        # Look for rows that might contain spacing (400mm, 450mm, 600mm)
        # Look for cells that contain span values (numbers with 'm' or decimal values)
        
        timber_data['sources'].append({
            'page': page,
            'table_shape': df.shape,
            'method': table_info.get('method', 'camelot'),
            'accuracy': table_info.get('accuracy', 'unknown')
        })
    
    return timber_data

def main():
    pdf_path = "building_regs_approved_doc_a.pdf"
    
    if not Path(pdf_path).exists():
        print(f"PDF file not found: {pdf_path}")
        return
    
    print("=== PDF EXPLORATION ===")
    timber_pages = explore_pdf_structure(pdf_path)
    
    print(f"\n=== EXTRACTING TABLES FROM TIMBER-RELATED PAGES ===")
    print(f"Focus pages: {timber_pages[:10] if len(timber_pages) > 10 else timber_pages}")  # Limit to first 10 pages
    
    # Try Camelot first
    camelot_tables = extract_tables_camelot(pdf_path, timber_pages[:5] if timber_pages else None)
    
    # Try pdfplumber as backup
    pdfplumber_tables = extract_tables_pdfplumber(pdf_path, timber_pages[:5] if timber_pages else None)
    
    # Combine results
    all_tables = camelot_tables + pdfplumber_tables
    
    if all_tables:
        print(f"\n=== PARSING {len(all_tables)} POTENTIAL TIMBER TABLES ===")
        timber_data = parse_timber_data(all_tables)
        
        # Save raw extraction results
        output_file = "extracted_timber_data.json"
        with open(output_file, 'w') as f:
            # Convert DataFrames to dict for JSON serialization
            serializable_data = {
                'sources': timber_data['sources'],
                'tables_found': len(all_tables),
                'raw_tables': []
            }
            
            for i, table_info in enumerate(all_tables):
                serializable_data['raw_tables'].append({
                    'table_id': i,
                    'page': table_info['page'],
                    'method': table_info.get('method', 'camelot'),
                    'shape': table_info['dataframe'].shape,
                    'data': table_info['dataframe'].to_dict('records')
                })
            
            json.dump(serializable_data, f, indent=2)
        
        print(f"\nExtraction results saved to: {output_file}")
        print(f"Found {len(all_tables)} potential timber span tables")
    else:
        print("No timber span tables found in the PDF")

if __name__ == "__main__":
    main()