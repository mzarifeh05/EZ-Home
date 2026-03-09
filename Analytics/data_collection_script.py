from pymongo import MongoClient
import pandas as pd
from bson import ObjectId
import json

connection_string = "mongodb+srv://EZ-Home:EZ-Home2026@cluster0.hmnsg6m.mongodb.net/EZ-Home"

client = MongoClient(connection_string)

db = client["EZ-Home"]

#-----------Cleaning Function to handle ObjectId() ------------

def clean_mongo_types(data):
    if isinstance(data, list):
        return [clean_mongo_types(item) for item in data]
    elif isinstance(data, dict):
        return {key: clean_mongo_types(value) for key, value in data.items()}
    elif isinstance(data, ObjectId):
        return str(data)
    else:
        return data

#-----------Fetching Data (Collections) Function------------

def get_and_clean_table(collection_name):

    raw_data = list(db[collection_name].find())    
    cleaned_data = clean_mongo_types(raw_data)
        # To let power BI define these columns as JSON     
    for doc in cleaned_data:
        if collection_name == "orders":
            doc['items'] = json.dumps(doc.get('items', []))
            doc['customer'] = json.dumps(doc.get('customer', {}))
        if collection_name == "wishlists":
            doc['products'] = json.dumps(doc.get('products', []))
        if collection_name == "carts":
            doc['items'] = json.dumps(doc.get('items', []))

    return pd.DataFrame(cleaned_data)



#-----------carts------------

carts = get_and_clean_table("carts")

#-----------categories------------

categories = get_and_clean_table("categories")

#-----------orders------------

orders = get_and_clean_table("orders")


#-----------products------------

products = get_and_clean_table("products")

#-----------users------------

users = get_and_clean_table("users")


#-----------wishlists------------

wishlists = get_and_clean_table("wishlists")