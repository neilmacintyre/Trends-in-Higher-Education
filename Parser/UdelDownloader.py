import requests

res = requests.get('https://www.udel.edu/apply/career-outcomes/jsondata/jsondata.json')
with open('../Data/Raw/Udel/data.json', 'w') as file:
    file.write(res.text)