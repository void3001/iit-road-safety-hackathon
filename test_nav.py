from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import time

options = Options()
options.add_argument('--headless')
options.add_argument('--disable-gpu')
options.add_argument('--window-size=1920,1080')

driver = webdriver.Chrome(options=options)
try:
    driver.get('file:///C:/Users/AJAY A T/OneDrive/Documents/iit road safety hackathon/index.html')
    time.sleep(1)
    
    # Check console logs on load
    print('Logs on load:', driver.get_log('browser'))
    
    # Click Law Bot link
    lawbot_link = driver.find_element(By.CSS_SELECTOR, 'a[href="#lawbot"]')
    lawbot_link.click()
    time.sleep(1)
    
    # Check active page
    active_page = driver.find_element(By.CSS_SELECTOR, '.page.active')
    print('Active page ID:', active_page.get_attribute('id'))
    print('Active page is displayed:', active_page.is_displayed())
    print('Active page height:', active_page.size['height'])
    
    # Check console logs after click
    print('Logs after click:', driver.get_log('browser'))
    
    driver.save_screenshot('C:/Users/AJAY A T/OneDrive/Documents/iit road safety hackathon/screenshot.png')
finally:
    driver.quit()
