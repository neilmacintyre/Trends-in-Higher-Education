"""
Converts hierarchy CSV into a JSON file so it is easier to parse in browser

Run in Analysis directory
"""

import csv
import json
import itertools

def parseIDName(s):
    """
    Takes string and returns tuple with signature (id, name)
    """

    split = s.split(' ')
    return (split[0], ' '.join(split[1:]))


if __name__ == '__main__':
    with open('../Data/CSV/NCES/cip/majorHierachy.csv') as file_in:
        with open('../Frontend/EnrollmentScatter/data/majorHierachy.json', 'w') as file_out:
            reader = csv.reader(file_in)
            headers = next(reader)
            
            json_dict = {} # dictionary that will be converted to json
            for row in reader:
                (d2_id, d2_name) = parseIDName(row[0])
                (d4_id, d4_name) = parseIDName(row[1])
                

                d2_cat = \
                json_dict[d2_id] = \
                    json_dict[d2_id] if d2_id in json_dict \
                    else {}
                d2_cat['name'] = d2_name
                d2_cat['d2'] = d2_id

                d4_cat = \
                d2_cat[d4_id] = \
                    d2_cat[d4_id] if d2_id in d2_cat \
                    else {}
                d4_cat['name'] = d4_name
                d2_cat['d4'] = d4_id

                

            file_out.write(json.dumps(json_dict))