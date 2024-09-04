def clean_response_data(data, keys_to_remove=["password"]):
    """
    Removes specified keys from the serialized data.

    :param data: List or dict of serialized data
    :param keys_to_remove: List of keys to remove from the data
    :return: Cleaned data
    """
    if isinstance(data, list):
        for item in data:
            for key in keys_to_remove:
                item.pop(key, None)
    else:
        for key in keys_to_remove:
            data.pop(key, None)
    return data
