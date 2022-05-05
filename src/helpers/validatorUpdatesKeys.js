
const validatorUpdateKeys = (allowedArrayKeys, body) => {
    const updates = Object.keys(body)
    const isValidOperation = updates.every( key => allowedArrayKeys.includes(key));
    return isValidOperation;
}

module.exports = validatorUpdateKeys;