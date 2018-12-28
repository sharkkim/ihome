from flask import Flask
from ihome.h_views import house
from ihome.models import db
from ihome.o_views import order
from ihome.u_views import user
from utils.config import Config
from utils.setting import STATIC_PATH, TEMPLATE_PATH


def create_app():
    #1创建应用对象
    ihome=Flask(__name__,
                static_folder=STATIC_PATH,
                template_folder=TEMPLATE_PATH)


    #2.4加载配置文件
    ihome.config.from_object(Config)


    #3.3注册蓝图对象
    ihome.register_blueprint(blueprint=user,url_prefix='/user')
    ihome.register_blueprint(blueprint=house,url_prefix='/house')
    ihome.register_blueprint(blueprint=order,url_prefix='/order')

    #4.2初始化模型
    db.init_app(ihome)

    return ihome


