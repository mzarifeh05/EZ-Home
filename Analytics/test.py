# ==========================================
# STEP 1: IMPORT REQUIRED LIBRARIES
# ==========================================
# pymongo: To connect and talk to your MongoDB database.
# pandas: Power BI reads data using Pandas DataFrames (tables). 
# ObjectId: We need to import this specific type from bson so our script knows what to look for and fix.
from pymongo import MongoClient
import pandas as pd
from bson import ObjectId
import json

# ==========================================
# STEP 2: CONNECT TO MONGODB
# ==========================================
# Establish the connection using your string. 
connection_string = "mongodb+srv://EZ-Home:EZ-Home2026@cluster0.hmnsg6m.mongodb.net/EZ-Home"
client = MongoClient(connection_string)

# Select the specific database
db = client["EZ-Home"]

# ==========================================
# STEP 3: THE "CLEANING" FUNCTION (The Magic)
# ==========================================
# This is a "recursive" function. That means if it finds a list inside a list, 
# or a dictionary inside a list, it will call itself to dig deeper until it hits the bottom.
# This single function handles your wishlists, carts, and orders examples automatically.
def clean_mongo_types(data):
    
    # SCENARIO A: The data is a List (e.g., wishlists[products] or carts[items])
    if isinstance(data, list):
        # Loop through every item in the list and run it through this cleaner again.
        return [clean_mongo_types(item) for item in data]
    
    # SCENARIO B: The data is a Dictionary/Object (e.g., orders[customer] or individual cart items)
    elif isinstance(data, dict):
        # Loop through every key-value pair and run the *value* through the cleaner.
        return {key: clean_mongo_types(value) for key, value in data.items()}
    
    # SCENARIO C: The data is an ObjectId (The root cause of Power BI errors)
    elif isinstance(data, ObjectId):
        # Convert the ObjectId into a standard Python String. 
        # Example: ObjectId('69a...') becomes just "69a..."
        return str(data)
    
    # SCENARIO D: The data is normal (text, numbers, booleans, etc.)
    else:
        # Just return it exactly as it is.
        return data

# ==========================================
# STEP 4: FETCH AND TRANSFORM COLLECTIONS
# ==========================================
# We define a helper function to avoid writing the same code 6 times.
# It fetches the data, cleans it, and turns it into a Power BI-ready table.
def get_and_clean_table(collection_name):
    # 1. Fetch raw data from MongoDB
    raw_data = list(db[collection_name].find())
    
    # 2. Pass the raw data through our cleaner function
    cleaned_data = clean_mongo_types(raw_data)
    
    for doc in cleaned_data:
        if collection_name == "orders":
            doc['items'] = json.dumps(doc.get('items', []))
            doc['customer'] = json.dumps(doc.get('customer', {}))
        if collection_name == "wishlists":
            doc['products'] = json.dumps(doc.get('products', []))
        if collection_name == "carts":
            doc['items'] = json.dumps(doc.get('items', []))

    # 3. Convert the clean data into a Pandas DataFrame
    return pd.DataFrame(cleaned_data)

# ==========================================
# STEP 5: CREATE THE FINAL POWER BI TABLES
# ==========================================
# Power BI automatically looks for any Pandas DataFrames created in this script 
# and turns them into selectable tables in the "Navigator" window.

carts = get_and_clean_table("carts")
categories = get_and_clean_table("categories")
orders = get_and_clean_table("orders")
products = get_and_clean_table("products")
users = get_and_clean_table("users")
wishlists = get_and_clean_table("wishlists")

# (Note: You do not need to "print" or call the dataframes at the end. 
# Power BI captures them just by them existing as variables).