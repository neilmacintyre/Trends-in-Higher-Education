from lxml import html
import requests
import re

start_year = 2015
end_year = 2018

# download each years html 
def download_html():
    for year in range(start_year, end_year+1):
        res = requests.get('https://www.cmu.edu/career/about-us/salaries_and_destinations/%s.html' % year)

        with open('../Data/Raw/CMU/html/%s.html' % (year), 'w') as html_file:
            html_file.write(res.text)


# collect all the links from the page that should be downloaded
def get_links_to_pdf(file_path, year):
    majors = [] # each element as a tuple with sig (tuple name,  link address)
    with open(file_path) as html_file:
        tree = html.parse(html_file)
        root = tree.getroot()
        
        if year == 2018:
            titles = root.xpath('//div[ul/li/a/text() = "Bachelor\'s"]/preceding-sibling::h2[1]/text()')
            links = root.xpath('//ul/li/a[text() = "Bachelor\'s"]/@href')
        else:
            print('html structure differs between years -- implement')

        if(len(titles) == len(links)):
            majors = [(titles[i],links[i]) for i in range(len(titles))]
        else:
            print('Discrepancy in number of titles and links found')


    return majors

# download pdfs from links to appropriate folder
def download_pdf(links, des, year):
    link_head = 'https://www.cmu.edu/career/'
    for i in range (0, len(links)):
        link_tail = links[i][1][6:]
        link = link_head + link_tail 
        print(link)

       
        with open('%s/%s/%s.pdf' % (des, year, links[i][0]), 'wb') as pdf:
           res = requests.get(link)
           # https://2.python-requests.org//en/master/user/quickstart/#raw-response-content
           for chunk in res.iter_content(chunk_size=128):
                pdf.write(chunk)



download_pdf(get_links_to_pdf('../Data/Raw/CMU/html/%s.html' % 2018, 2018),
 '../Data/Raw/CMU/pdf', 2018)