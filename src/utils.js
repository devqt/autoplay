

export function findMap (data, findKey, value) {
    if (!data || !findKey) {
        return;
    }
    return data.find(item => item[findKey] === value);
}