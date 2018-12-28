from utils.function import get_sqlalchemy_uri
from utils.setting import DATABASE

#2.3应用配置文件
class Config():
    SQLALCHEMY_DATABASE_URI=get_sqlalchemy_uri(DATABASE=DATABASE)
    SQLALCHEMY_TRACK_MODIFICATIONS=False
    PRESERVE_CONTEXT_ON_EXCEPTION=False
    SECRET_KEY='1234567890QWERTYUIOPASDFGHJKLZXCVBNM'