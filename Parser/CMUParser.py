import PyPDF2
import re
import os
import csv

# different years appear to have a different structure 
# return tuple array with signature (major,  average salary, median salary, salary min, salary max, number reported)
def parse(src_pdf, year):
    avg = ''
    med = ''
    min = ''
    max = ''
    num_rep = ''

    if year == '2018':
           
        # patterns to get 
        na_pat = re.compile(r"(requires)(.*)")
        avg_pat = re.compile(r"(AVERAGE.*?\$)([0-9,\n]*)", re.DOTALL)
        med_pat = re.compile(r"(MEDIAN.*?\$)([0-9,\n]*)", re.DOTALL)
        min_pat = re.compile(r"(RANGE.*?\$)([0-9,\n]*)",  re.DOTALL)

        max_pat = re.compile(r"(RANGE.*\$.*)(\$|Œ\s)([0-9,\n]*)", re.DOTALL)
        report_pat = re.compile(r"(RANGE.*\$.*)(\$|Œ\s)(.*?\n.*?)(?P<ROI>[0-9]+?)([^0-9]*salaries)", re.DOTALL)

        with open(src_pdf, 'rb') as file:
            pdf = PyPDF2.PdfFileReader(file)
            page =  pdf.getPage(0)
            text = page.extractText()
               

            if na_pat.match(text) is not None:
                avg = '**'
                med = '**'
                min = '**'
                max = '**'
                num_rep = '**'
            else:
                try:
                    avg = ("").join(avg_pat.search(text).group(2).split('\n'))
                except AttributeError:
                    avg = '**'

                try:
                    med = ("").join(med_pat.search(text).group(2).split('\n'))
                except AttributeError:
                    med = '**'

                try:
                    min = ("").join(min_pat.search(text).group(2).split('\n'))
                except AttributeError:
                    min = '**'

                try:
                    max = ("").join(max_pat.search(text).group(3).split('\n'))
                except AttributeError:
                    max = '**'

                try:
                    num_rep = ("").join(report_pat.search(text).group('ROI').split('\n'))
                except AttributeError:
                    num_rep = '**'
            
    return [avg, med, min, max, num_rep]

# parses all the pdfs in a folder 
# and builds a csv file from them
# scheme is a follows:
'''
 ________________________________________________
|major| average | median | min | max | #reported |
 ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
'''
def make_csv_files(folder_path, des):
    year = folder_path[-5:-1]

    with open('%s/%s/data.csv' % (des, year), 'w') as csv_file:
        csv_writer = csv.writer(csv_file)
        csv_writer.writerow(['major', 'average','median','min','max','#reported' ])

        for file in os.listdir(folder_path):
            try:
                major = file.split('.')[0]
                
                csv_writer.writerow([major] + parse('%s%s' %(folder_path, file),  year))


            except OSError:
                print('Something went wrong while reading file %s' % file)   



make_csv_files('../Data/Raw/CMU/pdf/2018/', '../Data/CSV/CMU')            



