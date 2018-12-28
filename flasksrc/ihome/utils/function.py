

from functools import wraps
from flask import session, redirect, url_for
#2.2配置SQLALCHEMY_DATABASE_URI属性
# 'mysql+pymysql://root:123456@127.0.0.1:3306/flask'

def get_sqlalchemy_uri(DATABASE):
    engine=DATABASE['ENGINE']
    driver=DATABASE['DRIVER']
    name=DATABASE['NAME']
    user=DATABASE['USER']
    password=DATABASE['PASSWORD']
    host=DATABASE['HOST']
    port=DATABASE['PORT']
    return  f'{engine}+{driver}://{user}:{password}@{host}:{port}/{name}'


#登录验证装饰器
def is_login(func):
    @wraps(func)
    def inner(*args,**kwargs):
        try:
            session['user_id']
        except:
            return redirect(url_for('house.index'))
        return func(*args,**kwargs)
    return inner