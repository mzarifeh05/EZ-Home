from pymongo import MongoClient
import pandas as pd

connection_string = "mongodb+srv://EZ-Home:EZ-Home2026@cluster0.hmnsg6m.mongodb.net/EZ-Home"

client = MongoClient(connection_string)

db = client["EZ-Home"]

#-----------carts------------

collection = db["carts"]

data = list(collection.find())

carts = pd.DataFrame(data)

print(carts)

#-----------categories------------

collection = db["categories"]

data = list(collection.find())

categories = pd.DataFrame(data)

print(categories)

#-----------orders------------

collection = db["orders"]

data = list(collection.find())

orders = pd.DataFrame(data)

print(orders)


#-----------products------------

collection = db["products"]

data = list(collection.find())

products = pd.DataFrame(data)

print(products)

#-----------users------------

collection = db["users"]

data = list(collection.find())

users = pd.DataFrame(data)

print(users)


#-----------wishlists------------

collection = db["wishlists"]

data = list(collection.find())

wishlists = pd.DataFrame(data)

print(wishlists)