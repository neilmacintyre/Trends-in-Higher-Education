import pandas as pd
import numpy as np
import re

def clean_cip(col_str):
    #print(col_str)
    match = re.search('(\d{2}).(\d{2}|XX)', col_str)
    if match is None:
        return ('REMOVE',np.NaN)
    else:
        return (match.group(1), match.group(2))

def cip_multi(col_strs):
    cip_tups = [clean_cip(col) for col in col_strs]
    multi = pd.MultiIndex.from_tuples(cip_tups)
    return  multi

def is_num(val):
    # determine if value can be cased to int
    try:
        int(val)
    except ValueError:
        return False
    return True

if __name__ == '__main__':
    print("Cleaning Data...")

    # convert to Panda DF
    df = pd.read_csv('../Data/CSV/NCES/cip4.csv')

    # remove years where cip is unavialble
    df = df.drop(list(range(0,21)))

    # rename columns
    df.columns = pd.Index(["year", "cip", "enrollment"])

    # remove anything that can't be cast to a numeric to Nan
    mask = df['enrollment'].apply(is_num)
    df = df[mask] 
    
    
    # convert enrolment to numeric
    df.loc[:,'enrollment'] = df.loc[:,'enrollment'].astype(dtype=np.int32)
   
    # Reshape data
    df = df.pivot(index="year", columns="cip", values="enrollment")

       
    # clean cip column names
    df.columns = cip_multi(df.columns)
    
    # Build cip4 table
    df_cip4 = df.copy()
    # Combine MultiIndex
    df_cip4.columns = ['%s.%s' % col  for col in df.columns]
    
    

    # sum and combine all values in the lower index of the columns multi index
    df_cip2 = df.groupby(axis=1, level=0).sum()
    

    
    # add column for total enrollment in a given year
    df_cip2['year_total'] = df_cip2.T.sum()
    
    # Combine Cips into one file
    df_combo = df_cip2.merge(df_cip4, on=df_cip4.index).fillna(0).set_index('key_0')
    df_combo.index.name = 'year'

    #write to file
    df_combo.to_csv('../Frontend/EnrollmentScatter/data/data.csv') 
   
    