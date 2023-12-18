// For now, these just console.log the paths
/**
 * console.log all of the (deep) keys on `obj` that match `regexQuery` using a recursive DFS method
 * @param {Object} obj The object
 * @param {RegExp} regexQuery Match the key (not the full path)
 * @param {string} rootPath The name of the root node
 * @param {Set<Object>} _memo private
 * @returns 
 */
export function walk_dfs(obj, regexQuery, rootPath = "<root>", _memo = null) {
    if (obj !== Object(obj)) return;
    if ((_memo ??= new Set).has(obj)) return;
    _memo.add(obj);
    for (let k in obj) {
        let fullPath = rootPath + '.' + k;
        if (regexQuery.test(k)) {
            console.log(fullPath);
        }
        walk_dfs(obj[k], regexQuery, fullPath, _memo);
    }
}

const NOT_IN_PATHMAP = "Encountered path that was not in pathMap. " +
    "Please report this as an issue to https://github.com/MarcellPerger1/js_walk_object if it hasn't been reported already";

/**
 * console.log all of the (deep) keys on `obj` that match `regexQuery` using an iterative BFS method
 * @param {Object} obj The object
 * @param {RegExp} regexQuery Match the full path (not the key)
 * @param {string} rootPath The name of the root node
 * @returns 
 */
export function walk_bfs(startObj, regexQuery, rootPath = "<root>") {
    let openQueue = new Set([startObj]), closed = new Set;
    let pathMap = new Map([[startObj, rootPath]]);
    // set iterates from earliest first insertion -> latest first inserted 
    // and allows mutation while iterating so acts as a LIFO queue:
    // We iterate over it, inserting items at the 'end' of the stuff to iterate,
    // stopping when none left
    for (let obj of openQueue) {
        closed.add(obj);
        for (let k in obj) {
            let v = obj[k];
            if (closed.has(v) || openQueue.has(v)) continue;
            let fullPath = (pathMap.get(obj) ?? (console.warn(NOT_IN_PATHMAP), '<???>')) + '.' + k;
            if (regexQuery.test(fullPath)) {
                console.log(fullPath);
            }
            pathMap.set(v, fullPath);
            openQueue.add(v);
        }
    }
}
