# -*- coding: utf-8 -*-
"""
Created on Sat Jun 22 23:07:21 2019

@author: Neil Macintyre
"""
from functools import reduce
import itertools
from matplotlib import pyplot as plt
import pandas as pd
import numpy as np
from scipy.cluster.vq import kmeans2
import matplotlib.cm as cm
import matplotlib.colors as colors



def clean(a, x):
    # reduce function that converts str to int 
    if x == '.':
        return a + [np.NaN]
    else:
        return a + [int(x)]
    
def getTotalYearlyEnrollments(df):
    years = df.index.values
    
    total_enrollment =  np.ndarray(len(years))
    for index, (_, row) in enumerate(df.iterrows()):
        total_enrollment[index] = row.sum()
        
    return total_enrollment
    
    
def plotTotalEnrollment(df):
    years = df.index.values
    
    total_enrollment = getTotalYearlyEnrollments(df)
        
    plt.plot(years, total_enrollment)
    plt.show()
    
def plotYOY(major, df):
    #plots the year over year percentage change of major
    years = df.index.values
        
    fig, ax1 = plt.subplots()
    
    fig.suptitle(major)
    
    yoy = df.get(major).pct_change()
    ax1.plot(years,yoy)
    
    ax2 = ax1.twinx()
    ax2.plot(years, df.get(major)/getTotalYearlyEnrollments(df), color='tab:red')    
    
    plt.show()
    
def plotRealativeEnrollment(major, df):
    """
    plots a majors percentage of enrollment compared to total
    """
    years = df.index.values
    
    fig, ax1 = plt.subplots()
    
    fig.suptitle(major)
    
    rel = df.get(major)/getTotalYearlyEnrollments(df)
    ax1.plot(years,rel)
    
    ax2 = ax1.twinx()
    ax2.plot(years, df.get(major), color='tab:red')    
    
    
    #print(major)
    
    plt.show()
    
    

def clusterMajors(df, n):
    """
    clusters majors based on how they change 
    majors that change together
    
    n - number of different clusters
    """
    
    # convert to percentage change year over year 
    global yoy 
    yoy = df.pct_change(fill_method='bfill')
    
    global smoothed_yoy
    win_len = 10
    smoothed_yoy = pd.DataFrame(np.ndarray([df.shape[0]-win_len-1, df.shape[1]]), df.index[win_len:-1], df.columns)
        
    
    for major in yoy.columns:
        major_smoothed = np.convolve(yoy.loc[:,major].values, np.hanning(win_len))[win_len*2-1:-1]
        smoothed_yoy[major] = major_smoothed
    
   
    global clusters
    _, clusters = kmeans2(smoothed_yoy.to_numpy().transpose(),n, iter=20, minit='++')
    
    c_map = cm.tab20(np.arange(7))
    
   
    return clusters
    
    



def cluster_joint_prob_matrix(df, n, m):
    """
    Runs cluster major n times with m clusters
    
    counts the number of times each major appears in the same cluster
    returns the probablity that each 
    ideally the matrix will be filled with numbers close to 0 and 1 but not in between
    """
    #using matrix multiplcation and filtering
    global joint_sum 
    joint_sum = np.zeros((df.shape[1],df.shape[1]))
    
    rand_cmap(5,'bright', verbose=True)
    
    for n in range(n):
        clusters = clusterMajors(df, m)
        
        cluster_matrix = np.broadcast_to(clusters, (len(clusters),len(clusters)))
    
        joint_sum = np.add(joint_sum, np.equal(cluster_matrix, cluster_matrix.T).astype('int16'))
        
        
    global joint_prob
    joint_prob = np.divide(joint_sum, n+1)
        
    
    
    
    
    
    
 
    
    
if __name__ == '__main__':
    csv_df = pd.read_csv('../Data/CSV/NCES/enrollment.csv')
    csv_df = csv_df.set_index('Year')
    
    # clean the data
    # this depends slighly on how wholes in the data should be appropriately determined
    # are they 0? or catagorized differently
    # for now we will assume 0
    data = np.ndarray(csv_df.shape)
    for index, (_, row) in enumerate(csv_df.iterrows()):
         a = np.array(reduce(clean, row, []))
         data[index] = np.ma.masked_invalid(a)
    
    df = pd.DataFrame(data, csv_df.index, csv_df.columns, dtype='float64')
    
    clusterMajors(df, 7)
    #cluster_joint_prob_matrix(df, 100, 4)
    
    #plotTotalEnrollment(df)
    
    
    for col in df.columns[0:14]:
        # TODO only plot majors that above 1 percent
        ...
        #plotRealativeEnrollment(col,df)
        #plotYOY(col,df)
    
    
        
    
