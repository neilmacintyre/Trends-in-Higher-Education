"""
Take 2 and 4 digit CIP codes and converts them to a csv
readable by hiearrchyCSV2JSON script
"""

import pandas as pd
import numpy as np


def build(file):
    cip_df = pd.read_csv(file)
    
    # Rename columns for easier refrence
    cip_df.columns = ['year', 'cip', 'enrollment']
    
    # Remove the column for Years and enrollment total
    cip_ser =  cip_df['cip']
   
    # Remove Duplicate CIP codes in each dataframe
    cip_ser = cip_ser.drop_duplicates()
    
    # Remove entries labled "Not Available"
    cip_ser = cip_ser[cip_ser != 'Not Available']
        
    # Index each data frame with the CIP code
    
    if file == '../Data/CSV/NCES/cip2.csv': 
        cip_df = cip_ser.str.extract(r'(\d{2})').dropna()
        cip_df['string2'] = cip_ser
    else: 
        cip_df = cip_ser.str.extract(r'(\d{2}).(\d{2})').dropna()
        cip_df['string4'] = cip_ser
    
    cip_df.rename(columns={0:'cip2'}, inplace=True)
    cip_df['cip2'] = cip_df['cip2'].astype('int32')
        
    return cip_df
    
    

    
if __name__ ==  '__main__':
    print('Building CSV File')
    
    cip_2_df = build('../Data/CSV/NCES/cip/cip2.csv')
    
    cip_4_df = build('../Data/CSV/NCES/cip/cip4.csv')
    
    # Combine the dataframe
    cip_combined = cip_2_df.join(cip_4_df.set_index('cip2'),on='cip2')[['string2', 'string4']]
    
    # Set Index to column 'string1'
    # Makes exported csv cleaner
    cip_combined = cip_combined.set_index('string2')
    
    
    # Export to CSV
    cip_combined.to_csv('../Data/CSV/NCES/cip/majorHierachy.csv')
    
    
    
    
    
    
    