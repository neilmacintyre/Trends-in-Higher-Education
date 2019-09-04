from lxml import html, etree

start_year = 2005
end_year = 2018

'''
tree = html.parse('../Data/Raw/VirginaTech/VT2005-2006.html')
print(etree.tostring(tree))

tree = html.parse('VT2018.html')
'''

for year in range(start_year, end_year):
    tree = html.parse('../Data/Raw/VirginaTech/VT%d-%d.html' % (year,  year+1))
    html_file = tree.getroot()

    data_table_rows = html_file.xpath('//table//table//tr')
    print(len(data_table_rows))

    with open('../Data/CSV/VT%d-%d.csv' % (year,  year+1), 'w') as csv_file:
        for row in data_table_rows:
            #print('row', row.text_content())
            cells = row.xpath('td')

            csv_string = ''
            for index, cell in enumerate(cells):
                csv_string += ('"' + cell.text + '"') if cell.text is not None else ''
                if 'colspan' in cell.attrib:
                    span = cell.attrib['colspan']
                    for i in range(0, int(span)):
                        csv_string += (',')
                else:
                    if len(cells) != index - 1:
                        csv_string += (',')

                # last cell
                if len(cells)-1 == index:
                    csv_string += '\r\n'

            csv_file.write(csv_string)


