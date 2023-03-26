import shutil
import os

folder_name = "node_modules"

if os.path.exists(folder_name):
    shutil.rmtree(folder_name)
    print(f"{folder_name} folder removed.")
else:
    print(f"{folder_name} folder not found.")
