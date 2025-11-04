#!/usr/bin/env python3
"""
Search for actual timber span tables in the Building Regulations PDF
"""

import pdfplumber
import re

def search_entire_pdf(pdf_path):
    """Search the entire PDF for timber span data"""
    
    with pdfplumber.open(pdf_path) as pdf:
        print(f"Searching {len(pdf.pages)} pages for timber span data...")
        
        timber_span_pages = []
        
        for i, page in enumerate(pdf.pages):
            page_num = i + 1
            text = page.extract_text()
            
            if text:
                text_lower = text.lower()
                
                # Look for timber span specific keywords
                span_keywords = [
                    'span table', 'timber span', 'joist span', 'floor joist',
                    'ceiling joist', 'rafter span', '47x100', '47x150', 
                    '47x200', '47x225', 'c16', 'c24', 'mm centres',
                    'maximum span', 'permissible span'
                ]
                
                keyword_matches = [kw for kw in span_keywords if kw in text_lower]
                
                if keyword_matches:
                    print(f"\nPage {page_num}: Found keywords {keyword_matches}")
                    
                    # Look for numerical patterns that suggest span tables
                    timber_sizes = re.findall(r'\b\d+\s*[xX×]\s*\d+\b', text)
                    spans = re.findall(r'\b\d+\.\d+\s*m\b', text)
                    spacings = re.findall(r'\b\d+\s*mm\s+centres?\b', text, re.IGNORECASE)
                    
                    if timber_sizes:
                        print(f"  Timber sizes found: {timber_sizes[:5]}")
                    if spans:
                        print(f"  Span measurements: {spans[:5]}")
                    if spacings:
                        print(f"  Joist spacings: {spacings[:3]}")
                    
                    # Show context around timber references
                    lines = text.split('\n')
                    for line_idx, line in enumerate(lines):
                        if any(kw in line.lower() for kw in ['timber', 'joist', 'span table']):
                            print(f"  Context: {line.strip()}")
                            # Show surrounding lines
                            for j in range(max(0, line_idx-2), min(len(lines), line_idx+3)):
                                if j != line_idx and lines[j].strip():
                                    print(f"    {lines[j].strip()}")
                            print()
                    
                    timber_span_pages.append(page_num)
                    
                    # Extract tables on promising pages
                    tables = page.extract_tables()
                    if tables:
                        print(f"  Found {len(tables)} tables on this page")
                        for table_idx, table in enumerate(tables):
                            if table and len(table) > 3:
                                print(f"    Table {table_idx + 1}: {len(table)} rows")
                                # Show first few rows
                                for row in table[:3]:
                                    print(f"      {row}")
        
        return timber_span_pages

def check_appendices(pdf_path):
    """Look specifically for appendices that might contain span tables"""
    
    with pdfplumber.open(pdf_path) as pdf:
        print(f"\nLooking for appendices in {len(pdf.pages)} pages...")
        
        for i, page in enumerate(pdf.pages):
            page_num = i + 1
            text = page.extract_text()
            
            if text:
                text_lower = text.lower()
                
                # Look for appendix indicators
                if any(word in text_lower for word in ['appendix', 'annex', 'table a', 'section a']):
                    print(f"\nPage {page_num}: Possible appendix content")
                    
                    # Show first part of the page
                    lines = text.split('\n')[:10]
                    for line in lines:
                        if line.strip():
                            print(f"  {line.strip()}")

def main():
    pdf_path = "building_regs_approved_doc_a.pdf"
    
    print("=== COMPREHENSIVE SEARCH FOR TIMBER SPAN DATA ===")
    timber_pages = search_entire_pdf(pdf_path)
    
    print(f"\n=== SUMMARY ===")
    print(f"Pages with potential timber span data: {timber_pages}")
    
    print("\n=== CHECKING FOR APPENDICES ===")
    check_appendices(pdf_path)

if __name__ == "__main__":
    main()