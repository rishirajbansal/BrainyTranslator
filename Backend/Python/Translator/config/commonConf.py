

# File Upload configs
TRANSLATE_FILE_UPLOAD = {
    "max_file_size": 10,  # File size in MB

    "allowable_file_types": "pdf|txt"  # For all '*' can be use else mention file exts '|' seperated without dots
}

# AWS translate max chunk size (in bytes)
MAX_TRANSLATE_CHUNK_SIZE = 5000
# Extra space allowed for chunks that can be increased after translation,
# for ex: 10 words of English can increase into 12 words in Spanish
CHUNK_FOR_EXTRA_SPACE = 100
