import pandas as pd
import numpy as np
import re
from selenium import webdriver
from selenium.webdriver.common.keys import Keys

def getData(link, year):
    # gather data from webpage
    #driver.get("http://127.0.0.1:8080/Career%20Outcomes%20_%20University%20of%20Delaware.html")

    driver = webdriver.Firefox()
    driver.get(link)
    #alisas
    
    datas = []

    majors =[] #  make a dic of colleges that need to be visited list of majors in college

    year_current = updateDropDownElement(driver,"yearDropDownBrowse", year)
    year_current.click()

    college_current = updateDropDownElement(driver,"collegesDropDown", 'All Colleges')
    college_current.click()

    major_dropdown = driver.find_element_by_css_selector("select#udelco-majorsDropDown") 
    major_options = major_dropdown.find_elements_by_tag_name("option")

    majors = [m.text for m in major_options]

    
    # select element and get data from it
    for m in majors:
        major_current = updateDropDownElement(driver,"majorsDropDown", m)
        major_current.click()
        d = getDataFromPage(driver)
        print(d)

        datas.append([m,year] + d)

    driver.quit()
    return datas

def updateDropDownElement(driver, dropDown_selector, option_value):
    '''
    The elments are 'stale so they need to be updated'
    '''
    dropdown = driver.find_element_by_css_selector("select#udelco-%s" % (dropDown_selector)) #updates incase page is refreshed
    element_current = dropdown.find_element_by_xpath('//option[text()="%s"]' % (option_value))

    return element_current

def getDataFromPage(driver):
    dcss = driver.find_element_by_css_selector
    # reporting stats sub-cols
    reporting_grads = driver.find_element_by_css_selector('.fd1').text
    total_grad = driver.find_element_by_css_selector('.fd2').text 
    saliers_reported = driver.find_element_by_css_selector('.ed11Count').text 
    number_reg = re.compile(r'(\d*)')
    saliers_reported = number_reg.search(saliers_reported).group(0)

    # salaries sub-columsn
    # TODO test on doc that is missing this data
    low_sal = dcss('.ed13LowCount').text
    median_sal = dcss('.ed14MedianCount').text
    mean_sal = dcss('.ed13Mean').text
    high_sal = dcss('.ed12HighCount').text

    # carreer oucomes sub-cols
    employed = dcss('.fd3employedBarChart').text
    continued_ed = dcss('.fd5continuingEducation').text
    seeking_employment = dcss('.fd7seekingEmployment').text
    seeking_continued_ed = dcss('.fd9seekingToContinueEducation').text

    # employment sub-cols
    fprofit = dcss('.ed3ProfitBarChart').text
    N4profit = dcss('.ed5NonProfitBarChart').text
    k12 = dcss('.ed7K12BarChart').text
    gov = dcss('.ed9GovernmentBarChart').text


    # continued ed sub cols
    masters = dcss('.ce1-mastersdegree').text
    doc = dcss('.ce5-professional-degree').text
    profesional = dcss('.ce5-professional-degree').text
    second_bachlors = dcss('.ce14-additional-degree').text
    non_degree_certificate = dcss('.ce12-non-professional-degree').text


    data = [reporting_grads, total_grad, saliers_reported, low_sal, median_sal,\
        mean_sal, high_sal,employed, continued_ed, seeking_employment, seeking_continued_ed,\
        fprofit, N4profit, k12, gov, masters, doc, profesional, second_bachlors, non_degree_certificate
        ]
    
    return data

def buildTable(data):
    data = list(zip(*data))
    data = [list(datum) for datum in data]

    years = data[0]
    college = 'NOT RECORDED REMOVE'
    major = data[1]

    # reporting stats sub-cols
    reporting_grads = data[2]
    total_grad = data[3]
    saliers_reported = data[4]

    # salaries sub-columsn
    low_sal = data[5]
    median_sal = data[6]
    mean_sal = data[7]
    high_sal =data[8]

    # carreer oucomes sub-cols
    employed =data[9]
    continued_ed = data[10]
    seeking_employment = data[11]
    seeking_continued_ed = data[12]

    # employment sub-cols
    fprofit = data[13]
    N4profit = data[14]
    k12 = data[15]
    gov = data[16]

    # continued ed sub cols
    masters = data[17]
    doc = data[18]
    profesional = data[19]
    second_bachlors = data[20]
    non_degree_certificate = data[21]

    cols = np.transpose(data[2:])
    

    
    sub_col_names =np.transpose( ['# Of Reporting Grads', 'Total # of Grads', 'Salaries Reported', '25%', '50%',\
        'Mean Salary', '75%','Employed', 'Continued Edu', 'Seeking Employment', 'Seeking Continued Edu',\
        'For Profit', 'Not for Profit', 'K12', 'Goverment', 'Masters', 'Doc', 'Profesional', 'Second Bachlors', 'Non Degree Certificate'
        ])
    col_names = np.transpose( [
        'reporting stats','reporting stats','reporting stats',\
        'Salary Data','Salary Data','Salary Data','Salary Data',\
        'Career Outcomes', 'Career Outcomes', 'Career Outcomes', 'Career Outcomes',\
        'Employment Sector', 'Employment Sector', 'Employment Sector', 'Employment Sector',\
        'Continued Education', 'Continued Education', 'Continued Education', 'Continued Education', 'Continued Education'])
    

    #  columns=pd.MultiIndex.from_arrays([col_names, sub_col_names])
    df = pd.DataFrame(cols, index = [major, years], columns=pd.MultiIndex.from_arrays([col_names, sub_col_names]))
    print(df)

    df.to_csv('../Data/CSV/Udel/testExport.csv')

links = [ "Accounting", "Actuarial Sciences", "Africana Studies", "Agricultural Education", "Agriculture and Natural Resources", "Ancient Greek and Roman Studies", "Animal Science", "Anthropology", "Anthropology Education", "Apparel Design", "Applied Mathematics", "Applied Music", "Applied Nutrition", "Art", "Art Conservation", "Art History", "Asian Studies", "Athletic Training", "Biochemistry", "Biological Sciences", "Biological Sciences BA", "Biological Sciences BS", "Biological Sciences Education", "Biomedical Engineering", "Business Undeclared", "Chemical Engineering", "Chemistry", "Chemistry BA", "Chemistry BS", "Chemistry Education", "Chinese Studies", "Civil Engineering", "Classics and History", "Cognitive Science", "Communication", "Comparative Literature", "Computer Engineering", "Computer Science", "Computer Science BA", "Computer Science BS", "Criminal Justice", "Early Childhood Education", "Earth Science Education", "Ecology", "Economics", "Economics BA", "Economics BS", "Economics Education", "Electrical Engineering", "Elementary Teacher Education", "Energy and Environmental Policy", "Engineering Technology", "Engineering Undecided", "English", "English Education", "Entrepreneurship & Technology Innovation", "Environmental and Resource Economics", "Environmental Engineering", "Environmental Science", "Environmental Soil Science", "Environmental Studies", "European Studies", "Exercise Science", "Fashion Merchandising", "Finance", "Financial Planning and Wealth Management", "Fine Arts", "Food and Agribusiness Marketing and Management", "Food Science", "French and History", "French and Political Sciences", "French Education", "French Studies", "Geography", "Geography Education", "Geological Sciences", "Geological Sciences BA", "Geological Sciences BS", "German and History", "German and Political Science", "German Education", "German Studies", "Health and Physical Education", "Health Behavior Science", "Health Sciences/Occupational Therapy", "History", "History and Foreign Language", "History Education", "Hospitality Industry Management", "Hotel, Restaurant and Institutional Management", "Human Services", "Information Systems", "Insect Ecology and Conservation", "International Business Studies", "International Relations", "Italian Education", "Italian Studies", "Japanese Studies", "Landscape Architecture", "Landscape Horticulture and Design", "Languages, Literatures and Cultures", "Latin American and Iberian Studies", "Latin Education", "Liberal Studies", "Linguistics", "Linguistics and French", "Management", "Management Information Systems", "Marine Science", "Marketing", "Material Culture Preservation", "Mathematics", "Mathematics BA", "Mathematics BS", "Mathematics and Economics", "Mathematics Education", "Mathematics Education BA", "Mathematics Education BS", "Mechanical Engineering", "Medical Diagnostics", "Medical Diagnostics-Pre Physician Assistant", "Medical Laboratory Science", "Meteorology and Climatology", "Music", "Music - Applied", "Music Composition", "Music Education", "Music History and Literature", "Music Management", "Music Theory", "Natural Resource Management", "Neuroscience", "Nursing", "Nutrition and Dietetics", "Nutritional Science", "Occupational Therapy", "Operations Management", "Organizational and Community Leadership", "Pharmaceutical Sciences", "Philosophy", "Physics", "Physics BA", "Physics BS", "Physics Education", "Plant Protection", "Plant Science", "Political Science", "Political Science Education", "Pre-Veterinary Medicine and Animal Biosciences", "Psychology", "Psychology BA", "Psychology BS", "Psychology Education", "Public Horticulture", "Public Policy", "Quantitative Biology", "Russian and History", "Russian Studies", "Sociology", "Sociology Education", "Spanish and History", "Spanish and Political Science", "Spanish Education", "Spanish Studies", "Sport Management", "Statistics", "Three Foreign Languages", "University Studies", "Visual Communications", "Wildlife Ecology and Conservation", "Women and Gender Studies"]
      

if __name__ == '__main__':
    #buildTable()
    #launchProxyServer()
    data = []
    
    for year in range(2015, 2019):
        # APPEND!!
        data.extend(getData("http://127.0.0.1:8080/Career Outcomes _ University of Delaware.html", year))
 
            
    print(data)
    buildTable(data)



    
    