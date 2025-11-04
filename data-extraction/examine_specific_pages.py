#!/usr/bin/env python3
"""
Examine specific pages that are likely to contain timber span tables
"""

import pdfplumber
import camelot
import pandas as pd
import re

def examine_pages_detail(pdf_path, pages_to_check):
    """Examine specific pages in detail"""
    
    with pdfplumber.open(pdf_path) as pdf:
        for page_num in pages_to_check:
            if page_num > len(pdf.pages):
                continue
                
            page = pdf.pages[page_num - 1]
            print(f"\n{'='*60}")
            print(f"PAGE {page_num} DETAILED EXAMINATION")
            print(f"{'='*60}")
            
            # Extract all text
            text = page.extract_text()
            print("TEXT CONTENT:")
            print(text[:1000] if text else "No text found")
            print("..." if len(text) > 1000 else "")
            
            # Look for specific timber-related patterns
            if text:
                # Look for table headers or timber size patterns
                patterns = [
                    r'\d+\s*x\s*\d+\s*mm',  # Timber sizes like 47x100mm
                    r'C\d+',  # Timber grades like C16, C24
                    r'\d+\s*mm\s*centres?',  # Spacing like 400mm centres
                    r'span|joist|timber|floor',  # Keywords
                    r'\d+\.\d+\s*m',  # Span measurements like 2.15m
                ]
                
                for pattern in patterns:
                    matches = re.findall(pattern, text, re.IGNORECASE)
                    if matches:
                        print(f"\nFOUND PATTERN '{pattern}': {matches[:10]}")
            
            # Extract tables
            tables = page.extract_tables()
            print(f"\nTABLES FOUND: {len(tables)}")
            
            for i, table in enumerate(tables):
                if table:
                    print(f"\nTable {i + 1}:")
                    print(f"Dimensions: {len(table)} rows x {len(table[0]) if table and table[0] else 0} cols")
                    
                    # Print the table content
                    for row_idx, row in enumerate(table[:8]):  # First 8 rows
                        print(f"  Row {row_idx + 1}: {row}")
                    
                    if len(table) > 8:
                        print(f"  ... ({len(table) - 8} more rows)")

def extract_with_camelot_specific_pages(pdf_path, pages):
    """Try Camelot on specific pages with different settings"""
    
    for page in pages:
        print(f"\n{'='*50}")
        print(f"CAMELOT EXTRACTION - PAGE {page}")
        print(f"{'='*50}")
        
        try:
            # Try different flavors and settings
            for flavor in ['lattice', 'stream']:
                print(f"\nTrying flavor: {flavor}")
                
                tables = camelot.read_pdf(pdf_path, pages=str(page), flavor=flavor)
                
                if tables:
                    print(f"Found {len(tables)} tables with {flavor}")
                    
                    for i, table in enumerate(tables):
                        print(f"\nTable {i + 1}:")
                        print(f"Accuracy: {table.accuracy}")
                        print(f"Shape: {table.df.shape}")
                        print("Data preview:")
                        print(table.df.head())
                        
                        # Check if this looks like timber data
                        df_text = ' '.join(table.df.astype(str).values.flatten()).lower()
                        if any(keyword in df_text for keyword in ['47x', 'mm', 'c16', 'c24', 'centres']):
                            print("*** POTENTIAL TIMBER SPAN TABLE! ***")
                            
                            # Save this promising table
                            table.to_csv(f'promising_table_page_{page}_table_{i}.csv')
                            print(f"Saved to: promising_table_page_{page}_table_{i}.csv")
                else:
                    print(f"No tables found with {flavor}")
                    
        except Exception as e:
            print(f"Error with Camelot on page {page}: {e}")

def main():
    pdf_path = "building_regs_approved_doc_a.pdf"
    
    # Pages that showed tables in the initial exploration
    promising_pages = [19, 20, 27, 30, 31, 32, 33, 34, 47, 48]
    
    print("EXAMINING PROMISING PAGES IN DETAIL")
    examine_pages_detail(pdf_path, promising_pages[:5])  # Check first 5 promising pages
    
    print("\n\nTRYING CAMELOT WITH DIFFERENT SETTINGS")
    extract_with_camelot_specific_pages(pdf_path, promising_pages[:3])  # Try Camelot on first 3

if __name__ == "__main__":
    main()