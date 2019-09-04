import requests

url_base = 'https://career.sites.clemson.edu/data_analytics/table_cmd.php?action=getCollege&year='
url_terminal = '&college=All&mode=false&deg_bac=true&deg_mas=true&deg_doc=true&csv=true'

start_year = 2009
end_year = 2016

for year in range(start_year,  end_year):
    # urls are of the format url_base + XX_YY + url_terminal where XX and YY are the acidemic years
    XX =  str(year)[2:4]
    YY =  str(year + 1)[2:4]

    res = requests.get('%s%s_%s%s' % (url_base,XX,YY,url_terminal))

    with open('../Data/CSV/Clemson/%d-%d.csv' % (year, year + 1), 'w') as csv_file:
        csv_file.write(res.text)