#!/usr/bin/env python3
"""
Extract timber span data from TRADA Eurocode 5 PDF
"""

import pdfplumber
import camelot
import pandas as pd
import re
import json

def explore_trada_pdf(pdf_path):
    """Explore the TRADA PDF structure"""
    print(f"Exploring TRADA PDF: {pdf_path}")
    
    with pdfplumber.open(pdf_path) as pdf:
        print(f"Total pages: {len(pdf.pages)}")
        
        span_table_pages = []
        
        for i, page in enumerate(pdf.pages):
            page_num = i + 1
            text = page.extract_text()
            
            if text:
                text_lower = text.lower()
                
                # Look for floor joist tables specifically
                floor_keywords = [
                    'floor joist', 'floor member', 'timber floor',
                    '47x100', '47x150', '47x200', '47x225',
                    '400mm', '450mm', '600mm', 'centres',
                    'c16', 'c24', 'maximum span'
                ]
                
                matches = [kw for kw in floor_keywords if kw in text_lower]
                
                if matches:
                    print(f"\nPage {page_num}: Floor joist keywords found: {matches}")
                    
                    # Look for timber size patterns
                    timber_sizes = re.findall(r'\b\d+\s*[xX×]\s*\d+\b', text)
                    spans = re.findall(r'\b\d+\.\d+\b', text)  # Decimal numbers (potential spans)
                    spacings = re.findall(r'\b\d+\s*mm\b', text)
                    
                    if timber_sizes:
                        print(f"  Timber sizes: {timber_sizes[:10]}")
                    if spans and len(spans) > 5:  # Only if many spans (likely a table)
                        print(f"  Potential spans: {spans[:10]}")
                    if spacings:
                        print(f"  Spacings: {spacings[:5]}")
                    
                    # Extract tables on this page
                    tables = page.extract_tables()
                    if tables:
                        print(f"  Found {len(tables)} tables")
                        for j, table in enumerate(tables):
                            if table and len(table) > 3:
                                print(f"    Table {j + 1}: {len(table)} rows x {len(table[0]) if table[0] else 0} cols")
                                # Show first row (likely headers)
                                if table[0]:
                                    print(f"      Headers: {table[0]}")
                    
                    span_table_pages.append(page_num)
        
        return span_table_pages

def extract_floor_joist_tables(pdf_path, target_pages):
    """Extract floor joist tables using both methods"""
    
    extracted_tables = []
    
    # Try Camelot first
    for page in target_pages[:5]:  # Limit to first 5 promising pages
        print(f"\n=== EXTRACTING FROM PAGE {page} ===")
        
        try:
            # Try both flavors
            for flavor in ['lattice', 'stream']:
                tables = camelot.read_pdf(pdf_path, pages=str(page), flavor=flavor)
                
                for i, table in enumerate(tables):
                    df = table.df
                    print(f"\nCamelot {flavor} - Table {i + 1}:")
                    print(f"Shape: {df.shape}, Accuracy: {table.accuracy}")
                    print(df.head())
                    
                    # Check if this looks like a floor joist table
                    df_text = ' '.join(df.astype(str).values.flatten()).lower()
                    if any(kw in df_text for kw in ['47x', 'joist', 'floor', 'span', 'c16', 'c24']):
                        print("*** POTENTIAL FLOOR JOIST TABLE! ***")
                        extracted_tables.append({
                            'page': page,
                            'method': f'camelot_{flavor}',
                            'table_index': i,
                            'dataframe': df,
                            'accuracy': table.accuracy
                        })
                        
                        # Save for manual inspection
                        df.to_csv(f'floor_joist_page_{page}_camelot_{flavor}_{i}.csv', index=False)
                        print(f"Saved to: floor_joist_page_{page}_camelot_{flavor}_{i}.csv")
        
        except Exception as e:
            print(f"Camelot failed on page {page}: {e}")
        
        # Try pdfplumber
        try:
            with pdfplumber.open(pdf_path) as pdf:
                page_obj = pdf.pages[page - 1]
                tables = page_obj.extract_tables()
                
                for i, table in enumerate(tables):
                    if table and len(table) > 3:
                        df = pd.DataFrame(table[1:], columns=table[0] if table[0] else None)
                        
                        print(f"\npdfplumber - Table {i + 1}:")
                        print(f"Shape: {df.shape}")
                        print(df.head())
                        
                        # Check if this looks like a floor joist table
                        df_text = ' '.join(df.astype(str).values.flatten()).lower()
                        if any(kw in df_text for kw in ['47x', 'joist', 'floor', 'span', 'c16', 'c24']):
                            print("*** POTENTIAL FLOOR JOIST TABLE! ***")
                            extracted_tables.append({
                                'page': page,
                                'method': 'pdfplumber',
                                'table_index': i,
                                'dataframe': df,
                                'accuracy': 'n/a'
                            })
                            
                            # Save for manual inspection
                            df.to_csv(f'floor_joist_page_{page}_pdfplumber_{i}.csv', index=False)
                            print(f"Saved to: floor_joist_page_{page}_pdfplumber_{i}.csv")
        
        except Exception as e:
            print(f"pdfplumber failed on page {page}: {e}")
    
    return extracted_tables

def parse_floor_joist_data(extracted_tables):
    """Parse extracted tables to identify actual floor joist span data"""
    
    print(f"\n=== PARSING {len(extracted_tables)} EXTRACTED TABLES ===")
    
    parsed_data = {
        'sources': [],
        'floor_joists': {
            'C16': {},
            'C24': {}
        }
    }
    
    for table_info in extracted_tables:
        df = table_info['dataframe']
        page = table_info['page']
        method = table_info['method']
        
        print(f"\nAnalyzing table from page {page} ({method}):")
        print(f"Shape: {df.shape}")
        print("First few rows:")
        print(df.head(10))
        
        # Try to identify the table structure
        # Look for timber sizes in column headers or first column
        # Look for spacing values (400, 450, 600)
        # Look for span values (decimals around 2-5 range)
        
        # Convert to string for pattern matching
        df_str = df.astype(str)
        
        # Look for timber size patterns
        timber_pattern = r'\b\d+\s*[xX×]\s*\d+\b'
        for col in df_str.columns:
            timber_matches = re.findall(timber_pattern, str(col))
            if timber_matches:
                print(f"Found timber sizes in headers: {timber_matches}")
        
        # Look for spacing patterns in data
        spacing_pattern = r'\b(400|450|600)\b'
        spacing_cells = []
        for row_idx, row in df_str.iterrows():
            for col_idx, cell in enumerate(row):
                spacing_matches = re.findall(spacing_pattern, str(cell))
                if spacing_matches:
                    spacing_cells.append((row_idx, col_idx, spacing_matches))
        
        if spacing_cells:
            print(f"Found spacing values: {spacing_cells[:5]}")
        
        # Look for span values (decimal numbers between 1 and 6)
        span_pattern = r'\b([1-6]\.\d+)\b'
        span_cells = []
        for row_idx, row in df_str.iterrows():
            for col_idx, cell in enumerate(row):
                span_matches = re.findall(span_pattern, str(cell))
                if span_matches:
                    span_cells.append((row_idx, col_idx, span_matches))
        
        if span_cells:
            print(f"Found potential span values: {span_cells[:10]}")
        
        # Record this table for analysis
        parsed_data['sources'].append({
            'page': page,
            'method': method,
            'shape': df.shape,
            'has_timber_sizes': bool(re.search(timber_pattern, df_str.to_string())),
            'has_spacings': bool(spacing_cells),
            'has_spans': bool(span_cells),
            'span_count': len(span_cells)
        })
    
    return parsed_data

def main():
    pdf_path = "trada_eurocode5_span_tables.pdf"
    
    print("=== EXPLORING TRADA PDF FOR FLOOR JOIST DATA ===")
    target_pages = explore_trada_pdf(pdf_path)
    
    if target_pages:
        print(f"\n=== EXTRACTING TABLES FROM PAGES: {target_pages} ===")
        extracted_tables = extract_floor_joist_tables(pdf_path, target_pages)
        
        if extracted_tables:
            print(f"\n=== PARSING EXTRACTED DATA ===")
            parsed_data = parse_floor_joist_data(extracted_tables)
            
            # Save analysis results
            with open('trada_analysis.json', 'w') as f:
                json.dump(parsed_data, f, indent=2, default=str)
            
            print(f"\nAnalysis saved to: trada_analysis.json")
            print(f"Found {len(extracted_tables)} potential floor joist tables")
        else:
            print("No suitable tables extracted")
    else:
        print("No pages with floor joist data found")

if __name__ == "__main__":
    main()