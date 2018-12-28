import os


#设置根路径
BASE_DIR=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TEMPLATE_PATH=os.path.join(BASE_DIR,'templates')
STATIC_PATH=os.path.join(BASE_DIR,'static')
MEDIA_PATH=os.path.join(STATIC_PATH,'media')

#2.1数据库配置
DATABASE={
    'ENGINE':'mysql',
    'DRIVER':'pymysql',
    'NAME':'ihome',
    'USER':'root',
    'PASSWORD':'123456',
    'HOST':'127.0.0.1',
    'PORT':'3306'
}