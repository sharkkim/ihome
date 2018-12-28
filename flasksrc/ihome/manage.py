from flask_script import  Manager
from utils.app import create_app

#5调用——创建flask对象并完成文件配置的函数
ihome=create_app()


#6创建启动文件对象
manage=Manager(ihome)
if __name__ == '__main__':
    manage.run()