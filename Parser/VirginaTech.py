from lxml import html, etree
import csv


tree = html.parse('VT2018.html')
html = tree.getroot()

data_table_rows = html.xpath('//table//table/tbody/tr')

with open('VT_2017-2018.csv', 'w') as csv_file:
    for row in data_table_rows:
        cells = row.xpath('td')

        csv_string = ''
        for index, cell in enumerate(cells):
            csv_string +=  ('"' + cell.text + '"') if cell.text is not None else ''
            if 'colspan' in cell.attrib:
                span = cell.attrib['colspan']
                for i in range(0, int(span)):
                    csv_string += (',')
            else:
                if len(cells) != index - 1:
                    csv_string += (',')

            # last cell
            if len(cells)-1 == index:
                print('New Line')
                csv_string += '\r\n'

        csv_file.write(csv_string)




# print(type(tree))