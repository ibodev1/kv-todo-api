/*
 * Generic Functions Deno KV
 */

const kv = await Deno.openKv();

const insert = async (key: Deno.KvKey, value: unknown) => {
    try {
        const res = await kv.set(key, value);
        return res.ok;
    } catch (error) {
        throw error;
    }
}

const list = async <T>(prefix: Deno.KvKey) => {
    try {
        const dataList: T[] = [];
        for await (const iter of kv.list<T>({ prefix })) {
            dataList.push(iter.value)
        }
        return dataList;
    } catch (error) {
        throw error;
    }
}

const get = async <T>(key: Deno.KvKey) => {
    try {
        const res = await kv.get<T>(key);
        return res.value;
    } catch (error) {
        throw error;
    }
}

const update = async <T>(key: Deno.KvKey, updatedData: T) => {
    try {
        const valRes = await kv.get(key)
        if (!valRes.value) throw new Error("Not found!");
        const newData = {
            ...valRes.value,
            ...updatedData
        }
        const updateRes = await kv.atomic()
            .check(valRes)
            .set(key, newData)
            .commit();
        return updateRes.ok;
    } catch (error) {
        throw error;
    }
}


const del = async <T>(key: Deno.KvKey) => {
    try {
        const valRes = await kv.get<T>(key)
        if (!valRes.value) throw new Error("Not found!");
        const deleteRes = await kv.atomic()
            .check(valRes)
            .delete(key)
            .commit()
        return deleteRes.ok;
    } catch (error) {
        throw error;
    }
}

export {
    list,
    get,
    insert,
    del,
    update
}