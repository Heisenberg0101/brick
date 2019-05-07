# print("hey,man")
# age = 9
# # 输入
# input()
#
# # 有序集合
# # 可变的
# list = []
# # 不可变
# tuple = ()
#
# # 判断
# if age>= 2:
#     print(9)
# elif age>= 5:
#     print(10)
# else:
#     print(11)
#
# # 字符串变成数字
# int()
#
# #
# list(range(3))
# [0,1,2]

# break直接退出循环
# continue 跳过这次循环

# 字典 dict
# d = {"a": 1,"b": 2}
# d["a"]
# 1

# 循环
for i in range(2):
    print("hello")
# 从零开始 打印出小于N的整数
N = 10
x = 0
while x < N:
    print x
    x = x + 1
#函数
def my_abs(x):
    if x >= 0:
        return x
    elif x < 0:
        return -x

# 占位符 pass
# 递归 阶乘
def fact(n):
    if n==1:
        return 1
    return n * fact(n-1)


# 斐波那契数列
# 递归
def fib(n):
    if n==1:
        return 1
    if n==2:
        return 1
    if n>=3:
        return fib(n-1)+fib(n-2)
# 迭代
